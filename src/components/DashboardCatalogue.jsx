import { useState, useEffect, useRef } from 'react'
import dashboardProducts from '../config/dashboardProducts'

const AUTOPLAY_MS = 4000

export default function DashboardCatalogue({ onCta, onOpenForm }) {
  const [current, setCurrent] = useState(0)
  const [playing, setPlaying] = useState(true)
  const [progress, setProgress] = useState(0)
  const timerRef = useRef(null)
  const progRef  = useRef(null)

  const total = dashboardProducts.length
  const item  = dashboardProducts[current]

  const goTo = (i) => { setCurrent(i); setProgress(0) }
  const prev = () => goTo((current - 1 + total) % total)
  const next = () => goTo((current + 1) % total)

  useEffect(() => {
    clearInterval(timerRef.current)
    clearInterval(progRef.current)
    if (!playing) return

    setProgress(0)
    const step = 100 / (AUTOPLAY_MS / 50)
    progRef.current = setInterval(() => {
      setProgress(p => Math.min(p + step, 100))
    }, 50)
    timerRef.current = setTimeout(() => {
      setCurrent(c => (c + 1) % total)
      setProgress(0)
    }, AUTOPLAY_MS)

    return () => { clearTimeout(timerRef.current); clearInterval(progRef.current) }
  }, [current, playing, total])

  return (
    <div style={{ display:'flex', flexDirection:'column', gap:'0' }}>
      <div style={{ padding:'18px 18px 0' }}>
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:'12px' }}>
          <h3 style={{ margin:0, fontSize:'15px', fontWeight:600, fontFamily:'Outfit,sans-serif', color:'var(--text)' }}>
            Dashboard Gallery
          </h3>
          <button
            onClick={() => setPlaying(p => !p)}
            style={{ display:'flex', alignItems:'center', gap:'5px', background:'rgba(233,30,140,0.08)', border:'1px solid rgba(233,30,140,0.2)', borderRadius:'8px', padding:'4px 10px', cursor:'pointer', color:'#E91E8C', fontSize:'11px', fontWeight:500, fontFamily:'DM Sans,sans-serif', transition:'all 0.18s' }}
            onMouseOver={e => e.currentTarget.style.background='rgba(233,30,140,0.15)'}
            onMouseOut={e => e.currentTarget.style.background='rgba(233,30,140,0.08)'}
          >
            {playing ? '⏸ Pause' : '▶ Play'}
          </button>
        </div>
      </div>

      <div
        style={{ position:'relative', overflow:'hidden', background:'rgba(0,0,0,0.3)', border:'1px solid rgba(233,30,140,0.1)', borderLeft:'none', borderRight:'none' }}
        onMouseEnter={() => setPlaying(false)}
        onMouseLeave={() => setPlaying(true)}
      >
        <img
          key={current}
          src={item.image}
          alt={item.label}
          style={{ width:'100%', height:'220px', objectFit:'contain', display:'block', transition:'opacity 0.3s ease' }}
          onError={e => { e.target.style.display='none' }}
        />

        <button
          onClick={prev}
          style={{ position:'absolute', left:'10px', top:'50%', transform:'translateY(-50%)', background:'rgba(7,7,26,0.75)', backdropFilter:'blur(8px)', color:'#fff', border:'1px solid rgba(233,30,140,0.2)', borderRadius:'50%', width:'34px', height:'34px', cursor:'pointer', fontSize:'18px', display:'flex', alignItems:'center', justifyContent:'center', transition:'all 0.2s' }}
          onMouseOver={e => { e.currentTarget.style.background='rgba(233,30,140,0.4)'; e.currentTarget.style.borderColor='rgba(233,30,140,0.6)' }}
          onMouseOut={e => { e.currentTarget.style.background='rgba(7,7,26,0.75)'; e.currentTarget.style.borderColor='rgba(233,30,140,0.2)' }}
        >‹</button>

        <button
          onClick={next}
          style={{ position:'absolute', right:'10px', top:'50%', transform:'translateY(-50%)', background:'rgba(7,7,26,0.75)', backdropFilter:'blur(8px)', color:'#fff', border:'1px solid rgba(233,30,140,0.2)', borderRadius:'50%', width:'34px', height:'34px', cursor:'pointer', fontSize:'18px', display:'flex', alignItems:'center', justifyContent:'center', transition:'all 0.2s' }}
          onMouseOver={e => { e.currentTarget.style.background='rgba(233,30,140,0.4)'; e.currentTarget.style.borderColor='rgba(233,30,140,0.6)' }}
          onMouseOut={e => { e.currentTarget.style.background='rgba(7,7,26,0.75)'; e.currentTarget.style.borderColor='rgba(233,30,140,0.2)' }}
        >›</button>

        <div style={{ position:'absolute', bottom:'8px', right:'10px', background:'rgba(7,7,26,0.8)', backdropFilter:'blur(6px)', color:'#8B9AB4', fontSize:'10.5px', padding:'2px 9px', borderRadius:'10px', border:'1px solid rgba(255,255,255,0.07)' }}>
          {current + 1} / {total}
        </div>

        <div style={{ position:'absolute', bottom:0, left:0, right:0, height:'3px', background:'rgba(255,255,255,0.08)' }}>
          <div style={{ height:'100%', width:`${progress}%`, background:'linear-gradient(90deg,#E91E8C,#9333EA)', transition:'width 0.05s linear', borderRadius:'0 2px 2px 0' }} />
        </div>
      </div>

      <div style={{ padding:'10px 18px', display:'flex', gap:'6px', justifyContent:'center' }}>
        {dashboardProducts.map((_, i) => (
          <button
            key={i}
            onClick={() => goTo(i)}
            style={{ height:'6px', borderRadius:'3px', border:'none', cursor:'pointer', padding:0, background: i === current ? '#E91E8C' : 'rgba(255,255,255,0.15)', width: i === current ? '20px' : '6px', transition:'all 0.3s cubic-bezier(0.4,0,0.2,1)' }}
          />
        ))}
      </div>

      <div style={{ padding:'0 18px 18px', display:'flex', flexDirection:'column', gap:'12px' }}>
        <div>
          <h4 style={{ margin:'0 0 5px', fontFamily:'Outfit,sans-serif', fontSize:'15px', fontWeight:600, color:'var(--text)' }}>{item.label}</h4>
          <p style={{ margin:0, fontSize:'13px', color:'var(--text-muted)', lineHeight:1.65 }}>{item.description}</p>
        </div>

        <div style={{ display:'flex', gap:'8px', overflowX:'auto', paddingBottom:'4px' }}>
          {dashboardProducts.map((d, i) => (
            <button
              key={i}
              onClick={() => goTo(i)}
              style={{ flexShrink:0, width:'60px', height:'42px', borderRadius:'8px', overflow:'hidden', border: i === current ? '2px solid #E91E8C' : '1px solid rgba(255,255,255,0.08)', cursor:'pointer', padding:0, background:'rgba(0,0,0,0.3)', transition:'all 0.2s', opacity: i === current ? 1 : 0.55 }}
              onMouseOver={e => { if (i !== current) e.currentTarget.style.opacity='0.85' }}
              onMouseOut={e => { if (i !== current) e.currentTarget.style.opacity='0.55' }}
            >
              <img src={d.image} alt={d.label} style={{ width:'100%', height:'100%', objectFit:'cover' }} onError={e => { e.target.style.display='none' }} />
            </button>
          ))}
        </div>

        <button
          onClick={() => onOpenForm?.()}
          style={{ padding:'13px', background:'linear-gradient(135deg,#E91E8C,#9333EA)', border:'none', borderRadius:'12px', color:'#fff', fontSize:'13.5px', fontWeight:600, fontFamily:'Outfit,sans-serif', cursor:'pointer', boxShadow:'0 6px 20px rgba(233,30,140,0.35)', transition:'transform 0.2s, box-shadow 0.2s', letterSpacing:'0.02em' }}
          onMouseOver={e => { e.currentTarget.style.transform='translateY(-2px)'; e.currentTarget.style.boxShadow='0 10px 28px rgba(233,30,140,0.5)' }}
          onMouseOut={e => { e.currentTarget.style.transform='translateY(0)'; e.currentTarget.style.boxShadow='0 6px 20px rgba(233,30,140,0.35)' }}
        >
          Request a demo
        </button>
      </div>
    </div>
  )
}