import { useState } from 'react'
import { marked } from 'marked'
import { PANEL } from '../hooks/useContextPanel'
import products from '../config/products'
import AdaptiveCard from './AdaptiveCard'
import JabraCatalogue from './JabraCatalogue'

// ── Product view ──────────────────────────────────────────────────────────────
function ProductView({ tag, onCta }) {
  const p = products[tag]
  const [src, setSrc] = useState(p?.image)

  if (!p) return <div className="ctx-empty">Product not found.</div>
  return (
    <div className="ctx-product">
      <img 
        src={src} 
        alt={p.label} 
        className="ctx-product-img" 
        onError={() => setSrc(p.imageFallback)} 
      />
      <div className="ctx-product-body">
        <h2 className="ctx-product-name">{p.label}</h2>
        <p className="ctx-product-tagline">{p.tagline}</p>
        <p className="ctx-product-desc">{p.description}</p>
        <ul className="ctx-product-specs">
          {p.specs.map((s, i) => (
            <li key={i}><span className="ctx-check">✓</span>{s}</li>
          ))}
        </ul>
        {p.cta && (
          <button className="ctx-cta-btn" onClick={() => onCta(p.ctaMsg)}>{p.cta}</button>
        )}
      </div>
    </div>
  )
}

// ── Form view (adaptive card or fallback) ─────────────────────────────────────
function FormView({ cardJson, onSubmit, onClose }) {
  const [done, setDone] = useState(false)
  const [form, setForm] = useState({ name: '', email: '', company: '', message: '' })
  const [sending, setSending] = useState(false)

  const handleSubmit = async (data) => {
    setSending(true)
    await onSubmit(data)
    setSending(false)
    setDone(true)
    setTimeout(onClose, 3000)
  }

  if (done) return (
    <div className="ctx-done">
      <div style={{ fontSize: 40 }}>✅</div>
      <p style={{ fontWeight: 600, color: '#D4AF37', marginTop: 12 }}>Enquiry received!</p>
      <p style={{ fontSize: 13, color: '#B0B0B0', marginTop: 6 }}>Our team will be in touch shortly.</p>
    </div>
  )

  if (cardJson) return (
    <div className="ctx-form-wrap">
      <p className="ctx-form-intro">Fill in the form and a team member will get back to you.</p>
      <AdaptiveCard cardJson={cardJson} onSubmit={handleSubmit} />
    </div>
  )

  // Fallback form
  const f = (id, label, type = 'text', ph = '') => (
    <div className="ctx-field" key={id}>
      <label>{label}</label>
      {type === 'textarea'
        ? <textarea rows={3} placeholder={ph} value={form[id]} onChange={e => setForm(v => ({ ...v, [id]: e.target.value }))} />
        : <input type={type} placeholder={ph} value={form[id]} onChange={e => setForm(v => ({ ...v, [id]: e.target.value }))} />
      }
    </div>
  )
  return (
    <div className="ctx-form-wrap">
      <p className="ctx-form-intro">Fill in the form and a team member will get back to you.</p>
      {f('name',    'Full name',       'text',     'Jane Smith')}
      {f('email',   'Work email',      'email',    'jane@company.com')}
      {f('company', 'Company',         'text',     'Acme Ltd')}
      {f('message', 'How can we help?','textarea', 'Tell us about your needs…')}
      <button className="ctx-cta-btn" onClick={() => handleSubmit(form)} disabled={sending || !form.name || !form.email}>
        {sending ? 'Sending…' : 'Submit enquiry'}
      </button>
    </div>
  )
}

// ── Info view ─────────────────────────────────────────────────────────────────
function InfoView({ content }) {
  if (!content) return <div className="ctx-empty">No information available.</div>
  return <div className="ctx-info" dangerouslySetInnerHTML={{ __html: marked.parse(content) }} />
}

// ── Main panel ────────────────────────────────────────────────────────────────
export default function ContextPanel({ panel, onClose, onReopen, onSubmit, onCta }) {
  const { open, mode, payload } = panel

  const title = {
    [PANEL.PRODUCT]: '📦 Product Details',
    [PANEL.FORM]:    '📋 Contact Us',
    [PANEL.INFO]:    'ℹ️ More Info',
  }[mode] ?? 'Details'

  return (
    <>
      <div className={`ctx-overlay ${open ? 'open' : ''}`} onClick={onClose} />
      
      {!open && (
        <button className="ctx-toggle" onClick={onReopen} aria-label="Open Sidebar">
          ◀
        </button>
      )}

      <div className={`ctx-panel ${open ? 'open' : ''}`}>
        <div className="ctx-header">
          <h3>{title}</h3>
          <button className="ctx-close" onClick={onClose}>✕</button>
        </div>
        <div className="ctx-body">
          {mode === PANEL.PRODUCT && payload?.tag && (
            <ProductView key={payload.tag} tag={payload.tag} onCta={onCta} />
          )}
          {mode === PANEL.FORM && (
            <FormView cardJson={payload?.cardJson} onSubmit={onSubmit} onClose={onClose} />
          )}
          {mode === PANEL.INFO && (
            <InfoView content={payload?.content} />
          )}

          <div style={{
            marginTop: '24px',
            padding: '16px 24px',
            borderTop: '1px solid rgba(255,255,255,0.1)'
          }}>
            <JabraCatalogue onCta={onCta} />
          </div>
        </div>
      </div>
    </>
  )
}
