import { useState } from 'react'
import { Hotel } from '../types'
import { HotelCard } from './HotelCard'
import { HotelDetailModal } from './HotelDetailModal'

interface Props {
  hotels: Hotel[]
  onFavorite: (id: string) => void
}

export function FavoritesView({ hotels, onFavorite }: Props) {
  const [selected, setSelected] = useState<Hotel | null>(null)

  return (
    <div className="min-h-full bg-gray-50">
      <div className="sticky top-0 z-10 bg-white border-b border-gray-100 px-4 py-3 shadow-sm">
        <h2 className="font-semibold text-gray-900 text-sm">Saved Hotels</h2>
        {hotels.length > 0 && (
          <p className="text-xs text-gray-400 mt-0.5">{hotels.length} saved</p>
        )}
      </div>

      <div className="p-4 max-w-2xl mx-auto">
        {hotels.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center px-6">
            <span className="text-6xl mb-4">🤍</span>
            <h3 className="font-semibold text-gray-800 mb-2">No Saved Hotels</h3>
            <p className="text-sm text-gray-500">Tap the heart ♥ on any hotel card in the Results tab to save it here for quick comparison.</p>
          </div>
        ) : (
          <div className="space-y-4">
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
    </div>
  )
}
