import { useState } from 'react'
import jabraProducts from '../config/jabraProducts'

export default function JabraCatalogue({ onCta, onOpenForm }) {
  const [selected, setSelected] = useState(null)

  if (selected) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        <button
          onClick={() => setSelected(null)}
          style={{
            alignSelf: 'flex-start',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            color: 'inherit',
            fontSize: '13px',
            opacity: 0.7,
            padding: 0,
            marginBottom: '4px'
          }}
        >
          ← Back to all products
        </button>
        <img
          src={selected.image}
          alt={selected.label}
          style={{ width: '100%', borderRadius: '8px', objectFit: 'contain', maxHeight: '120px' }}
          onError={e => { e.target.style.display = 'none' }}
        />
        <h3 style={{ margin: 0 }}>{selected.label}</h3>
        <p style={{ margin: 0, opacity: 0.8, fontSize: '14px', lineHeight: '1.5' }}>{selected.description}</p>
        <div style={{ display: 'flex', gap: '8px', marginTop: '12px' }}>
          <button
            onClick={() => {
              if (onCta) onCta(`Tell me more about the Jabra ${selected.label}`)
            }}
            style={{
              flex: 1,
              padding: '12px 10px',
              background: 'rgba(255, 255, 255, 0.05)',
              color: '#F8FAFC',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '10px',
              cursor: 'pointer',
              fontSize: '13px',
              fontWeight: 600,
              transition: 'all 0.2s',
            }}
          >
            View details
          </button>
          <button
            onClick={() => {
              if (onOpenForm) onOpenForm()
            }}
            style={{
              flex: 1,
              padding: '12px 10px',
              background: 'linear-gradient(135deg, var(--accent), var(--accent2))',
              color: '#fff',
              border: 'none',
              borderRadius: '10px',
              cursor: 'pointer',
              fontSize: '13px',
              fontWeight: 600,
              boxShadow: '0 4px 12px rgba(233, 30, 140, 0.35)',
              transition: 'all 0.2s',
            }}
          >
            Get a quote
          </button>
        </div>
      </div>
    )
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
      <h3 style={{ margin: '0 0 4px 0', fontSize: '15px', fontWeight: 600 }}>Jabra Product Catalogue</h3>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {jabraProducts.map(product => (
          <button
            key={product.id}
            onClick={() => setSelected(product)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              padding: '10px 12px',
              background: 'rgba(233,30,140,0.04)',
              border: '1px solid rgba(233,30,140,0.12)',
              borderRadius: '12px',
              cursor: 'pointer',
              color: 'inherit',
              textAlign: 'left',
              width: '100%',
              boxSizing: 'border-box',
              transition: 'transform 0.2s, background 0.2s'
            }}
            onMouseOver={e => e.currentTarget.style.background = 'rgba(233,30,140,0.08)'}
            onMouseOut={e => e.currentTarget.style.background = 'rgba(233,30,140,0.04)'}
          >
            <img
              src={product.image}
              alt={product.label}
              style={{ width: '40px', height: '40px', objectFit: 'cover', borderRadius: '4px', flexShrink: 0 }}
              onError={e => { e.target.style.display = 'none' }}
            />
            <span style={{ fontSize: '14px', fontWeight: 500 }}>{product.label}</span>
          </button>
        ))}
      </div>
      
      <button
        onClick={() => {
          if (onOpenForm) onOpenForm()
        }}
        style={{
          marginTop: '8px',
          padding: '12px',
          background: 'linear-gradient(135deg, var(--accent), var(--accent2))',
          color: 'white',
          border: 'none',
          borderRadius: '12px',
          cursor: 'pointer',
          fontSize: '14px',
          fontWeight: 600,
          boxShadow: '0 4px 12px rgba(233, 30, 140, 0.35)',
          transition: 'transform 0.2s'
        }}
        onMouseOver={e => e.currentTarget.style.transform = 'scale(1.02)'}
        onMouseOut={e => e.currentTarget.style.transform = 'scale(1)'}
      >
        Get a quote for Jabra devices
      </button>
    </div>
  )
}