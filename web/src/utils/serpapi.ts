export interface SerpHotel {
  id: string
  name: string
  address: string
  latitude: number
  longitude: number
  rating: number
  reviewCount: number
  pricePerNight: number | null
  totalPrice: number | null
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
    checkIn,
    checkOut,
    adults: String(adults),
    children: String(children),
  })

  const res = await fetch(`/api/hotels?${params}`, { cache: 'no-store' })
  if (!res.ok) {
    const text = await res.text()
    throw new Error(`Hotels API ${res.status}: ${text.slice(0, 200)}`)
  }
  const json = await res.json()
  if (json.error) throw new Error(`Hotels API: ${json.error}`)

  console.log('[hotels] properties returned:', json.properties?.length ?? 0)

  const properties: any[] = json.properties ?? []

  return properties.map(p => {
    const lat: number = p.gps_coordinates?.latitude ?? 0
    const lng: number = p.gps_coordinates?.longitude ?? 0
    const pricePerNight: number | null = p.rate_per_night?.extracted_lowest ?? null
    const totalPrice: number | null = p.total_rate?.extracted_lowest ?? null

    console.log(`[hotels] ${p.name}: $${pricePerNight}/night, total $${totalPrice}`)

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
      distanceMiles: lat !== 0
        ? parseFloat((Math.sqrt((lat - 33.8121) ** 2 + (lng + 117.919) ** 2) * 69).toFixed(2))
        : 0.5,
      link: p.link,
    }
  })
}
