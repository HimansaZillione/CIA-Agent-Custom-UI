import { useState } from 'react'
import dashboardProducts from '../config/dashboardProducts'

export default function DashboardCatalogue({ onCta, onOpenForm }) {
  const [current, setCurrent] = useState(0)

  const total = dashboardProducts.length
  const item = dashboardProducts[current]

  const prev = () => setCurrent(i => (i - 1 + total) % total)
  const next = () => setCurrent(i => (i + 1) % total)

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
      
      <h3 style={{ 
        margin: 0, 
        fontSize: '15px', 
        fontFamily: 'Outfit, sans-serif',
        fontWeight: 600,
        color: 'var(--text)'
      }}>
        Dashboard Catalogue
      </h3>

      {/* Slideshow image */}
      <div style={{ position: 'relative', borderRadius: '12px', overflow: 'hidden', background: 'rgba(0,0,0,0.2)', border: '1px solid var(--border)' }}>
        <img
          src={item.image}
          alt={item.label}
          style={{ width: '100%', height: '240px', objectFit: 'contain', display: 'block' }}
          onError={e => { e.target.style.display = 'none' }}
        />

        {/* Prev button */}
        <button
          onClick={prev}
          style={{
            position: 'absolute', left: '8px', top: '50%', transform: 'translateY(-50%)',
            background: 'rgba(0,0,0,0.6)', color: 'white', border: 'none',
            backdropFilter: 'blur(4px)',
            borderRadius: '50%', width: '32px', height: '32px', cursor: 'pointer',
            fontSize: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center',
            transition: 'background 0.2s'
          }}
          onMouseOver={e => e.currentTarget.style.background = 'rgba(0,0,0,0.8)'}
          onMouseOut={e => e.currentTarget.style.background = 'rgba(0,0,0,0.6)'}
        >‹</button>

        {/* Next button */}
        <button
          onClick={next}
          style={{
            position: 'absolute', right: '8px', top: '50%', transform: 'translateY(-50%)',
            background: 'rgba(0,0,0,0.6)', color: 'white', border: 'none',
            backdropFilter: 'blur(4px)',
            borderRadius: '50%', width: '32px', height: '32px', cursor: 'pointer',
            fontSize: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center',
            transition: 'background 0.2s'
          }}
          onMouseOver={e => e.currentTarget.style.background = 'rgba(0,0,0,0.8)'}
          onMouseOut={e => e.currentTarget.style.background = 'rgba(0,0,0,0.6)'}
        >›</button>

        {/* Slide counter */}
        <div style={{
          position: 'absolute', bottom: '8px', right: '8px',
          background: 'rgba(0,0,0,0.6)', color: 'white',
          backdropFilter: 'blur(4px)',
          fontSize: '11px', padding: '2px 8px', borderRadius: '10px'
        }}>
          {current + 1} / {total}
        </div>
      </div>

      {/* Dot indicators */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: '8px' }}>
        {dashboardProducts.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            style={{
              width: '8px', height: '8px', borderRadius: '50%', border: 'none',
              cursor: 'pointer', padding: 0,
              background: i === current ? 'var(--accent)' : 'rgba(255,255,255,0.2)',
              transition: 'background 0.2s'
            }}
          />
        ))}
      </div>

      {/* Title and description */}
      <div style={{ marginBottom: '4px' }}>
        <h4 style={{ margin: '0 0 6px 0', fontSize: '15px', color: 'var(--text)' }}>{item.label}</h4>
        <p style={{ margin: 0, fontSize: '14px', opacity: 0.8, lineHeight: '1.6', color: 'var(--text-muted)' }}>{item.description}</p>
      </div>

      <button
        onClick={() => {
          if (onOpenForm) onOpenForm()
        }}
        style={{
          padding: '12px 16px',
          background: 'linear-gradient(135deg, var(--accent), var(--accent2))',
          color: 'white',
          border: 'none',
          borderRadius: '12px',
          cursor: 'pointer',
          fontSize: '14px',
          fontWeight: 600,
          boxShadow: '0 4px 12px rgba(99, 102, 241, 0.3)',
          transition: 'transform 0.2s'
        }}
        onMouseOver={e => e.currentTarget.style.transform = 'scale(1.02)'}
        onMouseOut={e => e.currentTarget.style.transform = 'scale(1)'}
      >
        Request a demo for these dashboards
      </button>

    </div>
  )
}
