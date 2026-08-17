// LocationPanel.jsx
// Shows ZILLIONe office location on an embedded OpenStreetMap
import './LocationPanel.css'

export default function LocationPanel() {
  return (
    <div className="location-panel">
      <div className="location-panel__address">
        <span>📍</span>
        <span>2 Mary's Road, Galle Road, Colombo 04, Sri Lanka</span>
      </div>

      <div className="location-panel__map-wrapper">
        <iframe
          title="ZILLIONe Office Location"
          className="location-panel__iframe"
          src="https://www.openstreetmap.org/export/embed.html?bbox=79.8490,6.8820,79.8690,6.9020&layer=mapnik&marker=6.8920,79.8590"
          allowFullScreen
        />
      </div>

      <a
        className="location-panel__directions"
        href="https://www.openstreetmap.org/?mlat=6.8920&mlon=79.8590#map=16/6.8920/79.8590"
        target="_blank"
        rel="noopener noreferrer"
      >
        Open in Maps ↗
      </a>
    </div>
  )
}