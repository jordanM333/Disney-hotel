export type DealSource = 'AAA' | 'AARP' | 'Military' | 'Costco Travel' | 'Hotels.com' | 'Booking.com' | 'Expedia' | 'Direct' | 'Other'

export type Membership = 'aaa' | 'aarp' | 'military' | 'costco'

export interface BookingOption {
  source: string
  pricePerNight: number | null
  totalPrice: number | null
  link: string
}

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
  name: string
  included: boolean
  amount?: number
  perStay?: boolean
  note?: string
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
  thumbnail?: string
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
  pricePerNight?: number
  totalPrice?: number
  currency?: string
  bookingOptions?: BookingOption[]
  serpLink?: string
}

export type SortOption = 'bestValue' | 'lowestPrice' | 'highestPrice' | 'topRated' | 'closest' | 'mostDeals'

export interface SearchParameters {
  checkIn: string
  checkOut: string
  adults: number
  children: number
  sortBy: SortOption
  minRating: number
  maxPricePerNight: number
  memberships: Membership[]
}

export type TabId = 'search' | 'results' | 'saved'
