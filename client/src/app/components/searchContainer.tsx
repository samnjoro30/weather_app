'use client'

import { useState,useEffect } from 'react'
import { searchCity, GeoLocation } from '../api/geocoding'
import SearchBar from './searchbar'
import SearchButton from './searchButton'
import UnitToggle from './unit'
import '../styles/search.css'

export default function SearchContainer() {
  const [query, setQuery] = useState('')
  const [isSearching, setIsSearching] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [unit, setUnit] = useState<'metric' | 'imperial'>('metric')
  const [locations, setLocations] = useState<GeoLocation[]>([])

  // 1) Trigger a search
  const handleSearch = async () => {
    if (!query.trim()) {
      setError('Please enter a city name')
      return
    }

    setIsSearching(true)
    setError(null)
    setLocations([])

    try {
      const results = await searchCity(query)
      setLocations(results)
    } catch (err: any) {
      setError(err.message || 'Failed to search location')
    } finally {
      setIsSearching(false)
    }
  }

  // 2) Clear results 3s after they appear
  useEffect(() => {
    if (locations.length === 0) return

    const timer = setTimeout(() => {
      setLocations([])
    }, 3000)

    return () => clearTimeout(timer)
  }, [locations])

  // 3) Handle Enter key
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleSearch()
  }

  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-6">
      <div className="bg-white border border-gray-200 rounded-xl shadow p-6 space-y-6">
        {/* Search controls */}
        <div className="flex flex-col sm:flex-row items-center gap-3">
          <SearchBar
            value={query}
            onChange={setQuery}
            onKeyDown={handleKeyDown}
            disabled={isSearching}
          />
          <SearchButton 
            onClick={handleSearch}
            isLoading={isSearching}
          />
          <UnitToggle unit={unit} onToggle={setUnit} />
        </div>

        {/* Error */}
        {error && (
          <p className="text-sm text-red-600 text-center">{error}</p>
        )}

        {/* Location results (auto-cleared after 3s) */}
        {locations.length > 0 && (
          <ul className="mt-4 space-y-2">
            {locations.map((loc, idx) => (
              <li
                key={`${loc.name}-${loc.lat}-${loc.lon}-${idx}`}
                className="p-4 border rounded-md shadow-sm hover:bg-gray-50 transition"
              >
                <p className="font-semibold text-gray-800">
                  {loc.name}
                  {loc.state ? `, ${loc.state}` : ''}, {loc.country}
                </p>
                <p className="text-sm text-gray-600">
                  Lat: {loc.lat}, Lon: {loc.lon}
                </p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}
