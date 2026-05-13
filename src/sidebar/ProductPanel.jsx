import { useState } from 'react'
import products from '../config/products'

export default function ProductPanel({ tag, onSuggestion }) {
  const product = products[tag]
  const [imgSrc, setImgSrc] = useState(product?.image)

  if (!product) {
    return (
      <div className="ca-sidebar__empty">
        <p>Product information not found.</p>
      </div>
    )
  }

  return (
    <div className="ca-product-panel">
      {/* Product image */}
      <div className="ca-product-panel__img-wrap">
        <img
          src={imgSrc}
          alt={product.label}
          className="ca-product-panel__img"
          onError={() => setImgSrc(product.imageFallback)}
        />
      </div>

      {/* Name + tagline */}
      <div className="ca-product-panel__info">
        <h3 className="ca-product-panel__name">{product.label}</h3>
        <p className="ca-product-panel__tagline">{product.tagline}</p>

        {/* Description */}
        <p className="ca-product-panel__desc">{product.description}</p>

        {/* Spec list */}
        <ul className="ca-product-panel__specs">
          {product.specs.map((spec, i) => (
            <li key={i} className="ca-product-panel__spec">
              <span className="ca-product-panel__spec-dot">✓</span>
              {spec}
            </li>
          ))}
        </ul>

        {/* CTA — sends a message to the bot to continue the conversation */}
        {product.cta && (
          <button
            className="ca-product-panel__cta"
            onClick={() => onSuggestion(product.ctaAction)}
          >
            {product.cta}
          </button>
        )}
      </div>
    </div>
  )
}
