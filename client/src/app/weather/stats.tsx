'use client'

import { useEffect, useState } from 'react'

interface WeatherStats {
  wind_speed: number
  wind_direction: number
  humidity: number
}

interface GeoLocation {
  name: string
  country: string
  lat: number
  lon: number
}

export default function WeatherStats() {
  const [stats, setStats] = useState<WeatherStats | null>(null)
  const [location, setLocation] = useState<GeoLocation | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchWeatherData = async (lat: number, lon: number) => {
      try {
        setLoading(true)
        setError(null)
        
        const response = await fetch(`http://localhost:8000/api/current?lat=${lat}&lon=${lon}`)
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }
        
        const data = await response.json()
        
        if (data.error) {
          throw new Error(data.error)
        }
        
        setStats(data.weather)
        setLocation(data.location)
      } catch (err) {
        console.error('Failed to fetch weather data:', err)
        setError(err instanceof Error ? err.message : 'Unknown error occurred')
      } finally {
        setLoading(false)
      }
    }

    const handleGeolocation = () => {
      if (!navigator.geolocation) {
        setError('Geolocation is not supported by your browser')
        setLoading(false)
        return
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords
          fetchWeatherData(latitude, longitude)
        },
        (err) => {
          console.error('Geolocation error:', err)
          setError('Could not retrieve your location. Please enable location services.')
          setLoading(false)
        }
      )
    }

    handleGeolocation()
  }, [])

  if (loading) {
    return (
      <div className="bg-white shadow-md rounded-2xl p-6 w-full max-w-3xl mx-auto mt-6">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-1/2 mx-auto mb-4"></div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="bg-gray-50 rounded-xl p-5 shadow-inner h-32"></div>
            <div className="bg-gray-50 rounded-xl p-5 shadow-inner h-32"></div>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-white shadow-md rounded-2xl p-6 w-full max-w-3xl mx-auto mt-6">
        <div className="text-center text-red-500">
          <p>{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Try Again
          </button>
        </div>
      </div>
    )
  }

  if (!stats || !location) {
    return null
  }

  return (
    <div className="bg-white shadow-md rounded-2xl p-6 w-full max-w-3xl mx-auto mt-6">
      <h2 className="text-lg font-semibold text-gray-800 mb-4 text-center">
        Weather Details — {location.name}, {location.country}
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div className="bg-gray-50 rounded-xl p-5 shadow-inner flex flex-col items-center">
          <p className="text-sm font-medium text-gray-600 mb-1">Wind Status</p>
          <p className="text-3xl font-bold text-gray-800">
            {stats.wind_speed.toFixed(1)} km/h
          </p>
          <p className="text-xs text-gray-500 mt-1">
            Direction: {getWindDirection(stats.wind_direction)}
          </p>
        </div>

        <div className="bg-gray-50 rounded-xl p-5 shadow-inner flex flex-col items-center">
          <p className="text-sm font-medium text-gray-600 mb-1">Humidity</p>
          <p className="text-3xl font-bold text-gray-800">{stats.humidity}%</p>
          <div className="w-full mt-3">
            <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-blue-500"
                style={{ width: `${stats.humidity}%` }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// Helper function to convert degrees to cardinal direction
function getWindDirection(degrees: number): string {
  const directions = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW']
  const index = Math.round((degrees % 360) / 45) % 8
  return directions[index]
}