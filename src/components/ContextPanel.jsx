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
  const [tab, setTab] = useState('overview')

  if (tag === 'location') return <LocationPanel />

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

      <div style={{ padding:'20px 24px', borderBottom:'1px solid rgba(255,255,255,0.05)' }}>
        <div style={{ display:'inline-flex', alignItems:'center', background:'rgba(233,30,140,0.1)', color:'#E91E8C', border:'1px solid rgba(233,30,140,0.2)', borderRadius:'20px', padding:'3px 10px', fontSize:'10px', fontWeight:600, letterSpacing:'0.05em', textTransform:'uppercase', marginBottom:'10px' }}>
          {p.tagline || 'ZILLIONe Solution'}
        </div>
        <h2 style={{ margin:'0 0 0', fontFamily:'Outfit,sans-serif', fontSize:'22px', fontWeight:700, color:'#F8FAFC', lineHeight:1.2 }}>{p.label}</h2>
      </div>

      {tag !== 'jabra' && tag !== 'dashboard' && (
        <div style={{ padding:'0 24px', borderBottom:'1px solid rgba(255,255,255,0.05)' }}>
          <div style={{ display:'flex', gap:'4px', background:'rgba(255,255,255,0.04)', borderRadius:'10px', padding:'3px', margin:'14px 0' }}>
            {['overview','specs'].map(t => (
              <button key={t} onClick={() => setTab(t)} style={{ flex:1, padding:'8px', borderRadius:'7px', border:'none', cursor:'pointer', fontSize:'12.5px', fontWeight:500, fontFamily:'Outfit,sans-serif', background: tab===t ? '#E91E8C' : 'transparent', color: tab===t ? '#fff' : '#8B9AB4', transition:'all 0.18s' }}>
                {t.charAt(0).toUpperCase()+t.slice(1)}
              </button>
            ))}
          </div>
        </div>
      )}

      <div style={{ padding:'16px 24px', display:'flex', flexDirection:'column', gap:'12px' }}>

        {(tab === 'overview' || tag === 'jabra' || tag === 'dashboard') && (
          <p style={{ margin:0, fontSize:'14px', color:'#8B9AB4', lineHeight:1.7 }}>{p.description}</p>
        )}

        {tab === 'specs' && tag !== 'jabra' && tag !== 'dashboard' && (
          <ul style={{ listStyle:'none', margin:0, padding:0, display:'flex', flexDirection:'column', gap:'7px' }}>
            {(p.specs || []).map((s, i) => (
              <li
                key={i}
                style={{ display:'flex', alignItems:'flex-start', gap:'10px', padding:'9px 12px', background:'rgba(233,30,140,0.04)', border:'1px solid rgba(233,30,140,0.08)', borderRadius:'10px' }}
              >
                <span style={{ color:'#4ade80', fontWeight:700, fontSize:'12px', marginTop:'1px', flexShrink:0 }}>✓</span>
                <span style={{ fontSize:'13px', color:'#C8D0DC', lineHeight:1.5 }}>{s}</span>
              </li>
            ))}
          </ul>
        )}

        {tag !== 'jabra' && tag !== 'dashboard' && (
          <button
            className="ctx-cta-btn"
            onClick={onOpenForm}
            onMouseOver={e => { e.currentTarget.style.transform='translateY(-2px)'; e.currentTarget.style.boxShadow='0 10px 28px rgba(233,30,140,0.5)' }}
            onMouseOut={e => { e.currentTarget.style.transform='translateY(0)'; e.currentTarget.style.boxShadow='0 6px 20px rgba(233,30,140,0.35)' }}
          >
            {p.cta}
          </button>
        )}
      </div>

      {tag === 'jabra' && (
        <div style={{ padding:'0 24px 24px' }}>
          <div style={{ borderTop:'1px solid rgba(255,255,255,0.06)', paddingTop:'20px' }}>
            <JabraCatalogue onCta={onCta} onOpenForm={onOpenForm} />
          </div>
        </div>
      )}

      {tag === 'dashboard' && (
        <div style={{ borderTop:'1px solid rgba(255,255,255,0.06)' }}>
          <DashboardCatalogue onCta={onCta} onOpenForm={onOpenForm} />
        </div>
      )}
    </div>
  )
}

// ── Form view ─────────────────────────────────────────────────────────────────
function FormView({ cardJson, onSubmit, onClose }) {
  const [done, setDone]       = useState(false)
  const [formData, setFormData] = useState(null)
  const [form, setForm]       = useState({ name:'', email:'', company:'', message:'' })
  const [sending, setSending] = useState(false)

  const handleSubmit = async (data) => {
    setSending(true)
    setFormData(data)
    await onSubmit(data)
    setSending(false)
    setDone(true)
  }

  if (done) {
    const name    = formData?.customerName || formData?.name || 'Customer'
    const title   = formData?.Jobtitle     || 'N/A'
    const company = formData?.companyName  || formData?.company || 'N/A'
    const email   = formData?.Email        || formData?.email   || 'N/A'
    const mobile  = formData?.MobileNumber || 'N/A'

    const waMessage = `Hi, I'm ${name}. I asked to speak with a live agent and provided my contact information for escalation:\n\n- Name: ${name}\n- Title: ${title}\n- Company: ${company}\n- Email: ${email}\n- Mobile: ${mobile}\n\nThe AI Agent explained that they had set up an escalation to the WhatsApp option so that I could continue the conversation with a live agent. My query was effectively escalated.`
    const waUrl = `https://api.whatsapp.com/send?phone=94742561609&text=${encodeURIComponent(waMessage)}`

    return (
      <div className="ctx-done">
        <div style={{ fontSize:44 }}>✅</div>
        <p style={{ fontWeight:600, color:'#D4AF37', marginTop:12, fontFamily:'Outfit,sans-serif', fontSize:'16px' }}>Enquiry received!</p>
        <p style={{ fontSize:13, color:'#8B9AB4', marginTop:6, marginBottom:24, textAlign:'center', lineHeight:1.6 }}>
          Our team will be in touch with you shortly.
        </p>
        <a
          href={waUrl} target="_blank" rel="noopener noreferrer"
          style={{ display:'inline-flex', alignItems:'center', gap:'8px', padding:'13px 28px', background:'#25D366', color:'white', borderRadius:'12px', textDecoration:'none', fontSize:'14px', fontWeight:600, fontFamily:'Outfit,sans-serif', boxShadow:'0 6px 20px rgba(37,211,102,0.35)', transition:'transform 0.2s' }}
          onMouseOver={e => e.currentTarget.style.transform='translateY(-2px)'}
          onMouseOut={e => e.currentTarget.style.transform='translateY(0)'}
        >
          <span style={{ fontSize:'18px' }}>💬</span>
          Continue on WhatsApp
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

  const f = (id, label, type='text', ph='') => (
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
      {f('name',    'Full name',        'text',     'Jane Smith')}
      {f('email',   'Work email',       'email',    'jane@company.com')}
      {f('company', 'Company',          'text',     'Acme Ltd')}
      {f('message', 'How can we help?', 'textarea', 'Tell us about your needs…')}
      <button
        className="ctx-cta-btn"
        onClick={() => handleSubmit(form)}
        disabled={sending || !form.name || !form.email}
        onMouseOver={e => { if (!e.currentTarget.disabled) { e.currentTarget.style.transform='translateY(-1px)'; e.currentTarget.style.boxShadow='0 10px 28px rgba(233,30,140,0.5)' }}}
        onMouseOut={e => { e.currentTarget.style.transform='translateY(0)'; e.currentTarget.style.boxShadow='0 6px 20px rgba(233,30,140,0.35)' }}
      >
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
  }[mode] ?? 'Details'

  return (
    <>
      <div className={`ctx-overlay ${open ? 'open' : ''}`} onClick={onClose} />

      {!open && (
        <button className="ctx-toggle" onClick={onReopen} aria-label="Open Sidebar">◀</button>
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
        </div>
      </div>
    </>
  )
}