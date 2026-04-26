import { useState, useCallback } from 'react'
import { Hotel, SearchParameters, SortOption } from '../types'
import { MOCK_HOTELS } from '../data/mockHotels'
import { computeValueScore } from '../utils/valueScore'
import { nightsBetween, DISNEYLAND } from '../utils/constants'
import { distanceFromDisneyland } from '../utils/locationHelper'
import { estimatedMidpoint } from '../utils/valueScore'

function applyParams(h: Hotel, p: SearchParameters): Hotel {
  // Filter deals to only those the user qualifies for
  const filteredDeals = h.deals.filter(d =>
    !d.requiredMembership || p.memberships.includes(d.requiredMembership)
  )
  return {
    ...h,
    checkIn: p.checkIn,
    checkOut: p.checkOut,
    adults: p.adults,
    children: p.children,
    deals: filteredDeals,
  }
}

function sortHotels(hotels: Hotel[], sortBy: SortOption): Hotel[] {
  const arr = [...hotels]
  arr.sort((a, b) => {
    switch (sortBy) {
      case 'bestValue':    return computeValueScore(b) - computeValueScore(a)
      case 'lowestPrice':  return estimatedMidpoint(a.priceLevel) - estimatedMidpoint(b.priceLevel)
      case 'highestPrice': return estimatedMidpoint(b.priceLevel) - estimatedMidpoint(a.priceLevel)
      case 'topRated':     return b.rating - a.rating
      case 'closest':      return a.distanceFromDisneyland - b.distanceFromDisneyland
      case 'mostDeals':    return b.deals.length - a.deals.length
    }
  })
  return arr
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
    minRating: 0,
    memberships: [],
  })

  const search = useCallback(async () => {
    setIsLoading(true)
    setError(null)
    setHasSearched(true)
    setHotels([])

    await new Promise(r => setTimeout(r, 900))

    try {
      const apiKey = localStorage.getItem('google_places_api_key') ?? ''
      let results: Hotel[]

      if (apiKey) {
        results = await fetchFromGooglePlaces(apiKey, params)
      } else {
        results = MOCK_HOTELS.map(h => applyParams(h, params))
      }

      results = results.map(h => ({ ...h, isFavorite: favorites.has(h.id) }))
      setHotels(results)
    } catch (e) {
      setError('Could not load live data — showing demo hotels.')
      setHotels(MOCK_HOTELS.map(h => ({ ...applyParams(h, params), isFavorite: favorites.has(h.id) })))
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
    hotels.filter(h => h.rating >= params.minRating),
    params.sortBy
  )

  const favoritedHotels = filteredSorted.filter(h => h.isFavorite)

  return {
    hotels: filteredSorted, favoritedHotels, isLoading, error,
    hasSearched, params, setParams, search, toggleFavorite,
    nights: nightsBetween(params.checkIn, params.checkOut),
  }
}

async function fetchFromGooglePlaces(apiKey: string, params: SearchParameters): Promise<Hotel[]> {
  const url = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${DISNEYLAND.lat},${DISNEYLAND.lng}&radius=1610&type=lodging&key=${apiKey}`
  const res = await fetch(url)
  if (!res.ok) throw new Error('Google Places API error')
  const data = await res.json()
  if (data.status !== 'OK') throw new Error(`Places API: ${data.status}`)

  return (data.results as GooglePlaceResult[])
    .filter(r => distanceFromDisneyland(r.geometry.location.lat, r.geometry.location.lng) <= 1.0)
    .map(r => ({
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
  place_id: string; name: string; vicinity?: string
  geometry: { location: { lat: number; lng: number } }
  rating?: number; user_ratings_total?: number; price_level?: number
  photos?: Array<{ photo_reference: string }>
}
