import { useState, useCallback } from 'react'
import { Hotel, SearchParameters, SortOption } from '../types'
import { MOCK_HOTELS } from '../data/mockHotels'
import { computeValueScore, estimatePrice } from '../utils/valueScore'
import { nightsBetween, DISNEYLAND } from '../utils/constants'
import { distanceFromDisneyland } from '../utils/locationHelper'

function applyParamsToHotel(h: Hotel, p: SearchParameters): Hotel {
  return {
    ...h,
    checkIn: p.checkIn,
    checkOut: p.checkOut,
    adults: p.adults,
    children: p.children,
    totalPrice: (h.pricePerNight ?? 0) * nightsBetween(p.checkIn, p.checkOut),
  }
}

function sortHotels(hotels: Hotel[], sortBy: SortOption): Hotel[] {
  const scored = hotels.map(h => ({ h, score: computeValueScore(h) }))
  scored.sort((a, b) => {
    switch (sortBy) {
      case 'bestValue':    return b.score - a.score
      case 'lowestPrice':  return (a.h.pricePerNight ?? Infinity) - (b.h.pricePerNight ?? Infinity)
      case 'highestPrice': return (b.h.pricePerNight ?? 0) - (a.h.pricePerNight ?? 0)
      case 'topRated':     return b.h.rating - a.h.rating
      case 'closest':      return a.h.distanceFromDisneyland - b.h.distanceFromDisneyland
      case 'mostDeals':    return b.h.deals.length - a.h.deals.length
    }
  })
  return scored.map(x => x.h)
}

export function useHotelSearch() {
  const [hotels, setHotels] = useState<Hotel[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [hasSearched, setHasSearched] = useState(false)
  const [favorites, setFavorites] = useState<Set<string>>(new Set())
  const [params, setParams] = useState<SearchParameters>({
    checkIn: new Date(Date.now() + 86_400_000).toISOString().slice(0, 10),
    checkOut: new Date(Date.now() + 172_800_000).toISOString().slice(0, 10),
    adults: 2,
    children: 0,
    sortBy: 'bestValue',
    maxPricePerNight: 500,
    minRating: 0,
  })

  const search = useCallback(async () => {
    setIsLoading(true)
    setError(null)
    setHasSearched(true)
    setHotels([])

    // Simulate async fetch
    await new Promise(r => setTimeout(r, 900))

    try {
      const apiKey = localStorage.getItem('google_places_api_key') ?? ''
      let results: Hotel[]

      if (apiKey) {
        results = await fetchFromGooglePlaces(apiKey, params)
      } else {
        results = MOCK_HOTELS.map(h => applyParamsToHotel(h, params))
      }

      // Sync favorites
      results = results.map(h => ({ ...h, isFavorite: favorites.has(h.id) }))
      setHotels(results)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Search failed. Using demo data.')
      const fallback = MOCK_HOTELS.map(h => applyParamsToHotel(h, params))
      setHotels(fallback.map(h => ({ ...h, isFavorite: favorites.has(h.id) })))
    } finally {
      setIsLoading(false)
    }
  }, [params, favorites])

  const toggleFavorite = useCallback((id: string) => {
    setFavorites(prev => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      return next
    })
    setHotels(prev => prev.map(h => h.id === id ? { ...h, isFavorite: !h.isFavorite } : h))
  }, [])

  const filteredSorted = sortHotels(
    hotels.filter(h => {
      const priceOk = !h.pricePerNight || h.pricePerNight <= params.maxPricePerNight
      const ratingOk = h.rating >= params.minRating
      return priceOk && ratingOk
    }),
    params.sortBy
  )

  const favoritedHotels = filteredSorted.filter(h => h.isFavorite)
  const lowestPrice = filteredSorted.reduce<number | null>((acc, h) => {
    if (!h.pricePerNight) return acc
    return acc === null || h.pricePerNight < acc ? h.pricePerNight : acc
  }, null)

  return { hotels: filteredSorted, favoritedHotels, isLoading, error, hasSearched, params, setParams, search, toggleFavorite, lowestPrice }
}

// Real Google Places fetch (browser-side, requires key with no HTTP referrer restriction or a proxy)
async function fetchFromGooglePlaces(apiKey: string, params: SearchParameters): Promise<Hotel[]> {

  const url = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${DISNEYLAND.lat},${DISNEYLAND.lng}&radius=1610&type=lodging&key=${apiKey}`
  const res = await fetch(url)
  if (!res.ok) throw new Error('Google Places API error')
  const data = await res.json()
  if (data.status !== 'OK') throw new Error(`Places API: ${data.status}`)

  return (data.results as GooglePlaceResult[])
    .filter((r: GooglePlaceResult) => {
      const dist = distanceFromDisneyland(r.geometry.location.lat, r.geometry.location.lng)
      return dist <= 1.0
    })
    .map((r: GooglePlaceResult) => ({
      id: r.place_id,
      placeID: r.place_id,
      name: r.name,
      address: r.vicinity ?? '',
      latitude: r.geometry.location.lat,
      longitude: r.geometry.location.lng,
      rating: r.rating ?? 0,
      reviewCount: r.user_ratings_total ?? 0,
      priceLevel: r.price_level ?? 2,
      photoReference: r.photos?.[0]?.photo_reference,
      pricePerNight: estimatePrice(r.price_level ?? 2),
      deals: [],
      amenities: [],
      isFavorite: false,
      checkIn: params.checkIn,
      checkOut: params.checkOut,
      adults: params.adults,
      children: params.children,
      distanceFromDisneyland: distanceFromDisneyland(r.geometry.location.lat, r.geometry.location.lng),
    }))
}

interface GooglePlaceResult {
  place_id: string
  name: string
  vicinity?: string
  geometry: { location: { lat: number; lng: number } }
  rating?: number
  user_ratings_total?: number
  price_level?: number
  photos?: Array<{ photo_reference: string }>
}
