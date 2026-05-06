import { useState, useCallback } from 'react'
import { Hotel, SearchParameters, SortOption } from '../types'
import { MOCK_HOTELS } from '../data/mockHotels'
import { computeValueScore, estimatedMidpoint } from '../utils/valueScore'
import { nightsBetween } from '../utils/constants'
import { distanceFromDisneyland } from '../utils/locationHelper'
import { fetchHotelsNearDisneyland, fetchRates, LiteRate } from '../utils/liteapi'

function applyMockParams(h: Hotel, p: SearchParameters): Hotel {
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
    const aPrice = a.pricePerNight ?? estimatedMidpoint(a.priceLevel)
    const bPrice = b.pricePerNight ?? estimatedMidpoint(b.priceLevel)
    switch (sortBy) {
      case 'bestValue':    return computeValueScore(b) - computeValueScore(a)
      case 'lowestPrice':  return aPrice - bPrice
      case 'highestPrice': return bPrice - aPrice
      case 'topRated':     return b.rating - a.rating
      case 'closest':      return a.distanceFromDisneyland - b.distanceFromDisneyland
      case 'mostDeals':    return b.deals.length - a.deals.length
    }
  })
  return arr
}

function priceLevelFromNightly(pricePerNight: number | undefined): number {
  if (!pricePerNight) return 2
  if (pricePerNight < 150) return 1
  if (pricePerNight < 250) return 2
  if (pricePerNight < 400) return 3
  return 4
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
    maxPricePerNight: 0,
    memberships: [],
  })

  const search = useCallback(async () => {
    setIsLoading(true)
    setError(null)
    setHasSearched(true)
    setHotels([])

    try {
      // Step 1: discover hotels near Disneyland via liteapi
      const liteHotels = await fetchHotelsNearDisneyland()

      if (liteHotels.length === 0) {
        throw new Error('No hotels returned from liteapi for this area')
      }

      // Step 2: get rates (best-effort — hotels still show if this step fails)
      let rateMap = new Map<string, LiteRate>()
      try {
        const rates = await fetchRates(
          liteHotels.map(h => h.id),
          params.checkIn,
          params.checkOut,
          params.adults,
          params.children,
        )
        rateMap = new Map(rates.map(r => [r.hotelId, r]))
      } catch (rateErr) {
        console.warn('[liteapi] rates fetch failed:', rateErr)
        setError('Could not load prices — tap any hotel to check rates on booking sites.')
      }

      // Step 3: merge into our Hotel type
      const results: Hotel[] = liteHotels.map(lh => {
        const rate = rateMap.get(lh.id)
        return {
          id: lh.id,
          placeID: lh.id,
          name: lh.name,
          address: lh.address,
          latitude: lh.latitude,
          longitude: lh.longitude,
          rating: lh.rating,
          reviewCount: lh.reviewCount,
          priceLevel: priceLevelFromNightly(rate?.pricePerNight ?? undefined),
          deals: [],
          fees: [],
          amenities: lh.amenities,
          isFavorite: favorites.has(lh.id),
          checkIn: params.checkIn,
          checkOut: params.checkOut,
          adults: params.adults,
          children: params.children,
          distanceFromDisneyland: distanceFromDisneyland(lh.latitude, lh.longitude),
          websiteURL: lh.websiteUrl,
          pricePerNight: rate?.pricePerNight ?? undefined,
          totalPrice: rate?.totalPrice ?? undefined,
          currency: rate?.currency ?? 'USD',
        }
      })

      setHotels(results)
    } catch (e) {
      const msg = e instanceof Error ? e.message : String(e)
      console.error('[liteapi] search failed, falling back to mock data:', msg)
      setError(`Live data unavailable — showing demo hotels. (${msg})`)
      setHotels(MOCK_HOTELS.map(h => ({
        ...applyMockParams(h, params),
        isFavorite: favorites.has(h.id),
      })))
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
      if (h.rating < params.minRating) return false
      if (params.maxPricePerNight > 0 && h.pricePerNight && h.pricePerNight > params.maxPricePerNight) return false
      return true
    }),
    params.sortBy,
  )

  const favoritedHotels = filteredSorted.filter(h => h.isFavorite)

  return {
    hotels: filteredSorted, favoritedHotels, isLoading, error,
    hasSearched, params, setParams, search, toggleFavorite,
    nights: nightsBetween(params.checkIn, params.checkOut),
  }
}
