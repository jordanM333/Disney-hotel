import { nightsBetween } from './constants'
import { distanceFromDisneyland } from './locationHelper'

const LITEAPI_KEY = 'sand_c00ea039-cec6-4c31-b463-ae4d4f4d4610'
const BASE = 'https://api.liteapi.travel/v3.0'

export interface LiteHotel {
  id: string
  name: string
  address: string
  latitude: number
  longitude: number
  rating: number        // 0–5 scale (converted from 10-pt review score)
  reviewCount: number
  starRating: number
  amenities: string[]
  thumbnail?: string
  websiteUrl?: string
}

export interface LiteRate {
  hotelId: string
  pricePerNight: number | null   // USD, taxes & fees included
  totalPrice: number | null      // full stay total
  currency: string
  roomName: string | null
}

export async function fetchHotelsNearDisneyland(): Promise<LiteHotel[]> {
  const params = new URLSearchParams({
    latitude: '33.8121',
    longitude: '-117.9190',
    radius: '2',      // 2 km ≈ 1.25 miles; we filter to ≤1 mi after
    limit: '40',
    countryCode: 'US',
  })
  const res = await fetch(`${BASE}/data/hotels?${params}`, {
    headers: { 'X-API-Key': LITEAPI_KEY },
  })
  if (!res.ok) {
    const text = await res.text()
    throw new Error(`liteapi /data/hotels ${res.status}: ${text}`)
  }
  const json = await res.json()
  console.log('[liteapi] hotels raw:', json)

  const items: any[] = json.data ?? []
  return items
    .map(h => {
      const lat = h.location?.latitude ?? h.latitude ?? 0
      const lng = h.location?.longitude ?? h.longitude ?? 0
      return {
        id: h.id ?? h.hotelId ?? '',
        name: h.name ?? '',
        address: formatAddress(h.address),
        latitude: lat,
        longitude: lng,
        rating: h.reviews?.score != null
          ? Math.min(5, h.reviews.score / 2)
          : (h.starRating ?? 3),
        reviewCount: h.reviews?.numberOfReviews ?? h.reviews?.reviewCount ?? 0,
        starRating: h.starRating ?? 3,
        amenities: (h.amenities ?? [])
          .map((a: any) => (typeof a === 'string' ? a : (a.name ?? '')))
          .filter(Boolean),
        thumbnail: h.main_photo ?? h.thumbnail ?? h.images?.[0]?.url,
        websiteUrl: h.websiteUrl ?? h.website,
      }
    })
    .filter(h => distanceFromDisneyland(h.latitude, h.longitude) <= 1.0)
}

export async function fetchRates(
  hotelIds: string[],
  checkin: string,
  checkout: string,
  adults: number,
  children: number,
): Promise<LiteRate[]> {
  if (hotelIds.length === 0) return []

  const childAges = Array.from({ length: children }, () => 10)

  const body = {
    hotelIds,
    checkin,
    checkout,
    occupancies: [{ adults, children: childAges }],
    currency: 'USD',
    guestNationality: 'US',
    countryCode: 'US',
  }

  const res = await fetch(`${BASE}/hotels/rates`, {
    method: 'POST',
    headers: {
      'X-API-Key': LITEAPI_KEY,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  })
  if (!res.ok) {
    const text = await res.text()
    throw new Error(`liteapi /hotels/rates ${res.status}: ${text}`)
  }
  const json = await res.json()
  console.log('[liteapi] rates raw:', json)

  const nights = nightsBetween(checkin, checkout)
  const hotels: any[] = json.data?.hotels ?? []

  return hotels.map(h => {
    const roomTypes: any[] = h.roomTypes ?? []
    const firstRoom = roomTypes[0]
    const firstRate = firstRoom?.rates?.[0]
    const totalArr: any[] =
      firstRate?.retailRate?.total ??
      firstRate?.retailRate?.suggestedSellingPrice ??
      []
    const totalAmount: number | null = totalArr[0]?.amount ?? null

    return {
      hotelId: h.hotelId ?? h.id ?? '',
      pricePerNight: totalAmount != null && nights > 0
        ? Math.round(totalAmount / nights)
        : null,
      totalPrice: totalAmount != null ? Math.round(totalAmount) : null,
      currency: totalArr[0]?.currency ?? 'USD',
      roomName: firstRoom?.name ?? null,
    }
  })
}

function formatAddress(addr: any): string {
  if (!addr) return ''
  if (typeof addr === 'string') return addr
  const parts = [addr.line1, addr.line2, addr.city, addr.state]
    .filter(Boolean)
    .join(', ')
  return parts
}
