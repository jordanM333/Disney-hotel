import { Heart, Star, MapPin, Tag, TrendingUp } from 'lucide-react'
import { Hotel } from '../types'
import { formatDistance, walkingMinutes } from '../utils/locationHelper'
import { computeValueScore, priceLevelDisplay, estimatedPriceRange } from '../utils/valueScore'

interface Props {
  hotel: Hotel
  onFavorite: () => void
  onClick: () => void
}

export function HotelCard({ hotel, onFavorite, onClick }: Props) {
  const score = computeValueScore(hotel)
  const isBestValue = score > 70

  return (
    <div
      className="bg-white rounded-2xl shadow-sm overflow-hidden cursor-pointer hover:shadow-md transition-shadow active:scale-[0.99] transition-transform"
      onClick={onClick}
    >
      {/* Photo */}
      <div className="relative h-44 bg-gradient-to-br from-blue-600 to-indigo-800 flex items-center justify-center overflow-hidden">
        <span className="text-6xl opacity-60">🏨</span>

        <button
          onClick={e => { e.stopPropagation(); onFavorite() }}
          className="absolute top-3 right-3 w-9 h-9 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center hover:bg-white/40 transition-colors"
        >
          <Heart size={18} className={hotel.isFavorite ? 'text-red-500 fill-red-500' : 'text-white'} />
        </button>

        {isBestValue && (
          <div className="absolute bottom-3 left-3 flex items-center gap-1 bg-blue-600 text-white text-xs font-semibold px-2.5 py-1 rounded-full">
            <TrendingUp size={11} /> Best Value
          </div>
        )}
      </div>

      {/* Info */}
      <div className="p-4 space-y-2.5">
        {/* Name + price tier */}
        <div className="flex items-start justify-between gap-3">
          <h3 className="font-semibold text-gray-900 text-sm leading-snug flex-1">{hotel.name}</h3>
          <div className="text-right shrink-0">
            <p className="text-base font-bold text-gray-800">{estimatedPriceRange(hotel.priceLevel)}</p>
            <p className="text-xs text-amber-600 font-medium">est. / night</p>
          </div>
        </div>

        {/* Rating + distance + price level */}
        <div className="flex items-center gap-3 flex-wrap">
          <div className="flex items-center gap-1">
            <Star size={12} className="text-yellow-400 fill-yellow-400" />
            <span className="text-xs font-semibold text-gray-700">{hotel.rating.toFixed(1)}</span>
            <span className="text-xs text-gray-400">({hotel.reviewCount.toLocaleString()})</span>
          </div>
          <div className="flex items-center gap-1 text-green-600">
            <MapPin size={11} />
            <span className="text-xs font-medium">{formatDistance(hotel.distanceFromDisneyland)}</span>
            <span className="text-xs text-gray-400">· {walkingMinutes(hotel.distanceFromDisneyland)} min walk</span>
          </div>
          <span className="text-xs text-gray-400">{priceLevelDisplay(hotel.priceLevel)}</span>
        </div>

        {/* Deal badges — only deals the user qualifies for */}
        {hotel.deals.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {hotel.deals.slice(0, 3).map(deal => (
              <span key={deal.id}
                className="inline-flex items-center gap-1 text-xs font-medium text-green-700 bg-green-50 border border-green-100 px-2 py-0.5 rounded-full">
                <Tag size={9} />
                {deal.discountPercentage ? `${deal.discountPercentage}% off` : 'Deal'} · {deal.source}
              </span>
            ))}
            {hotel.deals.length > 3 && (
              <span className="text-xs text-gray-400">+{hotel.deals.length - 3} more</span>
            )}
          </div>
        )}

        {/* Tap-to-book CTA */}
        <p className="text-xs text-blue-500 font-medium">Tap to see real prices & book →</p>
      </div>
    </div>
  )
}
