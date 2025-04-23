'use client'

import { Search } from 'lucide-react'

interface SearchBarProps {
  value: string
  onChange: (value: string) => void
  onKeyDown?: (e: React.KeyboardEvent) => void
  placeholder?: string
  disabled?: boolean
}

export default function SearchBar({
  value,
  onChange,
  onKeyDown,
  placeholder = 'Search for a city...',
  disabled = false
}: SearchBarProps) {
  return (
    <div className="relative w-full">
      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={onKeyDown}
        placeholder={placeholder}
        disabled={disabled}
        className={`
          w-full pl-10 pr-4 py-2
          rounded-md border border-gray-300
          focus:outline-none focus:ring-2 focus:ring-blue-500
          shadow-sm transition-all duration-200
          text-sm sm:text-base
          disabled:bg-gray-100 disabled:cursor-not-allowed
        `}
      />
    </div>
  )
}
