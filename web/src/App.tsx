import { useState } from 'react'
import { TabId } from './types'
import { useHotelSearch } from './hooks/useHotelSearch'
import { SearchView } from './components/SearchView'
import { HotelListView } from './components/HotelListView'
import { FavoritesView } from './components/FavoritesView'

export default function App() {
  const [tab, setTab] = useState<TabId>('search')
  const {
    hotels, favoritedHotels, isLoading, error, hasSearched,
    params, setParams, search, toggleFavorite,
  } = useHotelSearch()

  function handleSearch() {
    search()
    setTab('results')
  }

  return (
    <div className="flex flex-col h-screen bg-gray-50 max-w-2xl mx-auto">
      {/* Content */}
      <main className="flex-1 overflow-y-auto">
        {tab === 'search' && (
          <SearchView
            params={params}
            onChange={setParams}
            onSearch={handleSearch}
            isLoading={isLoading}
            error={error}
          />
        )}
        {tab === 'results' && (
          <HotelListView
            hotels={hotels}
            isLoading={isLoading}
            hasSearched={hasSearched}
            params={params}
            onParamsChange={setParams}
            onFavorite={toggleFavorite}
          />
        )}
        {tab === 'saved' && (
          <FavoritesView
            hotels={favoritedHotels}
            onFavorite={toggleFavorite}
          />
        )}
      </main>

      {/* Tab bar */}
      <nav className="bg-white border-t border-gray-200 flex items-stretch shrink-0">
        <TabButton
          active={tab === 'search'}
          icon="🔍"
          label="Search"
          onClick={() => setTab('search')}
        />
        <TabButton
          active={tab === 'results'}
          icon="📋"
          label="Results"
          badge={hasSearched && !isLoading && hotels.length > 0 ? hotels.length : undefined}
          onClick={() => setTab('results')}
        />
        <TabButton
          active={tab === 'saved'}
          icon="❤️"
          label="Saved"
          badge={favoritedHotels.length > 0 ? favoritedHotels.length : undefined}
          onClick={() => setTab('saved')}
        />
      </nav>
    </div>
  )
}

function TabButton({
  active, icon, label, badge, onClick
}: { active: boolean; icon: string; label: string; badge?: number; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={`flex-1 flex flex-col items-center justify-center gap-0.5 py-2.5 relative transition-colors ${active ? 'text-blue-600' : 'text-gray-400 hover:text-gray-600'}`}
    >
      <span className="text-xl leading-none">{icon}</span>
      <span className={`text-xs font-medium ${active ? 'text-blue-600' : 'text-gray-500'}`}>{label}</span>
      {badge !== undefined && (
        <span className="absolute top-1.5 right-[calc(50%-16px)] bg-blue-600 text-white text-[10px] font-bold rounded-full min-w-[16px] h-4 flex items-center justify-center px-1">
          {badge}
        </span>
      )}
      {active && <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-8 h-0.5 bg-blue-600 rounded-full" />}
    </button>
  )
}
