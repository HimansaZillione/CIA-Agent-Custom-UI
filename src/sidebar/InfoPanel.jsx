import { marked } from 'marked'

export default function InfoPanel({ content }) {
  if (!content) {
    return <div className="ca-sidebar__empty"><p>No information available.</p></div>
  }

  // Content can be plain text or markdown
  return (
    <div
      className="ca-info-panel ca-bubble--bot"
      dangerouslySetInnerHTML={{ __html: marked.parse(content) }}
    />
  )
}
