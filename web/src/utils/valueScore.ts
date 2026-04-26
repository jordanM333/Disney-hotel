import { Hotel } from '../types'

// Price ranges by Google Places price_level (1–4)
export const PRICE_RANGES: Record<number, [number, number]> = {
  1: [80,  150],
  2: [150, 250],
  3: [250, 400],
  4: [350, 700],
}

export function estimatedPriceRange(level: number): string {
  const [lo, hi] = PRICE_RANGES[level] ?? [150, 250]
  return `$${lo}–$${hi}`
}

export function estimatedMidpoint(level: number): number {
  const [lo, hi] = PRICE_RANGES[level] ?? [150, 250]
  return Math.round((lo + hi) / 2)
}

export function priceLevelDisplay(level: number): string {
  return '$'.repeat(Math.max(1, Math.min(4, level)))
}

// Value score uses estimated midpoint — purely for relative ranking, not displayed as a price
export function computeValueScore(hotel: Hotel): number {
  const price = estimatedMidpoint(hotel.priceLevel)
  const ratingFactor   = hotel.rating / 5
  const priceFactor    = Math.max(0, 1 - price / 500)
  const discountFactor = Math.min(hotel.deals.length * 0.08, 0.24)
  const distanceFactor = Math.max(0, 1 - hotel.distanceFromDisneyland)
  return (ratingFactor * 0.35 + priceFactor * 0.40 + discountFactor * 0.10 + distanceFactor * 0.15) * 100
}
