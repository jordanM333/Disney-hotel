import { Hotel } from '../types'

export function computeValueScore(hotel: Hotel): number {
  const price = hotel.pricePerNight
  if (!price || price <= 0) return 0
  const ratingFactor   = hotel.rating / 5
  const priceFactor    = Math.max(0, 1 - price / 450)
  const discountFactor = Math.min(hotel.deals.length * 0.08, 0.24)
  const distanceFactor = Math.max(0, 1 - hotel.distanceFromDisneyland)
  return (ratingFactor * 0.35 + priceFactor * 0.40 + discountFactor * 0.10 + distanceFactor * 0.15) * 100
}

export function estimatePrice(priceLevel: number): number {
  const ranges: Record<number, [number, number]> = {
    1: [80, 130],
    2: [130, 220],
    3: [220, 350],
    4: [350, 600],
  }
  const [lo, hi] = ranges[priceLevel] ?? [130, 220]
  return Math.round((lo + hi) / 2)
}

export function priceLevelDisplay(level: number): string {
  return '$'.repeat(Math.max(1, Math.min(4, level)))
}

export function estimatedPriceRange(level: number): string {
  const map: Record<number, string> = { 1: '$80–$130', 2: '$130–$220', 3: '$220–$350', 4: '$350+' }
  return map[level] ?? 'Price varies'
}
