import { useEffect, useState } from 'react'
import { MapContainer, TileLayer, Marker, Popup, Circle } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import L from 'leaflet'

delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
})

const OFFICE = { lat: 6.8815788, lng: 79.8587631 }

export default function LocationPanel() {
  const [userLocation, setUserLocation] = useState(null)
  const [locationError, setLocationError] = useState(null)

  useEffect(() => {
    if (!navigator.geolocation) {
      setLocationError('Geolocation not supported by your browser')
      return
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => setUserLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
      () => setLocationError('Location access denied')
    )
  }, [])

  return (
    <div style={{ 
      display: 'flex', 
      flexDirection: 'column', 
      gap: '16px', 
      padding: '24px 28px',
      boxSizing: 'border-box',
      width: '100%'
    }}>
      <div style={{ marginBottom: '4px' }}>
        <h3 style={{ 
          margin: 0, 
          fontFamily: 'Outfit, sans-serif', 
          fontSize: '22px', 
          fontWeight: 600,
          color: 'var(--text)'
        }}>
          ZILLIONe Technologies
        </h3>
        <p style={{ margin: '6px 0', opacity: 0.8, fontSize: '15px', color: 'var(--text-muted)' }}>
          2 Mary’s Road, Galle Road, Colombo 04, Sri Lanka
        </p>
        {locationError && (
          <p style={{ color: '#fb923c', fontSize: '14px', margin: '8px 0', fontWeight: 500 }}>
            ⚠️ {locationError}
          </p>
        )}
        {userLocation && (
          <p style={{ color: '#4ade80', fontSize: '14px', margin: '8px 0', fontWeight: 500 }}>
            📍 Showing your current location
          </p>
        )}
      </div>

      <div style={{ 
        border: '1px solid var(--border)', 
        borderRadius: '12px', 
        overflow: 'hidden',
        boxShadow: '0 4px 20px rgba(0,0,0,0.2)'
      }}>
        <MapContainer
          center={[OFFICE.lat, OFFICE.lng]}
          zoom={14}
          style={{ height: '320px', width: '100%' }}
        >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; OpenStreetMap contributors'
        />
        <Marker position={[OFFICE.lat, OFFICE.lng]}>
          <Popup>
            <strong>ZILLIONe Technologies</strong><br />
            2 Mary’s Road, Galle Road<br />
            Colombo 04, Sri Lanka
          </Popup>
        </Marker>
        {userLocation && (
          <Circle
            center={[userLocation.lat, userLocation.lng]}
            radius={200}
            pathOptions={{ color: 'var(--accent)', fillColor: 'var(--accent)', fillOpacity: 0.4 }}
          />
        )}
      </MapContainer>
      </div>

      <a
        href={`https://www.google.com/maps/dir/?api=1&destination=${OFFICE.lat},${OFFICE.lng}`}
        target="_blank"
        rel="noopener noreferrer"
        style={{
          display: 'block',
          textAlign: 'center',
          padding: '14px 16px',
          background: 'linear-gradient(135deg, var(--accent), var(--accent2))',
          color: 'white',
          borderRadius: '12px',
          textDecoration: 'none',
          fontSize: '15px',
          fontWeight: 600,
          boxShadow: '0 8px 24px rgba(99, 102, 241, 0.3)',
          transition: 'transform 0.2s',
        }}
        onMouseOver={e => e.currentTarget.style.transform = 'scale(1.02)'}
        onMouseOut={e => e.currentTarget.style.transform = 'scale(1)'}
      >
        Get Directions in Google Maps
      </a>
    </div>
  )
}
