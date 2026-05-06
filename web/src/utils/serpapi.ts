import { distanceFromDisneyland } from './locationHelper'

const SERPAPI_KEY = '8e25918ac543a4c0fab664514e739745db66ef22302bc09777762ef470db3fcc'
const BASE = 'https://serpapi.com/search.json'

export interface SerpHotel {
  id: string
  name: string
  address: string
  latitude: number
  longitude: number
  rating: number
  reviewCount: number
  pricePerNight: number | null   // after taxes & fees
  totalPrice: number | null      // full stay total
  amenities: string[]
  hotelClass: number             // star rating 1–5
  link?: string
}

export async function searchHotelsNearDisneyland(
  checkIn: string,
  checkOut: string,
  adults: number,
  children: number,
): Promise<SerpHotel[]> {
  const params = new URLSearchParams({
    engine: 'google_hotels',
    q: 'hotels near Disneyland Anaheim CA',
    check_in_date: checkIn,
    check_out_date: checkOut,
    adults: String(adults),
    children: String(children),
    currency: 'USD',
    gl: 'us',
    hl: 'en',
    api_key: SERPAPI_KEY,
  })

  const res = await fetch(`${BASE}?${params}`)
  if (!res.ok) {
    const text = await res.text()
    throw new Error(`SerpAPI ${res.status}: ${text}`)
  }
  const json = await res.json()
  console.log('[serpapi] raw response:', json)

  if (json.error) throw new Error(`SerpAPI error: ${json.error}`)

  const properties: any[] = json.properties ?? []

  return properties
    .map(p => ({
      id: p.property_token ?? String(Math.random()),
      name: p.name ?? '',
      address: p.description ?? `Anaheim, CA`,
      latitude: p.gps_coordinates?.latitude ?? 0,
      longitude: p.gps_coordinates?.longitude ?? 0,
      rating: p.overall_rating ?? 0,
      reviewCount: p.reviews ?? 0,
      pricePerNight: p.rate_per_night?.extracted_lowest ?? null,
      totalPrice: p.total_rate?.extracted_lowest ?? null,
      amenities: (p.amenities ?? []) as string[],
      hotelClass: p.extracted_hotel_class ?? 3,
      link: p.link,
    }))
    .filter(h => h.latitude !== 0 && distanceFromDisneyland(h.latitude, h.longitude) <= 1.0)
}
