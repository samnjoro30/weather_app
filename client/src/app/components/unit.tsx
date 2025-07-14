'use client'

interface UnitToggleProps {
  unit: 'metric' | 'imperial'
  onToggle: (unit: 'metric' | 'imperial') => void
}

export default function UnitToggle({ unit, onToggle }: UnitToggleProps) {
  return (
    <div className="flex items-center space-x-2">
      <label className="text-sm font-medium text-gray-700 dark:text-gray-200">Unit:</label>
      <div className="bg-gray-200 dark:bg-gray-700 rounded-full p-1 flex items-center">
        <button
          onClick={() => onToggle('metric')}
          className={`px-3 py-1 text-sm rounded-full transition ${
            unit === 'metric' ? 'bg-blue-600 text-white' : 'text-gray-700 dark:text-gray-300'
          }`}
        >
          °C
        </button>
        <button
          onClick={() => onToggle('imperial')}
          className={`px-3 py-1 text-sm rounded-full transition ${
            unit === 'imperial' ? 'bg-blue-600 text-white' : 'text-gray-700 dark:text-gray-300'
          }`}
        >
          °F
        </button>
      </div>
    </div>
  )
}
