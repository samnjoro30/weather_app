'use client'

import { ReactNode } from 'react'
import { Loader2 } from 'lucide-react'

interface SearchButtonProps {
  onClick: () => void
  isLoading: boolean
  className?: string
  children?: ReactNode
}

export default function SearchButton({
  onClick,
  isLoading,
  className = '',
  children = 'Search'
}: SearchButtonProps) {
  return (
    <button
      onClick={onClick}
      disabled={isLoading}
      className={`p-2 rounded-md text-white bg-blue-600 hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
      aria-label="Search for weather"
    >
      {isLoading ? (
        <Loader2 className="h-5 w-5 animate-spin" />
      ) : (
        children
      )}
    </button>
  )
}