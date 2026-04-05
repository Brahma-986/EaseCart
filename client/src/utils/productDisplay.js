/** Normalize rating from API ({ average, count }) or legacy flat number. */
export function getProductRating(product) {
  const r = product?.rating
  if (r == null) return { average: 0, count: 0 }
  if (typeof r === 'number') return { average: r, count: 0 }
  return {
    average: Number(r.average) || 0,
    count: Number(r.count) || 0,
  }
}

export function formatCategoryLabel(category) {
  if (!category) return ''
  return String(category).replace(/-/g, ' ')
}
