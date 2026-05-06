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
  hotelClass: number
  distanceMiles: number
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

  console.log('[serpapi] fetching:', `${BASE}?engine=google_hotels&check_in_date=${checkIn}&check_out_date=${checkOut}&adults=${adults}`)

  const res = await fetch(`${BASE}?${params}`)
  if (!res.ok) {
    const text = await res.text()
    console.error('[serpapi] HTTP error:', res.status, text)
    throw new Error(`SerpAPI ${res.status}: ${text.slice(0, 200)}`)
  }
  const json = await res.json()
  console.log('[serpapi] status:', json.search_metadata?.status)
  console.log('[serpapi] properties count:', json.properties?.length ?? 0)
  console.log('[serpapi] first property sample:', JSON.stringify(json.properties?.[0]).slice(0, 400))

  if (json.error) throw new Error(`SerpAPI: ${json.error}`)

  const properties: any[] = json.properties ?? []

  return properties.map(p => {
    const lat: number = p.gps_coordinates?.latitude ?? 0
    const lng: number = p.gps_coordinates?.longitude ?? 0
    const distanceMiles = lat !== 0 ? distanceFromDisneyland(lat, lng) : 0.5

    const pricePerNight: number | null =
      p.rate_per_night?.extracted_lowest ??
      p.price?.extracted_value ??
      null

    const totalPrice: number | null =
      p.total_rate?.extracted_lowest ??
      null

    console.log(`[serpapi] ${p.name}: $${pricePerNight}/night, total $${totalPrice}, dist ${distanceMiles.toFixed(2)}mi`)

    return {
      id: p.property_token ?? p.name ?? String(Math.random()),
      name: p.name ?? '',
      address: p.description ?? 'Anaheim, CA',
      latitude: lat,
      longitude: lng,
      rating: p.overall_rating ?? 0,
      reviewCount: p.reviews ?? 0,
      pricePerNight,
      totalPrice,
      amenities: (p.amenities ?? []) as string[],
      hotelClass: p.extracted_hotel_class ?? 3,
      distanceMiles,
      link: p.link,
    }
  })
}
