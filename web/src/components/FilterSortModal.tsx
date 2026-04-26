import { X } from 'lucide-react'
import { SearchParameters, SortOption } from '../types'

const SORT_OPTIONS: { value: SortOption; label: string; icon: string }[] = [
  { value: 'bestValue',    label: 'Best Value',    icon: '⭐' },
  { value: 'lowestPrice',  label: 'Lowest Price',  icon: '💰' },
  { value: 'highestPrice', label: 'Highest Price', icon: '💎' },
  { value: 'topRated',     label: 'Top Rated',     icon: '❤️' },
  { value: 'closest',      label: 'Closest',       icon: '📍' },
  { value: 'mostDeals',    label: 'Most Deals',    icon: '🏷️' },
]

interface Props {
  params: SearchParameters
  onChange: (p: SearchParameters) => void
  onClose: () => void
}

export function FilterSortModal({ params, onChange, onClose }: Props) {
  function set<K extends keyof SearchParameters>(key: K, value: SearchParameters[K]) {
    onChange({ ...params, [key]: value })
  }

  function reset() {
    onChange({ ...params, sortBy: 'bestValue', maxPricePerNight: 500, minRating: 0 })
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full sm:max-w-md bg-white rounded-t-3xl sm:rounded-2xl shadow-2xl max-h-[85vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-100 px-5 py-4 flex items-center justify-between rounded-t-3xl sm:rounded-t-2xl">
          <h2 className="font-semibold text-gray-900 text-base">Filter & Sort</h2>
          <div className="flex items-center gap-3">
            <button onClick={reset} className="text-sm text-red-500 font-medium">Reset</button>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
              <X size={20} />
            </button>
          </div>
        </div>

        <div className="p-5 space-y-6">
          {/* Sort by */}
          <section>
            <h3 className="text-sm font-semibold text-gray-700 mb-3">Sort By</h3>
            <div className="grid grid-cols-2 gap-2">
              {SORT_OPTIONS.map(opt => (
                <button
                  key={opt.value}
                  onClick={() => set('sortBy', opt.value)}
                  className={`flex items-center gap-2 px-3 py-2.5 rounded-xl border text-sm font-medium transition-colors ${
                    params.sortBy === opt.value
                      ? 'bg-blue-600 border-blue-600 text-white'
                      : 'bg-white border-gray-200 text-gray-700 hover:border-blue-300'
                  }`}
                >
                  <span>{opt.icon}</span>
                  <span>{opt.label}</span>
                </button>
              ))}
            </div>
          </section>

          {/* Max price */}
          <section>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold text-gray-700">Max Price / Night</h3>
              <span className="text-sm font-bold text-blue-600">${params.maxPricePerNight}</span>
            </div>
            <input
              type="range"
              min={50} max={800} step={25}
              value={params.maxPricePerNight}
              onChange={e => set('maxPricePerNight', Number(e.target.value))}
              className="w-full accent-blue-600"
            />
            <div className="flex justify-between text-xs text-gray-400 mt-1">
              <span>$50</span><span>$800</span>
            </div>
          </section>

          {/* Min rating */}
          <section>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold text-gray-700">Min Rating</h3>
              <span className="text-sm font-bold text-yellow-500">★ {params.minRating.toFixed(1)}+</span>
            </div>
            <input
              type="range"
              min={0} max={5} step={0.5}
              value={params.minRating}
              onChange={e => set('minRating', Number(e.target.value))}
              className="w-full accent-yellow-400"
            />
            <div className="flex justify-between text-xs text-gray-400 mt-1">
              <span>Any</span><span>5.0</span>
            </div>
          </section>

          <button
            onClick={onClose}
            className="w-full bg-blue-600 text-white rounded-xl py-3 font-semibold"
          >
            Show Results
          </button>
        </div>
      </div>
    </div>
  )
}
