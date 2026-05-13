import { useEffect, useRef } from 'react'

export default function FlappyBird({ active }) {
  const canvasRef  = useRef(null)
  const animRef    = useRef(null)
  const scoreRef   = useRef(null)
  const bestRef    = useRef(null)

  useEffect(() => {
    if (!active || !canvasRef.current) return
    const canvas = canvasRef.current
    const ctx    = canvas.getContext('2d')
    const W = canvas.width, H = canvas.height

    let bird, pipes, score, best, state, frame
    best = parseInt(localStorage.getItem('fb_best') || '0')
    if (bestRef.current) bestRef.current.textContent = best

    function reset() {
      bird = { x: 60, y: H/2, vy: 0, r: 13 }
      pipes = []; score = 0; state = 'idle'; frame = 0
      if (scoreRef.current) scoreRef.current.textContent = 0
    }

    function flap() {
      if (state === 'idle') state = 'playing'
      else if (state === 'dead') { reset(); return }
      bird.vy = -6.5
    }

    const onClick = () => flap()
    const onKey   = (e) => { if (e.code === 'Space' && active) { e.preventDefault(); flap() } }
    canvas.addEventListener('click', onClick)
    document.addEventListener('keydown', onKey)

    const GRAVITY=0.38, PW=36, GAP=112, SPEED=2.2

    function update() {
      frame++
      if (state !== 'playing') return
      bird.vy += GRAVITY; bird.y += bird.vy
      if (frame % 90 === 0) {
        const top = 50 + Math.random() * (H - GAP - 100)
        pipes.push({ x: W, top, scored: false })
      }
      for (const p of pipes) {
        p.x -= SPEED
        if (!p.scored && p.x + PW < bird.x) {
          p.scored = true; score++
          if (scoreRef.current) scoreRef.current.textContent = score
          if (score > best) { best = score; localStorage.setItem('fb_best', best); if (bestRef.current) bestRef.current.textContent = best }
        }
      }
      pipes = pipes.filter(p => p.x + PW > 0)
      if (bird.y - bird.r < 0 || bird.y + bird.r > H) { state = 'dead'; return }
      for (const p of pipes) {
        if (bird.x + bird.r > p.x && bird.x - bird.r < p.x + PW) {
          if (bird.y - bird.r < p.top || bird.y + bird.r > p.top + GAP) { state = 'dead'; return }
        }
      }
    }

    function draw() {
      ctx.fillStyle='#12121a'; ctx.fillRect(0,0,W,H)
      ctx.fillStyle='rgba(255,255,255,0.25)'
      for (let i=0;i<25;i++) ctx.fillRect((i*97+frame*0.15)%W,(i*61)%H,1.5,1.5)
      for (const p of pipes) {
        const g=ctx.createLinearGradient(p.x,0,p.x+PW,0); g.addColorStop(0,'#5a4fd4'); g.addColorStop(1,'#7c6dfa'); ctx.fillStyle=g
        ctx.beginPath(); ctx.roundRect(p.x,0,PW,p.top,[0,0,6,6]); ctx.fill()
        ctx.beginPath(); ctx.roundRect(p.x,p.top+GAP,PW,H-p.top-GAP,[6,6,0,0]); ctx.fill()
        ctx.fillStyle='#a78bfa'
        ctx.beginPath(); ctx.roundRect(p.x-3,p.top-12,PW+6,12,4); ctx.fill()
        ctx.beginPath(); ctx.roundRect(p.x-3,p.top+GAP,PW+6,12,4); ctx.fill()
      }
      ctx.save(); ctx.translate(bird.x,bird.y); ctx.rotate(Math.min(Math.max(bird.vy*0.06,-0.4),0.5))
      const bg=ctx.createRadialGradient(-2,-2,2,0,0,bird.r); bg.addColorStop(0,'#fff'); bg.addColorStop(1,'#a78bfa')
      ctx.fillStyle=bg; ctx.beginPath(); ctx.arc(0,0,bird.r,0,Math.PI*2); ctx.fill()
      ctx.fillStyle='#0f0f13'; ctx.beginPath(); ctx.arc(5,-3,3,0,Math.PI*2); ctx.fill()
      ctx.fillStyle='#fff'; ctx.beginPath(); ctx.arc(6,-4,1.2,0,Math.PI*2); ctx.fill()
      ctx.fillStyle='#f59e0b'; ctx.beginPath(); ctx.moveTo(10,0); ctx.lineTo(16,2); ctx.lineTo(10,4); ctx.closePath(); ctx.fill()
      ctx.restore()
      ctx.textAlign='center'
      if (state==='idle') { ctx.fillStyle='rgba(15,15,19,0.55)'; ctx.fillRect(0,0,W,H); ctx.fillStyle='#e8e8f0'; ctx.font="bold 17px 'DM Sans'"; ctx.fillText('Click to start',W/2,H/2-8); ctx.fillStyle='#888899'; ctx.font="12px 'DM Sans'"; ctx.fillText('or press Space',W/2,H/2+14) }
      if (state==='dead') { ctx.fillStyle='rgba(15,15,19,0.7)'; ctx.fillRect(0,0,W,H); ctx.fillStyle='#f472b6'; ctx.font="bold 20px 'DM Sans'"; ctx.fillText('Game Over!',W/2,H/2-20); ctx.fillStyle='#F5F5DC'; ctx.font="14px 'DM Sans'"; ctx.fillText('Score: '+score,W/2,H/2+4); ctx.fillStyle='#B0B0B0'; ctx.font="12px 'DM Sans'"; ctx.fillText('Click to restart',W/2,H/2+24) }
    }

    function loop() { update(); draw(); animRef.current = requestAnimationFrame(loop) }
    reset()
    if (animRef.current) cancelAnimationFrame(animRef.current)
    loop()

    return () => {
      cancelAnimationFrame(animRef.current)
      canvas.removeEventListener('click', onClick)
      document.removeEventListener('keydown', onKey)
    }
  }, [active])

  return (
    <>
      <div className="flappy-score-display">Score: <span ref={scoreRef}>0</span> &nbsp;|&nbsp; Best: <span ref={bestRef}>0</span></div>
      <canvas ref={canvasRef} width="268" height="330" style={{ borderRadius: 10, border: '1px solid rgba(212,175,55,0.3)', cursor: 'pointer', display: 'block' }} />
      <div className="flappy-hint">Click canvas or press Space to flap</div>
    </>
  )
}
