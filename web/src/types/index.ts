export type DealSource = 'AAA' | 'AARP' | 'Military' | 'Costco Travel' | 'Hotels.com' | 'Booking.com' | 'Expedia' | 'Direct' | 'Other'

export type Membership = 'aaa' | 'aarp' | 'military' | 'costco'

export interface HotelDeal {
  id: string
  title: string
  description: string
  discountPercentage?: number
  discountAmount?: number
  promoCode?: string
  source: DealSource
  requiredMembership?: Membership
  isVerified: boolean
}

export interface HotelFee {
  name: string         // e.g. "Parking", "WiFi", "Resort Fee", "Breakfast"
  included: boolean    // true = no extra charge
  amount?: number      // extra cost per night (if included = false)
  perStay?: boolean    // if true, amount is a one-time stay charge, not per night
  note?: string        // e.g. "Valet only", "Self-parking"
}

export interface Hotel {
  id: string
  placeID: string
  name: string
  address: string
  latitude: number
  longitude: number
  rating: number
  reviewCount: number
  priceLevel: number
  photoReference?: string
  deals: HotelDeal[]
  fees: HotelFee[]
  websiteURL?: string
  phoneNumber?: string
  amenities: string[]
  isFavorite: boolean
  checkIn?: string
  checkOut?: string
  adults: number
  children: number
  distanceFromDisneyland: number
  pricePerNight?: number   // actual rate from liteapi (USD, taxes & fees included)
  totalPrice?: number      // full stay total
  currency?: string
}

export type SortOption = 'bestValue' | 'lowestPrice' | 'highestPrice' | 'topRated' | 'closest' | 'mostDeals'

export interface SearchParameters {
  checkIn: string
  checkOut: string
  adults: number
  children: number
  sortBy: SortOption
  minRating: number
  maxPricePerNight: number   // 0 = no limit
  memberships: Membership[]
}

export type TabId = 'search' | 'results' | 'saved'
