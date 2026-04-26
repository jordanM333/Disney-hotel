import { useState } from 'react'
import { SlidersHorizontal, Loader2 } from 'lucide-react'
import { Hotel, SearchParameters } from '../types'
import { HotelCard } from './HotelCard'
import { HotelDetailModal } from './HotelDetailModal'
import { FilterSortModal } from './FilterSortModal'

interface Props {
  hotels: Hotel[]
  isLoading: boolean
  hasSearched: boolean
  lowestPrice: number | null
  params: SearchParameters
  onParamsChange: (p: SearchParameters) => void
  onFavorite: (id: string) => void
}

export function HotelListView({ hotels, isLoading, hasSearched, lowestPrice, params, onParamsChange, onFavorite }: Props) {
  const [selected, setSelected] = useState<Hotel | null>(null)
  const [showFilters, setShowFilters] = useState(false)

  return (
    <div className="min-h-full bg-gray-50">
      {/* Toolbar */}
      <div className="sticky top-0 z-10 bg-white border-b border-gray-100 px-4 py-3 flex items-center justify-between shadow-sm">
        <div>
          <h2 className="font-semibold text-gray-900 text-sm">Hotels Near Disneyland</h2>
          {hasSearched && !isLoading && (
            <p className="text-xs text-gray-400 mt-0.5">
              {hotels.length} hotel{hotels.length !== 1 ? 's' : ''} within 1 mile
              {lowestPrice !== null && ` · from $${lowestPrice}/night`}
            </p>
          )}
        </div>
        {hasSearched && !isLoading && hotels.length > 0 && (
          <button
            onClick={() => setShowFilters(true)}
            className="flex items-center gap-1.5 text-sm font-medium text-blue-600 bg-blue-50 px-3 py-1.5 rounded-full hover:bg-blue-100 transition-colors"
          >
            <SlidersHorizontal size={14} />
            Filter
          </button>
        )}
      </div>

      <div className="p-4 max-w-2xl mx-auto">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-24 gap-4">
            <Loader2 size={36} className="text-blue-500 animate-spin" />
            <p className="text-gray-500 text-sm">Searching hotels near Disneyland…</p>
          </div>
        ) : !hasSearched ? (
          <EmptyPrompt />
        ) : hotels.length === 0 ? (
          <NoResults onReset={() => onParamsChange({ ...params, maxPricePerNight: 500, minRating: 0 })} />
        ) : (
          <div className="space-y-4">
            {/* Sort indicator */}
            <div className="flex items-center gap-2">
              <span className="text-xs font-medium text-blue-600 bg-blue-50 px-2.5 py-1 rounded-full">
                {sortLabel(params.sortBy)}
              </span>
            </div>
            {hotels.map(hotel => (
              <HotelCard
                key={hotel.id}
                hotel={hotel}
                onFavorite={() => onFavorite(hotel.id)}
                onClick={() => setSelected(hotel)}
              />
            ))}
          </div>
        )}
      </div>

      {selected && (
        <HotelDetailModal
          hotel={selected}
          onClose={() => setSelected(null)}
          onFavorite={() => { onFavorite(selected.id); setSelected(h => h ? { ...h, isFavorite: !h.isFavorite } : null) }}
        />
      )}

      {showFilters && (
        <FilterSortModal
          params={params}
          onChange={onParamsChange}
          onClose={() => setShowFilters(false)}
        />
      )}
    </div>
  )
}

function sortLabel(sortBy: string): string {
  const map: Record<string, string> = {
    bestValue: '⭐ Sorted: Best Value', lowestPrice: '💰 Sorted: Lowest Price',
    highestPrice: '💎 Sorted: Highest Price', topRated: '❤️ Sorted: Top Rated',
    closest: '📍 Sorted: Closest', mostDeals: '🏷️ Sorted: Most Deals',
  }
  return map[sortBy] ?? sortBy
}

function EmptyPrompt() {
  return (
    <div className="flex flex-col items-center justify-center py-24 text-center px-6">
      <span className="text-6xl mb-4">🏰</span>
      <h3 className="font-semibold text-gray-800 mb-2">Find Your Perfect Stay</h3>
      <p className="text-sm text-gray-500">Set your travel dates on the Search tab and tap <strong>Search Hotels</strong> to find the best options within 1 mile of Disneyland.</p>
    </div>
  )
}

function NoResults({ onReset }: { onReset: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center py-24 text-center px-6">
      <span className="text-5xl mb-4">🔍</span>
      <h3 className="font-semibold text-gray-800 mb-2">No Hotels Found</h3>
      <p className="text-sm text-gray-500 mb-4">Try raising the max price or lowering the minimum rating.</p>
      <button onClick={onReset} className="bg-blue-600 text-white px-5 py-2 rounded-full text-sm font-medium">Reset Filters</button>
    </div>
  )
}
