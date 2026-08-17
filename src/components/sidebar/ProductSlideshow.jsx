// ProductSlideshow.jsx — with fade animation between slides
import { useState, useEffect } from 'react'
import MediaTile from './MediaTile'
import './ProductSlideshow.css'

export default function ProductSlideshow({ slug, name, items, isActiveProduct = false, compact = false }) {
  const [index,   setIndex]   = useState(0)
  const [visible, setVisible] = useState(true)  // drives fade

  // Reset to first slide when active product changes
  useEffect(() => { setIndex(0) }, [slug])

  function goTo(next) {
    // Fade out → swap → fade in
    setVisible(false)
    setTimeout(() => {
      setIndex(next)
      setVisible(true)
    }, 200)  // matches CSS transition duration
  }

  const prev = () => goTo((index - 1 + items.length) % items.length)
  const next = () => goTo((index + 1) % items.length)

  const current = items[index]
  const hasMany  = items.length > 1

  return (
    <div className={`product-slideshow ${isActiveProduct ? 'product-slideshow--active' : ''} ${compact ? 'product-slideshow--compact' : ''}`}>

      <p className="product-slideshow__name">{name}</p>

      <div className="product-slideshow__stage">
        {hasMany && (
          <button className="product-slideshow__arrow product-slideshow__arrow--prev" onClick={prev} aria-label="Previous">‹</button>
        )}

        {/* Fade wrapper */}
        <div className={`product-slideshow__fade ${visible ? 'product-slideshow__fade--visible' : ''}`}>
          <MediaTile item={current} isActive={isActiveProduct} />
        </div>

        {hasMany && (
          <button className="product-slideshow__arrow product-slideshow__arrow--next" onClick={next} aria-label="Next">›</button>
        )}
      </div>

      {hasMany && (
        <div className="product-slideshow__dots">
          {items.map((_, i) => (
            <button
              key={i}
              className={`product-slideshow__dot ${i === index ? 'product-slideshow__dot--active' : ''}`}
              onClick={() => goTo(i)}
              aria-label={`Go to slide ${i + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  )
}