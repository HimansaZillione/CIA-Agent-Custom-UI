import { useState } from 'react'
import jabraProducts from '../config/jabraProducts'

export default function JabraCatalogue({ onCta }) {
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
        <button
          onClick={() => {
            if (onCta) onCta(`I would like a quote for the Jabra ${selected.label}`)
          }}
          style={{
            marginTop: '8px',
            padding: '10px 16px',
            background: '#0078d4',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer',
            fontSize: '14px',
            fontWeight: 600,
          }}
        >
          Get a quote
        </button>
      </div>
    )
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
      <h3 style={{ margin: '0 0 8px 0', fontSize: '15px' }}>Jabra Product Catalogue</h3>
      {jabraProducts.map(product => (
        <button
          key={product.id}
          onClick={() => setSelected(product)}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            padding: '10px 12px',
            background: 'rgba(255,255,255,0.05)',
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: '8px',
            cursor: 'pointer',
            color: 'inherit',
            textAlign: 'left',
            width: '100%',
            boxSizing: 'border-box',
          }}
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
  )
}
