import React, { useEffect, useState } from 'react'
import { PRODUCT_IMAGE_FALLBACK } from '../utils/images'

export default function SafeProductImage({ src, alt, className, loading = 'lazy' }) {
  const [resolved, setResolved] = useState(src || PRODUCT_IMAGE_FALLBACK)

  useEffect(() => {
    setResolved(src || PRODUCT_IMAGE_FALLBACK)
  }, [src])

  return (
    <img
      src={resolved}
      alt={alt}
      className={className}
      loading={loading}
      decoding="async"
      onError={() => setResolved(PRODUCT_IMAGE_FALLBACK)}
    />
  )
}
