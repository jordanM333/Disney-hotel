import { X, Heart, Star, MapPin, Tag, ExternalLink, ChevronRight } from 'lucide-react'
import { Hotel } from '../types'
import { formatDistance, walkingMinutes } from '../utils/locationHelper'
import { computeValueScore, estimatedPriceRange } from '../utils/valueScore'
import { nightsBetween, buildHotelsComURL, buildBookingComURL, buildExpediaURL, buildGoogleHotelsURL } from '../utils/constants'

interface Props {
  hotel: Hotel
  onClose: () => void
  onFavorite: () => void
}

const BOOKING_PLATFORMS = [
  { label: 'Hotels.com',    icon: '🏨', color: 'bg-orange-500', fn: buildHotelsComURL },
  { label: 'Booking.com',   icon: '🌐', color: 'bg-teal-500',   fn: buildBookingComURL },
  { label: 'Expedia',       icon: '✈️', color: 'bg-yellow-500', fn: buildExpediaURL },
] as const

const AMENITY_ICONS: Record<string, string> = {
  pool: '🏊', spa: '💆', restaurant: '🍽️', breakfast: '☕', parking: '🅿️',
  shuttle: '🚌', fitness: '🏋️', gym: '🏋️', wifi: '📶', bar: '🍷',
  'room service': '🛎️', concierge: '🎩', 'early park': '🎟️', 'park access': '🎡',
  character: '🐭', playground: '🎠', 'game room': '🎮', kitchen: '🍳',
  suites: '🛋️', bbq: '🔥', sundeck: '☀️', monorail: '🚝',
}

function amenityIcon(amenity: string): string {
  const lower = amenity.toLowerCase()
  for (const [key, icon] of Object.entries(AMENITY_ICONS)) {
    if (lower.includes(key)) return icon
  }
  return '✓'
}

export function HotelDetailModal({ hotel, onClose, onFavorite }: Props) {
  const score = computeValueScore(hotel)
  const nights = hotel.checkIn && hotel.checkOut ? nightsBetween(hotel.checkIn, hotel.checkOut) : 1
  const checkIn  = hotel.checkIn ?? ''
  const checkOut = hotel.checkOut ?? ''

  const scoreColor = score > 75 ? 'text-green-600 bg-green-50' : score > 50 ? 'text-orange-600 bg-orange-50' : 'text-red-600 bg-red-50'

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />

      <div className="relative w-full sm:max-w-lg bg-white rounded-t-3xl sm:rounded-2xl shadow-2xl max-h-[92vh] overflow-y-auto">
        {/* Hero */}
        <div className="relative h-52 bg-gradient-to-br from-blue-700 to-indigo-900 flex items-center justify-center rounded-t-3xl sm:rounded-t-2xl overflow-hidden">
          <span className="text-8xl opacity-50">🏨</span>

          {/* Close */}
          <button onClick={onClose} className="absolute top-4 left-4 w-9 h-9 rounded-full bg-black/30 backdrop-blur-sm flex items-center justify-center text-white hover:bg-black/50 transition-colors">
            <X size={18} />
          </button>

          {/* Favorite */}
          <button onClick={onFavorite} className="absolute top-4 right-4 w-9 h-9 rounded-full bg-black/30 backdrop-blur-sm flex items-center justify-center hover:bg-black/50 transition-colors">
            <Heart size={18} className={hotel.isFavorite ? 'text-red-400 fill-red-400' : 'text-white'} />
          </button>
        </div>

        <div className="p-5 space-y-5">
          {/* Header */}
          <div>
            <h2 className="text-xl font-bold text-gray-900 leading-snug">{hotel.name}</h2>
            <div className="flex items-center gap-1 mt-1">
              {[1,2,3,4,5].map(i => (
                <Star key={i} size={14} className={i <= Math.round(hotel.rating) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-200 fill-gray-200'} />
              ))}
              <span className="text-sm font-semibold text-gray-700 ml-1">{hotel.rating.toFixed(1)}</span>
              <span className="text-sm text-gray-400">({hotel.reviewCount.toLocaleString()} reviews)</span>
            </div>

            <div className="flex items-center gap-3 mt-3 flex-wrap">
              {/* Price */}
              <div className="flex items-baseline gap-1">
                <span className="text-3xl font-bold text-blue-700">
                  {hotel.pricePerNight ? `$${hotel.pricePerNight}` : estimatedPriceRange(hotel.priceLevel)}
                </span>
                <span className="text-sm text-gray-400">/ night</span>
              </div>
              {hotel.totalPrice && (
                <span className="text-sm text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">
                  ${hotel.totalPrice} total · {nights} night{nights !== 1 ? 's' : ''}
                </span>
              )}

              {/* Value score */}
              {score > 0 && (
                <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${scoreColor}`}>
                  Value {Math.round(score)}/100
                </span>
              )}
            </div>
          </div>

          {/* Location */}
          <div className="bg-gray-50 rounded-xl p-4 space-y-2">
            <div className="flex items-center gap-2 text-sm font-semibold text-gray-700">
              <MapPin size={15} className="text-blue-500" />
              Location
            </div>
            <p className="text-sm text-gray-500">{hotel.address}</p>
            <div className="flex gap-3 mt-2">
              <InfoTile icon="📍" value={formatDistance(hotel.distanceFromDisneyland)} label="from Disneyland" />
              <InfoTile icon="🚶" value={`${walkingMinutes(hotel.distanceFromDisneyland)} min`} label="walk" />
              <InfoTile icon="🚗" value="~2 min" label="by car" />
            </div>
            <a
              href={`https://maps.google.com/?q=${hotel.latitude},${hotel.longitude}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-sm text-blue-600 font-medium mt-1"
            >
              Open in Google Maps <ExternalLink size={12} />
            </a>
          </div>

          {/* Deals */}
          {hotel.deals.length > 0 && (
            <div>
              <div className="flex items-center gap-2 mb-3 text-sm font-semibold text-gray-700">
                <Tag size={14} className="text-green-500" />
                Deals & Discounts
              </div>
              <div className="space-y-2">
                {hotel.deals.map(deal => (
                  <div key={deal.id} className="bg-green-50 border border-green-100 rounded-xl p-3">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1">
                        <p className="text-sm font-semibold text-gray-800">{deal.title}</p>
                        <p className="text-xs text-gray-500 mt-0.5">{deal.description}</p>
                        {deal.promoCode && (
                          <div className="inline-flex items-center gap-1.5 mt-1.5 bg-white border border-gray-200 rounded px-2 py-0.5">
                            <span className="text-xs text-gray-500">Code:</span>
                            <span className="text-xs font-bold text-gray-800 font-mono">{deal.promoCode}</span>
                          </div>
                        )}
                      </div>
                      <div className="shrink-0">
                        <span className="text-xs font-bold text-green-700 bg-green-100 px-2 py-1 rounded-full">
                          {deal.discountPercentage ? `${deal.discountPercentage}% off` : deal.discountAmount ? `$${deal.discountAmount} off` : 'Deal'}
                        </span>
                        <p className="text-xs text-gray-400 text-right mt-1">{deal.source}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Amenities */}
          {hotel.amenities.length > 0 && (
            <div>
              <p className="text-sm font-semibold text-gray-700 mb-3">✨ Amenities</p>
              <div className="grid grid-cols-2 gap-2">
                {hotel.amenities.map(a => (
                  <div key={a} className="flex items-center gap-2 bg-gray-50 rounded-lg px-3 py-2 text-sm text-gray-700">
                    <span>{amenityIcon(a)}</span>
                    <span className="truncate">{a}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Booking */}
          <div>
            <p className="text-sm font-semibold text-gray-700 mb-3">📅 Book Your Stay</p>

            {/* Date summary */}
            {checkIn && checkOut && (
              <div className="flex items-center justify-between bg-blue-50 rounded-xl px-4 py-3 mb-3">
                <div className="text-center">
                  <p className="text-xs text-blue-400 mb-0.5">Check-in</p>
                  <p className="text-sm font-semibold text-blue-800">{formatDate(checkIn)}</p>
                </div>
                <ChevronRight size={16} className="text-blue-300" />
                <div className="text-center">
                  <p className="text-xs text-blue-400 mb-0.5">Check-out</p>
                  <p className="text-sm font-semibold text-blue-800">{formatDate(checkOut)}</p>
                </div>
              </div>
            )}

            {/* Booking buttons */}
            <div className="space-y-2">
              {BOOKING_PLATFORMS.map(p => {
                const url = p.fn(checkIn, checkOut, hotel.adults, hotel.children)
                return (
                  <a
                    key={p.label}
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between w-full bg-white border border-gray-200 hover:border-blue-300 rounded-xl px-4 py-3 transition-colors group"
                  >
                    <div className="flex items-center gap-3">
                      <div className={`${p.color} w-9 h-9 rounded-lg flex items-center justify-center text-lg`}>
                        {p.icon}
                      </div>
                      <div className="text-left">
                        <p className="text-sm font-semibold text-gray-800">{p.label}</p>
                        <p className="text-xs text-gray-400">Search availability & prices</p>
                      </div>
                    </div>
                    <ExternalLink size={15} className="text-gray-300 group-hover:text-blue-500 transition-colors" />
                  </a>
                )
              })}

              {/* Google Hotels */}
              <a
                href={buildGoogleHotelsURL(hotel.name, checkIn, checkOut)}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between w-full bg-white border border-gray-200 hover:border-blue-300 rounded-xl px-4 py-3 transition-colors group"
              >
                <div className="flex items-center gap-3">
                  <div className="bg-blue-500 w-9 h-9 rounded-lg flex items-center justify-center text-lg">🔍</div>
                  <div className="text-left">
                    <p className="text-sm font-semibold text-gray-800">Google Hotels</p>
                    <p className="text-xs text-gray-400">Compare all prices in one place</p>
                  </div>
                </div>
                <ExternalLink size={15} className="text-gray-300 group-hover:text-blue-500 transition-colors" />
              </a>

              {/* Direct website */}
              {hotel.websiteURL && (
                <a
                  href={hotel.websiteURL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between w-full border-2 border-blue-600 rounded-xl px-4 py-3 hover:bg-blue-50 transition-colors group"
                >
                  <div className="flex items-center gap-3">
                    <div className="bg-blue-600 w-9 h-9 rounded-lg flex items-center justify-center text-lg">🏠</div>
                    <div className="text-left">
                      <p className="text-sm font-semibold text-blue-700">Hotel Website</p>
                      <p className="text-xs text-blue-400">Best rate guarantee direct</p>
                    </div>
                  </div>
                  <ExternalLink size={15} className="text-blue-300 group-hover:text-blue-600 transition-colors" />
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function InfoTile({ icon, value, label }: { icon: string; value: string; label: string }) {
  return (
    <div className="flex-1 bg-white rounded-lg p-2.5 text-center">
      <p className="text-base">{icon}</p>
      <p className="text-xs font-bold text-gray-800 mt-0.5">{value}</p>
      <p className="text-xs text-gray-400">{label}</p>
    </div>
  )
}

function formatDate(iso: string): string {
  const d = new Date(iso + 'T00:00:00')
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}
