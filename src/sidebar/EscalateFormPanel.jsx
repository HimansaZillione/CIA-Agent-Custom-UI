import { useState } from 'react'
import AdaptiveCardRenderer from '../components/AdaptiveCard'

// Fallback form used when no adaptive card JSON is provided by the bot.
// This can happen during development before the Copilot Studio topic is ready.
function FallbackForm({ onSubmit }) {
  const [form, setForm] = useState({ name: '', email: '', company: '', message: '' })
  const [submitting, setSubmitting] = useState(false)

  const handleSubmit = async () => {
    if (!form.name || !form.email || !form.message) return
    setSubmitting(true)
    await onSubmit(form)
    setSubmitting(false)
  }

  const field = (id, label, type = 'text', placeholder = '') => (
    <div className="ca-form-group">
      <label className="ca-form-label" htmlFor={id}>{label}</label>
      {type === 'textarea' ? (
        <textarea
          id={id}
          className="ca-form-input"
          rows={3}
          placeholder={placeholder}
          value={form[id]}
          onChange={e => setForm(prev => ({ ...prev, [id]: e.target.value }))}
        />
      ) : (
        <input
          id={id}
          type={type}
          className="ca-form-input"
          placeholder={placeholder}
          value={form[id]}
          onChange={e => setForm(prev => ({ ...prev, [id]: e.target.value }))}
        />
      )}
    </div>
  )

  return (
    <div className="ca-form">
      {field('name',    'Full name',    'text',  'Jane Smith')}
      {field('email',   'Work email',   'email', 'jane@company.com')}
      {field('company', 'Company',      'text',  'Acme Ltd')}
      {field('message', 'How can we help?', 'textarea', 'Tell us about your needs…')}

      <button
        className="ca-form-submit"
        onClick={handleSubmit}
        disabled={submitting || !form.name || !form.email || !form.message}
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
    await onSubmit(data) // sends value activity back to bot → Escalate topic → Power Automate
    setSubmitted(true)
    setTimeout(onClose, 3000) // close sidebar after 3 s
  }

  if (submitted) {
    return (
      <div className="ca-sidebar__empty">
        <div style={{ fontSize: 36, marginBottom: 12 }}>✅</div>
        <p style={{ fontWeight: 600, color: '#0a2342' }}>Enquiry received!</p>
        <p style={{ fontSize: 13, color: '#6b7280', marginTop: 6 }}>
          Our team will be in touch shortly.
        </p>
      </div>
    )
  }

  return (
    <div className="ca-escalate-panel">
      <p className="ca-escalate-panel__intro">
        Fill in the form below and a team member will get back to you.
      </p>

      {/* Prefer the bot's adaptive card if available, else use the fallback */}
      {cardJson
        ? <AdaptiveCardRenderer cardJson={cardJson} onSubmit={handleSubmit} />
        : <FallbackForm onSubmit={handleSubmit} />
      }
    </div>
  )
}
