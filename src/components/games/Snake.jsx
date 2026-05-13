import { useEffect, useRef } from 'react'

export default function Snake({ active }) {
  const canvasRef  = useRef(null)
  const animRef    = useRef(null)
  const scoreRef   = useRef(null)
  const bestRef    = useRef(null)

  useEffect(() => {
    if (!active || !canvasRef.current) return
    const canvas = canvasRef.current
    const ctx    = canvas.getContext('2d')
    const W = canvas.width, H = canvas.height
    const GRID=15, GW=Math.floor(W/GRID), GH=Math.floor(H/GRID)

    let snake, food, score, best, direction, nextDir, gameState, frame
    best = parseInt(localStorage.getItem('snake_best') || '0')
    if (bestRef.current) bestRef.current.textContent = best

    function spawnFood() {
      let f
      do { f = { x: Math.floor(Math.random()*GW), y: Math.floor(Math.random()*GH) } }
      while (snake.some(s => s.x===f.x && s.y===f.y))
      food = f
    }

    function reset() {
      snake = [{ x: Math.floor(GW/2), y: Math.floor(GH/2) }]
      direction = { x:1, y:0 }; nextDir = { x:1, y:0 }
      spawnFood(); score = 0; gameState = 'idle'; frame = 0
      if (scoreRef.current) scoreRef.current.textContent = 0
    }

    const onKey = (e) => {
      if (!active) return
      const k = e.key.toLowerCase()
      if (k==='arrowup'||k==='w')    { e.preventDefault(); if (direction.y===0) nextDir={x:0,y:-1} }
      if (k==='arrowdown'||k==='s')  { e.preventDefault(); if (direction.y===0) nextDir={x:0,y:1} }
      if (k==='arrowleft'||k==='a')  { e.preventDefault(); if (direction.x===0) nextDir={x:-1,y:0} }
      if (k==='arrowright'||k==='d') { e.preventDefault(); if (direction.x===0) nextDir={x:1,y:0} }
      if (gameState==='idle') gameState='playing'
      if (gameState==='over') reset()
    }
    document.addEventListener('keydown', onKey)

    function update() {
      frame++
      if (gameState!=='playing') return
      if (frame%8!==0) return
      direction = nextDir
      const head = snake[0]
      const newHead = { x: head.x+direction.x, y: head.y+direction.y }
      if (newHead.x<0||newHead.x>=GW||newHead.y<0||newHead.y>=GH) { gameState='over'; return }
      if (snake.some(s=>s.x===newHead.x&&s.y===newHead.y)) { gameState='over'; return }
      snake.unshift(newHead)
      if (newHead.x===food.x && newHead.y===food.y) {
        score++
        if (scoreRef.current) scoreRef.current.textContent = score
        if (score > best) { best=score; localStorage.setItem('snake_best',best); if (bestRef.current) bestRef.current.textContent = best }
        spawnFood()
      } else { snake.pop() }
    }

    function draw() {
      ctx.fillStyle='#0a0a0e'; ctx.fillRect(0,0,W,H)
      ctx.strokeStyle='rgba(212,175,55,0.1)'; ctx.lineWidth=0.5
      for (let i=0;i<=GW;i++) { ctx.beginPath(); ctx.moveTo(i*GRID,0); ctx.lineTo(i*GRID,H); ctx.stroke() }
      for (let i=0;i<=GH;i++) { ctx.beginPath(); ctx.moveTo(0,i*GRID); ctx.lineTo(W,i*GRID); ctx.stroke() }
      ctx.fillStyle='#D4AF37'
      for (const s of snake) ctx.fillRect(s.x*GRID+1,s.y*GRID+1,GRID-2,GRID-2)
      ctx.fillStyle='#4CAF50'; ctx.fillRect(food.x*GRID+1,food.y*GRID+1,GRID-2,GRID-2)
      ctx.textAlign='center'
      if (gameState==='idle') { ctx.fillStyle='rgba(0,0,0,0.5)'; ctx.fillRect(0,0,W,H); ctx.fillStyle='#F5F5DC'; ctx.font="bold 16px 'DM Sans'"; ctx.fillText('Press any arrow key',W/2,H/2-10); ctx.fillStyle='#B0B0B0'; ctx.font="12px 'DM Sans'"; ctx.fillText('or use WASD to start',W/2,H/2+12) }
      if (gameState==='over') { ctx.fillStyle='rgba(0,0,0,0.7)'; ctx.fillRect(0,0,W,H); ctx.fillStyle='#f472b6'; ctx.font="bold 18px 'DM Sans'"; ctx.fillText('Game Over!',W/2,H/2-20); ctx.fillStyle='#F5F5DC'; ctx.font="14px 'DM Sans'"; ctx.fillText('Score: '+score,W/2,H/2+4); ctx.fillStyle='#B0B0B0'; ctx.font="12px 'DM Sans'"; ctx.fillText('Press any key to restart',W/2,H/2+24) }
    }

    function loop() { update(); draw(); animRef.current = requestAnimationFrame(loop) }
    reset()
    if (animRef.current) cancelAnimationFrame(animRef.current)
    loop()

    return () => { cancelAnimationFrame(animRef.current); document.removeEventListener('keydown', onKey) }
  }, [active])

  return (
    <>
      <div className="snake-score-display">Score: <span ref={scoreRef}>0</span> &nbsp;|&nbsp; Best: <span ref={bestRef}>0</span></div>
      <canvas ref={canvasRef} width="268" height="330" style={{ borderRadius: 10, border: '1px solid rgba(212,175,55,0.3)', cursor: 'pointer', display: 'block', background: '#0a0a0e' }} />
      <div className="snake-hint">Arrow keys or WASD to move</div>
    </>
  )
}
