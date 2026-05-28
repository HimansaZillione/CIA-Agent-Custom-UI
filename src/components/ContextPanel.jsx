import { useState } from 'react'
import { marked } from 'marked'
import { PANEL } from '../hooks/useContextPanel'
import products from '../config/products'
import AdaptiveCard from './AdaptiveCard'
import JabraCatalogue from './JabraCatalogue'
import LocationPanel from './LocationPanel'
import DashboardCatalogue from './DashboardCatalogue'

// ── Product view ──────────────────────────────────────────────────────────────
function ProductView({ tag, onCta, onOpenForm }) {
  if (tag === 'location') {
    return <LocationPanel />
  }
  const p = products[tag]
  const [src, setSrc] = useState(p?.image)

  if (!p) return <div className="ctx-empty">Product not found.</div>
  return (
    <div className="ctx-product">
      <div className="ctx-product-hero">
            <img
              src={src}
              alt={p.label}
              className="ctx-product-img"
              onError={() => setSrc(p.imageFallback)}
            />
            <div className="ctx-product-img-fade" />
          </div>
      <div className="ctx-product-body">
        <h2 className="ctx-product-name">{p.label}</h2>
        <p className="ctx-product-tagline">{p.tagline}</p>
        <p className="ctx-product-desc">{p.description}</p>
        <ul className="ctx-product-specs">
          {(p.specs || []).map((s, i) => (
            <li key={i}><span className="ctx-check">✓</span>{s}</li>
          ))}
        </ul>

        {/* CTA Button */}
        {tag !== 'jabra' && tag !== 'dashboard' && (
          <button 
            className="ctx-cta-btn" 
            onClick={onOpenForm}
            style={{ width: '100%', marginTop: '20px' }}
          >
            {p.cta}
          </button>
        )}
      </div>
    </div>
  )
}

// ── Form view (adaptive card or fallback) ─────────────────────────────────────
function FormView({ cardJson, onSubmit, onClose }) {
  const [done, setDone] = useState(false)
  const [formData, setFormData] = useState(null)
  const [form, setForm] = useState({ name: '', email: '', company: '', message: '' })
  const [sending, setSending] = useState(false)

  const handleSubmit = async (data) => {
    setSending(true)
    setFormData(data)
    await onSubmit(data)
    setSending(false)
    setDone(true)
  }

  if (done) {
    const name = formData?.customerName || formData?.name || 'Customer'
    const title = formData?.Jobtitle || 'N/A'
    const company = formData?.companyName || formData?.company || 'N/A'
    const email = formData?.Email || formData?.email || 'N/A'
    const mobile = formData?.MobileNumber || 'N/A'

    const waMessage = `Hi, I'm ${name}. I asked to speak with a live agent and provided my contact information for escalation:

- Name: ${name}
- Title: ${title}
- Company: ${company}
- Email: ${email}
- Mobile: ${mobile}

The AI Agent explained that they had set up an escalation to the WhatsApp option so that I could continue the conversation with a live agent. My query was effectively escalated.`
    const waUrl = `https://api.whatsapp.com/send?phone=94742561609&text=${encodeURIComponent(waMessage)}`

    return (
      <div className="ctx-done">
        <div style={{ fontSize: 40 }}>✅</div>
        <p style={{ fontWeight: 600, color: '#D4AF37', marginTop: 12 }}>Enquiry received!</p>
        <p style={{ fontSize: 13, color: '#B0B0B0', marginTop: 6, marginBottom: 20 }}>Our team will be in touch shortly.</p>
        
        <a 
          href={waUrl}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            padding: '12px 24px',
            background: '#25D366',
            color: 'white',
            borderRadius: '10px',
            textDecoration: 'none',
            fontSize: '14px',
            fontWeight: 600,
            boxShadow: '0 4px 12px rgba(37, 211, 102, 0.3)',
            transition: 'transform 0.2s'
          }}
          onMouseOver={e => e.currentTarget.style.transform = 'scale(1.05)'}
          onMouseOut={e => e.currentTarget.style.transform = 'scale(1)'}
        >
          <span style={{ fontSize: '18px' }}>💬</span>
          Chat on WhatsApp
        </a>
      </div>
    )
  }

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
export default function ContextPanel({ panel, onClose, onReopen, onOpenForm, onSubmit, onCta }) {
  const { open, mode, payload } = panel

  const title = {
    [PANEL.PRODUCT]: '📦 Product Details',
    [PANEL.FORM]:    '📋 Contact Us',
    [PANEL.INFO]:    'ℹ️ More Info',
    [PANEL.MAP]:     '🗺️ Location Map'
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
            <ProductView key={payload.tag} tag={payload.tag} onCta={onCta} onOpenForm={onOpenForm} />
          )}
          {mode === PANEL.FORM && (
            <FormView cardJson={payload?.cardJson} onSubmit={onSubmit} onClose={onClose} />
          )}
          {mode === PANEL.INFO && (
            <InfoView content={payload?.content} />
          )}

          {payload?.tag === 'jabra' && (
            <div style={{
              marginTop: '24px',
              padding: '16px 24px',
              borderTop: '1px solid rgba(255,255,255,0.1)'
            }}>
              <JabraCatalogue onCta={onCta} onOpenForm={onOpenForm} />
            </div>
          )}

          {payload?.tag === 'dashboard' && (
            <div style={{
              marginTop: '24px',
              padding: '16px 24px',
              borderTop: '1px solid rgba(255,255,255,0.1)'
            }}>
              <DashboardCatalogue onCta={onCta} onOpenForm={onOpenForm} />
            </div>
          )}
        </div>
      </div>
    </>
  )
}