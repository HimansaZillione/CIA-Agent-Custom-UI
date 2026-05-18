import { useState } from 'react'
import AdaptiveCardRenderer from '../components/AdaptiveCard'

function FallbackForm({ onSubmit }) {
  const [form, setForm] = useState({
    customerName: '',
    Email: '',
    Jobtitle: '',
    companyName: '',
    MobileNumber: '',
    actionSubmitId: 'Submit'
  })
  const [submitting, setSubmitting] = useState(false)

  const handleSubmit = async () => {
    if (!form.customerName || !form.Email || !form.MobileNumber) return
    setSubmitting(true)
    await onSubmit(form)
    setSubmitting(false)
  }

  const field = (key, label, type = 'text', placeholder = '') => (
    <div className="ctx-field" key={key}>
      <label>{label}</label>
      <input
        type={type}
        placeholder={placeholder}
        value={form[key]}
        onChange={e => setForm(prev => ({ ...prev, [key]: e.target.value }))}
      />
    </div>
  )

  return (
    <div className="ctx-form-wrap">
      <p className="ctx-form-intro">Fill in the form and a team member will get back to you.</p>

      {field('customerName', 'Full Name *',     'text',  'Jane Smith')}
      {field('Jobtitle',     'Job Title',        'text',  'Manager')}
      {field('companyName',  'Company',          'text',  'Acme Ltd')}
      {field('Email',        'Work Email *',     'email', 'jane@company.com')}
      {field('MobileNumber', 'Mobile Number *',  'tel',   '+94 77 123 4567')}

      <button
        className="ctx-cta-btn"
        onClick={handleSubmit}
        disabled={submitting || !form.customerName || !form.Email || !form.MobileNumber}
      >
        {submitting ? 'Sending…' : 'Submit enquiry'}
      </button>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────

export default function EscalateFormPanel({ cardJson, onSubmit, onClose }) {
  const [submitted, setSubmitted] = useState(false)
  const [formData, setFormData] = useState(null)

  const handleSubmit = async (data) => {
    setFormData(data)
    await onSubmit(data)
    setSubmitted(true)
  }

  if (submitted) {
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
        <p style={{ fontSize: 13, color: '#B0B0B0', marginTop: 6, marginBottom: 20 }}>
          Our team will be in touch shortly.
        </p>

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

  return (
    <div className="ctx-escalate-panel">
      <p className="ctx-form-intro">
        Fill in the form below and a team member will get back to you.
      </p>

      {cardJson
        ? <AdaptiveCardRenderer cardJson={cardJson} onSubmit={handleSubmit} />
        : <FallbackForm onSubmit={handleSubmit} />
      }
    </div>
  )
}