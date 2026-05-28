import { useEffect, useState } from 'react'
import { MapContainer, TileLayer, Marker, Popup, Circle } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import L from 'leaflet'

delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl:       'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl:     'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
})

const OFFICE = { lat: 6.8815788, lng: 79.8587631 }

const INFO = [
  { icon: '📍', label: 'Address',  value: '2 Mary\'s Road, Galle Road, Colombo 00400, Sri Lanka' },
  { icon: '🕐', label: 'Hours',    value: 'Mon – Fri, 8:30 AM – 5:30 PM (IST)' },
  { icon: '📞', label: 'Phone',    value: '+94 11 250 5000' },
  { icon: '✉️', label: 'Email',    value: 'info@zillione.com' },
]

export default function LocationPanel() {
  const [userLocation, setUserLocation] = useState(null)
  const [locationError, setLocationError] = useState(null)

  useEffect(() => {
    if (!navigator.geolocation) { setLocationError('Geolocation not supported'); return }
    navigator.geolocation.getCurrentPosition(
      pos => setUserLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
      ()  => setLocationError('Location access denied')
    )
  }, [])

  return (
    <div style={{ display:'flex', flexDirection:'column', gap:'0' }}>

      <div style={{ padding:'20px 24px', background:'radial-gradient(ellipse at 50% 0%,rgba(233,30,140,0.08),transparent 70%)', borderBottom:'1px solid rgba(233,30,140,0.08)' }}>
        <div style={{ display:'inline-flex', alignItems:'center', background:'rgba(233,30,140,0.1)', color:'#E91E8C', border:'1px solid rgba(233,30,140,0.2)', borderRadius:'20px', padding:'3px 10px', fontSize:'10px', fontWeight:600, letterSpacing:'0.05em', textTransform:'uppercase', marginBottom:'8px' }}>
          ZILLIONe HQ
        </div>
        <h3 style={{ margin:'0 0 4px', fontFamily:'Outfit,sans-serif', fontSize:'20px', fontWeight:700, color:'#F8FAFC' }}>ZILLIONe Technologies</h3>
        <p style={{ margin:0, fontSize:'13px', color:'#8B9AB4' }}>Colombo, Sri Lanka</p>

        {locationError && (
          <p style={{ margin:'8px 0 0', color:'#fb923c', fontSize:'12.5px', display:'flex', alignItems:'center', gap:'5px' }}>
            ⚠️ {locationError}
          </p>
        )}
        {userLocation && (
          <p style={{ margin:'8px 0 0', color:'#4ade80', fontSize:'12.5px', display:'flex', alignItems:'center', gap:'5px' }}>
            📍 Showing your location
          </p>
        )}
      </div>

      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'8px', padding:'16px 20px' }}>
        {INFO.map(({ icon, label, value }) => (
          <div
            key={label}
            style={{ padding:'10px 12px', background:'rgba(233,30,140,0.04)', border:'1px solid rgba(233,30,140,0.1)', borderRadius:'12px' }}
          >
            <div style={{ fontSize:'16px', marginBottom:'4px' }}>{icon}</div>
            <div style={{ fontSize:'9.5px', color:'#8B9AB4', textTransform:'uppercase', letterSpacing:'0.07em', fontWeight:600, marginBottom:'3px' }}>{label}</div>
            <div style={{ fontSize:'11.5px', color:'#C8D0DC', lineHeight:1.4 }}>{value}</div>
          </div>
        ))}
      </div>

      <div style={{ margin:'0 20px', borderRadius:'14px', overflow:'hidden', border:'1px solid rgba(233,30,140,0.12)', boxShadow:'0 4px 24px rgba(0,0,0,0.3)' }}>
        <MapContainer center={[OFFICE.lat, OFFICE.lng]} zoom={14} style={{ height:'260px', width:'100%' }}>
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" attribution='&copy; OpenStreetMap contributors' />
          <Marker position={[OFFICE.lat, OFFICE.lng]}>
            <Popup>
              <strong>ZILLIONe Technologies</strong><br />
              2 Mary's Road, Galle Road<br />
              Colombo 04, Sri Lanka
            </Popup>
          </Marker>
          {userLocation && (
            <Circle
              center={[userLocation.lat, userLocation.lng]}
              radius={200}
              pathOptions={{ color:'#E91E8C', fillColor:'#E91E8C', fillOpacity:0.3 }}
            />
          )}
        </MapContainer>
      </div>

      <div style={{ padding:'16px 20px 22px', display:'flex', flexDirection:'column', gap:'8px' }}>
        <a
          href={`https://www.google.com/maps/dir/?api=1&destination=${OFFICE.lat},${OFFICE.lng}`}
          target="_blank"
          rel="noopener noreferrer"
          style={{ display:'flex', alignItems:'center', justifyContent:'center', gap:'8px', padding:'13px', background:'linear-gradient(135deg,#E91E8C,#9333EA)', color:'white', borderRadius:'12px', textDecoration:'none', fontSize:'13.5px', fontWeight:600, fontFamily:'Outfit,sans-serif', boxShadow:'0 6px 20px rgba(233,30,140,0.35)', transition:'transform 0.2s, box-shadow 0.2s', letterSpacing:'0.02em' }}
          onMouseOver={e => { e.currentTarget.style.transform='translateY(-2px)'; e.currentTarget.style.boxShadow='0 10px 28px rgba(233,30,140,0.5)' }}
          onMouseOut={e => { e.currentTarget.style.transform='translateY(0)'; e.currentTarget.style.boxShadow='0 6px 20px rgba(233,30,140,0.35)' }}
        >
          📍 Get Directions in Google Maps
        </a>

        <a
          href="https://www.zillione.com/contact"
          target="_blank"
          rel="noopener noreferrer"
          style={{ display:'flex', alignItems:'center', justifyContent:'center', padding:'11px', background:'transparent', color:'#E91E8C', border:'1px solid rgba(233,30,140,0.3)', borderRadius:'12px', textDecoration:'none', fontSize:'13px', fontWeight:500, fontFamily:'DM Sans,sans-serif', transition:'all 0.2s' }}
          onMouseOver={e => { e.currentTarget.style.background='rgba(233,30,140,0.08)'; e.currentTarget.style.borderColor='rgba(233,30,140,0.5)' }}
          onMouseOut={e => { e.currentTarget.style.background='transparent'; e.currentTarget.style.borderColor='rgba(233,30,140,0.3)' }}
        >
          Contact us online
        </a>
      </div>
    </div>
  )
}