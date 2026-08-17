// MediaTile.jsx
import { useRef } from 'react'
import './MediaTile.css'

export default function MediaTile({ item, isActive = false }) {
  const videoRef = useRef(null)

  const handleMouseEnter = () => {
    if (videoRef.current) videoRef.current.play().catch(() => {})
  }

  const handleMouseLeave = () => {
    if (videoRef.current) {
      videoRef.current.pause()
      videoRef.current.currentTime = 0
    }
  }

  return (
    <div
      className={`media-tile ${isActive ? 'media-tile--active' : ''}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {item.mediaType === 'video' ? (
        <div className="media-tile__video-wrapper">
          <video
            ref={videoRef}
            src={item.url}
            poster={item.thumbnailUrl ?? undefined}
            muted
            loop
            playsInline
            preload="none"
            className="media-tile__video"
          />
          <span className="media-tile__video-badge">▶ Video</span>
        </div>
      ) : (
        <img
          src={item.url}
          alt={item.name}
          className="media-tile__image"
          loading="lazy"
          draggable={false}
        />
      )}
    </div>
  )
}