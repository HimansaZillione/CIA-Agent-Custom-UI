import { useState } from 'react'
import cyberSecurityProducts from '../config/cyberSecurityProducts'

const S = {
  card: { display:'flex', alignItems:'center', gap:'14px', padding:'11px 14px', background:'rgba(233,30,140,0.04)', border:'1px solid rgba(233,30,140,0.1)', borderRadius:'14px', cursor:'pointer', color:'inherit', textAlign:'left', width:'100%', boxSizing:'border-box', transition:'all 0.22s cubic-bezier(0.4,0,0.2,1)' },
  cta:  { width:'100%', padding:'13px', background:'linear-gradient(135deg,#E91E8C,#9333EA)', border:'none', borderRadius:'12px', color:'#fff', fontSize:'13.5px', fontWeight:600, fontFamily:'Outfit,sans-serif', letterSpacing:'0.02em', cursor:'pointer', boxShadow:'0 6px 20px rgba(233,30,140,0.35)', transition:'transform 0.2s, box-shadow 0.2s' },
}

function SpecItem({ text }) {
  return (
    <div style={{ display:'flex', alignItems:'flex-start', gap:'9px', padding:'8px 11px', background:'rgba(233,30,140,0.04)', border:'1px solid rgba(233,30,140,0.08)', borderRadius:'9px' }}>
      <span style={{ color:'#4ade80', fontWeight:700, fontSize:'11px', marginTop:'1px', flexShrink:0 }}>✓</span>
      <span style={{ fontSize:'12.5px', color:'#C8D0DC', lineHeight:1.4 }}>{text}</span>
    </div>
  )
}

export default function CyberSecurityCatalogue({ onCta, onOpenForm }) {
  const [selected, setSelected] = useState(null)
  const [tab, setTab] = useState('overview')

  if (selected) {
    return (
      <div style={{ display:'flex', flexDirection:'column' }}>
        <div style={{ background:'radial-gradient(ellipse at 50% 20%,rgba(233,30,140,0.12),#07071A 72%)', borderBottom:'1px solid rgba(233,30,140,0.08)', padding:'24px 20px', display:'flex', flexDirection:'column', alignItems:'center', gap:'14px', position:'relative' }}>
          <button
            onClick={() => { setSelected(null); setTab('overview') }}
            style={{ position:'absolute', top:'12px', left:'14px', display:'flex', alignItems:'center', gap:'5px', background:'rgba(233,30,140,0.08)', border:'1px solid rgba(233,30,140,0.18)', borderRadius:'8px', padding:'5px 11px', cursor:'pointer', color:'#E91E8C', fontSize:'11.5px', fontFamily:'DM Sans,sans-serif' }}
          >
            ← Back
          </button>
          <img
            src={selected.image}
            alt={selected.label}
            style={{ maxWidth:'100%', maxHeight:'140px', objectFit:'contain', borderRadius:'8px' }}
            onError={e => { e.target.style.display='none' }}
          />
          <div style={{ textAlign:'center' }}>
            <div style={{ display:'inline-flex', alignItems:'center', background:'rgba(233,30,140,0.1)', color:'#E91E8C', border:'1px solid rgba(233,30,140,0.2)', borderRadius:'20px', padding:'3px 10px', fontSize:'10px', fontWeight:600, letterSpacing:'0.05em', textTransform:'uppercase', marginBottom:'6px' }}>
              Security Solution
            </div>
            <h3 style={{ margin:0, fontFamily:'Outfit,sans-serif', fontSize:'18px', fontWeight:700, color:'#F8FAFC' }}>{selected.label}</h3>
          </div>
        </div>

        <div style={{ padding:'14px 18px', display:'flex', flexDirection:'column', gap:'14px' }}>
          <div style={{ display:'flex', gap:'4px', background:'rgba(255,255,255,0.04)', borderRadius:'10px', padding:'3px' }}>
            {['overview','specs'].map(t => (
              <button key={t} onClick={() => setTab(t)} style={{ flex:1, padding:'7px', borderRadius:'7px', border:'none', cursor:'pointer', fontSize:'12px', fontWeight:500, fontFamily:'Outfit,sans-serif', background: tab===t ? '#E91E8C' : 'transparent', color: tab===t ? '#fff' : '#8B9AB4', transition:'all 0.18s' }}>
                {t.charAt(0).toUpperCase()+t.slice(1)}
              </button>
            ))}
          </div>

          {tab === 'overview' && (
            <p style={{ margin:0, fontSize:'13.5px', color:'#8B9AB4', lineHeight:1.65 }}>{selected.description}</p>
          )}

          {tab === 'specs' && (
            <div style={{ display:'flex', flexDirection:'column', gap:'6px' }}>
              {(selected.specs || ['Enterprise-grade protection','24/7 monitoring','Compliance ready','Rapid deployment']).map((s,i) => (
                <SpecItem key={i} text={s} />
              ))}
            </div>
          )}

          <div style={{ display:'flex', gap:'8px' }}>
            <button
              onClick={() => onCta?.(`Tell me more about ${selected.label}`)}
              style={{ flex:1, padding:'11px', background:'rgba(255,255,255,0.04)', color:'#F8FAFC', border:'1px solid rgba(255,255,255,0.1)', borderRadius:'10px', cursor:'pointer', fontSize:'13px', fontWeight:500, fontFamily:'DM Sans,sans-serif', transition:'all 0.2s' }}
              onMouseOver={e => { e.currentTarget.style.borderColor='rgba(233,30,140,0.35)'; e.currentTarget.style.color='#E91E8C' }}
              onMouseOut={e => { e.currentTarget.style.borderColor='rgba(255,255,255,0.1)'; e.currentTarget.style.color='#F8FAFC' }}
            >
              Ask in chat
            </button>
            <button
              onClick={() => onOpenForm?.()}
              style={{ flex:1, padding:'11px', background:'linear-gradient(135deg,#E91E8C,#9333EA)', color:'#fff', border:'none', borderRadius:'10px', cursor:'pointer', fontSize:'13px', fontWeight:600, fontFamily:'Outfit,sans-serif', boxShadow:'0 4px 14px rgba(233,30,140,0.35)', transition:'all 0.2s' }}
              onMouseOver={e => e.currentTarget.style.boxShadow='0 6px 20px rgba(233,30,140,0.55)'}
              onMouseOut={e => e.currentTarget.style.boxShadow='0 4px 14px rgba(233,30,140,0.35)'}
            >
              Get a quote
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div style={{ display:'flex', flexDirection:'column', gap:'12px', padding:'18px' }}>
      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between' }}>
        <h3 style={{ margin:0, fontSize:'15px', fontWeight:600, fontFamily:'Outfit,sans-serif', color:'var(--text)' }}>Security Portfolio</h3>
        <span style={{ background:'rgba(233,30,140,0.1)', color:'#E91E8C', border:'1px solid rgba(233,30,140,0.2)', borderRadius:'12px', padding:'2px 9px', fontSize:'11px', fontWeight:600 }}>
          {cyberSecurityProducts.length} solutions
        </span>
      </div>

      <div style={{ display:'flex', flexDirection:'column', gap:'7px' }}>
        {cyberSecurityProducts.map(product => (
          <button
            key={product.id}
            onClick={() => { setSelected(product); setTab('overview') }}
            style={S.card}
            onMouseOver={e => { e.currentTarget.style.background='rgba(233,30,140,0.09)'; e.currentTarget.style.borderColor='rgba(233,30,140,0.28)'; e.currentTarget.style.transform='translateY(-2px)'; e.currentTarget.style.boxShadow='0 6px 20px rgba(0,0,0,0.25)' }}
            onMouseOut={e => { e.currentTarget.style.background='rgba(233,30,140,0.04)'; e.currentTarget.style.borderColor='rgba(233,30,140,0.1)'; e.currentTarget.style.transform='translateY(0)'; e.currentTarget.style.boxShadow='none' }}
          >
            <div style={{ width:'52px', height:'52px', borderRadius:'10px', background:'rgba(255,255,255,0.04)', border:'1px solid rgba(255,255,255,0.07)', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0, overflow:'hidden' }}>
              <img src={product.image} alt={product.label} style={{ width:'42px', height:'42px', objectFit:'contain' }} onError={e => { e.target.style.display='none' }} />
            </div>
            <div style={{ flex:1, minWidth:0 }}>
              <div style={{ fontSize:'13.5px', fontWeight:600, color:'var(--text)', fontFamily:'Outfit,sans-serif', marginBottom:'2px', whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis' }}>{product.label}</div>
              {product.tagline && <div style={{ fontSize:'11.5px', color:'var(--text-muted)', lineHeight:1.35 }}>{product.tagline}</div>}
            </div>
            <div style={{ color:'rgba(233,30,140,0.6)', fontSize:'18px', flexShrink:0 }}>›</div>
          </button>
        ))}
      </div>

      <button
        onClick={() => onOpenForm?.()}
        style={S.cta}
        onMouseOver={e => { e.currentTarget.style.transform='translateY(-2px)'; e.currentTarget.style.boxShadow='0 10px 28px rgba(233,30,140,0.5)' }}
        onMouseOut={e => { e.currentTarget.style.transform='translateY(0)'; e.currentTarget.style.boxShadow='0 6px 20px rgba(233,30,140,0.35)' }}
      >
        Book a security assessment
      </button>
    </div>
  )
}