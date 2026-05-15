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

  const handleSubmit = async (data) => {
    await onSubmit(data)
    setSubmitted(true)
    setTimeout(onClose, 3000)
  }

  if (submitted) {
    return (
      <div className="ctx-done">
        <div style={{ fontSize: 40 }}>✅</div>
        <p style={{ fontWeight: 600, color: '#D4AF37', marginTop: 12 }}>Enquiry received!</p>
        <p style={{ fontSize: 13, color: '#B0B0B0', marginTop: 6 }}>
          Our team will be in touch shortly.
        </p>
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