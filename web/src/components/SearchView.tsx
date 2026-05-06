import { MapPin, Moon, Search } from 'lucide-react'
import { SearchParameters, Membership } from '../types'
import { nightsBetween } from '../utils/constants'

interface Props {
  params: SearchParameters
  onChange: (p: SearchParameters) => void
  onSearch: () => void
  isLoading: boolean
  error: string | null
}

const MEMBERSHIPS: { id: Membership; label: string; icon: string; description: string }[] = [
  { id: 'aaa',      label: 'AAA',              icon: '🚗', description: 'AAA / CAA member' },
  { id: 'aarp',     label: 'AARP',             icon: '👴', description: 'Age 50+, AARP member' },
  { id: 'military', label: 'Military',         icon: '🎖️', description: 'Active duty, veteran, or first responder' },
  { id: 'costco',   label: 'Costco Travel',    icon: '🛒', description: 'Costco membership' },
]

export function SearchView({ params, onChange, onSearch, isLoading, error }: Props) {
  const nights = nightsBetween(params.checkIn, params.checkOut)
  const today = new Date().toISOString().slice(0, 10)

  function set<K extends keyof SearchParameters>(key: K, value: SearchParameters[K]) {
    const next = { ...params, [key]: value }
    if (key === 'checkIn' && next.checkOut <= next.checkIn) {
      const d = new Date(value as string)
      d.setDate(d.getDate() + 1)
      next.checkOut = d.toISOString().slice(0, 10)
    }
    onChange(next)
  }

  function toggleMembership(id: Membership) {
    const current = params.memberships
    const next = current.includes(id) ? current.filter(m => m !== id) : [...current, id]
    onChange({ ...params, memberships: next })
  }

  return (
    <div className="flex flex-col min-h-full">
      {/* Hero */}
      <div className="bg-gradient-to-br from-blue-900 to-blue-600 text-white px-6 py-10">
        <div className="max-w-lg mx-auto">
          <div className="flex items-center gap-3 mb-2">
            <span className="text-4xl">🏰</span>
            <div>
              <h1 className="text-2xl font-bold leading-tight">Disneyland Hotel Finder</h1>
              <p className="text-blue-200 text-sm">Hotels within 1 mile · Real deals · Live booking</p>
            </div>
          </div>
          <div className="flex items-center gap-2 mt-4 text-blue-200 text-xs">
            <MapPin size={12} />
            <span>1313 Disneyland Dr, Anaheim, CA 92802</span>
          </div>
        </div>
      </div>

      {/* Form */}
      <div className="flex-1 bg-gray-50 px-4 py-6">
        <div className="max-w-lg mx-auto space-y-4">

          {/* Dates */}
          <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
            <div className="flex items-center gap-2 px-4 py-3 border-b border-gray-100">
              <span className="text-blue-500">📅</span>
              <span className="font-semibold text-gray-800">Travel Dates</span>
            </div>
            <div className="divide-y divide-gray-100">
              <div className="flex items-center justify-between px-4 py-3">
                <span className="text-sm text-gray-500 w-24">Check-in</span>
                <input type="date" value={params.checkIn} min={today}
                  onChange={e => set('checkIn', e.target.value)}
                  className="text-sm font-medium text-gray-800 border border-gray-200 rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <div className="flex items-center justify-between px-4 py-3">
                <span className="text-sm text-gray-500 w-24">Check-out</span>
                <input type="date" value={params.checkOut} min={params.checkIn}
                  onChange={e => set('checkOut', e.target.value)}
                  className="text-sm font-medium text-gray-800 border border-gray-200 rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <div className="flex items-center gap-2 px-4 py-2.5 text-indigo-600">
                <Moon size={14} />
                <span className="text-sm font-medium">{nights} night{nights !== 1 ? 's' : ''}</span>
              </div>
            </div>
          </div>

          {/* Guests */}
          <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
            <div className="flex items-center gap-2 px-4 py-3 border-b border-gray-100">
              <span className="text-blue-500">👥</span>
              <span className="font-semibold text-gray-800">Guests</span>
            </div>
            <div className="divide-y divide-gray-100">
              <Stepper label="Adults" sub="Age 18+"
                value={params.adults} min={1} max={8}
                onChange={v => set('adults', v)} />
              <Stepper label="Children" sub="Age 0–17"
                value={params.children} min={0} max={6}
                onChange={v => set('children', v)} />
            </div>
          </div>

          {/* Memberships */}
          <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
            <div className="px-4 py-3 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <span className="text-blue-500">🏷️</span>
                <span className="font-semibold text-gray-800">My Memberships</span>
              </div>
              <p className="text-xs text-gray-400 mt-0.5">Select what you qualify for — only those deals will be shown</p>
            </div>
            <div className="p-3 grid grid-cols-2 gap-2">
              {MEMBERSHIPS.map(m => {
                const active = params.memberships.includes(m.id)
                return (
                  <button
                    key={m.id}
                    onClick={() => toggleMembership(m.id)}
                    className={`flex items-center gap-2 px-3 py-2.5 rounded-xl border text-left transition-colors ${
                      active
                        ? 'bg-blue-600 border-blue-600 text-white'
                        : 'bg-white border-gray-200 text-gray-700 hover:border-blue-300'
                    }`}
                  >
                    <span className="text-lg leading-none">{m.icon}</span>
                    <div>
                      <p className="text-sm font-semibold leading-none">{m.label}</p>
                      <p className={`text-xs mt-0.5 leading-tight ${active ? 'text-blue-100' : 'text-gray-400'}`}>{m.description}</p>
                    </div>
                  </button>
                )
              })}
            </div>
            {params.memberships.length === 0 && (
              <p className="text-xs text-center text-gray-400 pb-3">No memberships selected — only general deals shown</p>
            )}
          </div>

          {/* Error */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 flex items-start gap-2">
              <span className="text-red-500 mt-0.5">⚠️</span>
              <p className="text-sm text-red-700">{error}</p>
            </div>
          )}

          {/* Search button */}
          <button onClick={onSearch} disabled={isLoading}
            className="w-full bg-gradient-to-r from-blue-900 to-blue-500 text-white rounded-2xl py-4 font-semibold text-lg flex items-center justify-center gap-3 shadow-md active:scale-95 transition-transform disabled:opacity-70">
            {isLoading ? <><Spinner /> Searching…</> : <><Search size={20} /> Search Hotels</>}
          </button>

          {/* Info note */}
          <div className="bg-blue-50 border border-blue-200 rounded-xl px-4 py-3 flex items-start gap-2">
            <span className="text-blue-500 mt-0.5 shrink-0">ℹ️</span>
            <p className="text-xs text-blue-700">
              <strong>Live rates powered by liteapi.travel.</strong> Prices shown include taxes & fees for your selected dates. Tap any hotel for the full breakdown — parking, WiFi, resort fees, and booking links.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

function Stepper({ label, sub, value, min, max, onChange }: {
  label: string; sub: string; value: number; min: number; max: number; onChange: (v: number) => void
}) {
  return (
    <div className="flex items-center justify-between px-4 py-3">
      <div>
        <p className="text-sm font-medium text-gray-800">{label}</p>
        <p className="text-xs text-gray-400">{sub}</p>
      </div>
      <div className="flex items-center gap-4">
        <button onClick={() => onChange(Math.max(min, value - 1))} disabled={value <= min}
          className="w-8 h-8 rounded-full bg-blue-50 text-blue-600 font-bold text-lg flex items-center justify-center disabled:opacity-30 hover:bg-blue-100 transition-colors">−</button>
        <span className="w-5 text-center font-semibold text-gray-800">{value}</span>
        <button onClick={() => onChange(Math.min(max, value + 1))} disabled={value >= max}
          className="w-8 h-8 rounded-full bg-blue-50 text-blue-600 font-bold text-lg flex items-center justify-center disabled:opacity-30 hover:bg-blue-100 transition-colors">+</button>
      </div>
    </div>
  )
}

function Spinner() {
  return (
    <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
    </svg>
  )
}
