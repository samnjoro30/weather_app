'use client'

import { useState } from 'react'
import { searchCity } from '../api/geocoding'
import SearchBar from './searchbar'
import SearchButton from './searchButton'
import UnitToggle from './unit'
import '../styles/search.css'

export default function SearchContainer() {
  const [query, setQuery] = useState('')
  const [isSearching, setIsSearching] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [unit, setUnit] = useState<'metric' | 'imperial'>('metric')

  const handleSearch = async () => {
    if (!query.trim()) {
      setError('Please enter a city name')
      return
    }

    setIsSearching(true)
    setError(null)

    try {
      const location = await searchCity(query)
      console.log('Found location:', location)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to search location')
    } finally {
      setIsSearching(false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch()
    }
  }

  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-6">
      <div className="bg-white border border-gray-200 rounded-xl shadow p-6">
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

        {error && (
          <p className="text-sm text-red-600 mt-2 text-center">{error}</p>
        )}
      </div>
    </div>
  )
}
