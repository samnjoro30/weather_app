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
  const [hasFetched, setHasFetched] = useState(false)

  useEffect(() => {
    if (hasFetched) return
    const fetchWeatherData = async (lat: number, lon: number) => {
      try {
        setLoading(true)
        setError(null)
        
        const response = await fetch(`http://localhost:8000/api/current?lat=${lat}&lon=${lon}`)

        
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }
        
        const data = await response.json()
        console.log("data", data)
        
        if (data.error) {
          throw new Error(data.error)
        }
        
        setStats(data.weather)
        setLocation(data.location)
        setHasFetched(true)
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
  }, [hasFetched])

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
    // <div className="bg-gray-800/60 text-white backdrop-blur-sm rounded-xl shadow-lg p-8 w-full max-w-lg mx-auto">
    <div className="bg-cyan-50/70 backdrop-blur-sm border border-cyan-100 rounded-xl shadow-lg p-6 w-full max-w-4xl mx-auto min-h-[280px]">

    {/* <div className="bg-gradient-to-br from-white/70 to-blue-50/60 backdrop-blur-md rounded-xl shadow-lg p-8 w-full max-w-lg mx-auto"> */}

      {/* Weather Stats Title - optional */}
      <h2 className="text-2xl font-semibold text-gray-800 mb-8 text-center">
        Weather Details
      </h2>

      {/* Two distinct containers with increased gap */}
      
      <div className="grid grid-cols-2 gap-6">
        {/* Wind Container */}
        {/* <div className="bg-blue-50/50 rounded-xl p-6 border border-blue-100 h-full min-h-[180px]"> */}
        <div className="bg-white rounded-xl p-6 shadow-md h-full min-h-[180px] w-full">

          <div className="flex flex-col items-center h-full justify-between">
            <div className="flex items-center mb-3">
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                className="w-6 h-6 text-blue-500 mr-2" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M12 19l-3 3m0 0l-3-3m3 3V11m0-4a4 4 0 100-8 4 4 0 000 8z" 
                />
              </svg>
              <span className="text-md font-medium text-blue-600">Wind</span>
            </div>
            <p className="text-3xl font-bold text-gray-800">
              {stats.wind_speed.toFixed(1)} km/h
            </p>
            <div className="text-sm text-gray-500 mt-2">
              Direction: {getWindDirection(stats.wind_direction)}
            </div>
          </div>
        </div>
        
        {/* Humidity Container */}
        {/* <div className="bg-teal-50/50 rounded-xl p-6 border border-teal-100 h-full min-h-[180px]"> */}
        <div className="bg-white rounded-xl p-6 shadow-md h-full min-h-[180px] w-full">
          <div className="flex flex-col items-center h-full justify-between">
            <div className="flex items-center mb-3">
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                className="w-6 h-6 text-teal-500 mr-2" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" 
                />
              </svg>
              <span className="text-md font-medium text-teal-600">Humidity</span>
            </div>
            <p className="text-3xl font-bold text-gray-800">{stats.humidity}%</p>
            <div className="w-full mt-3 px-2">
              <div className="h-2.5 bg-gray-200 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-teal-500" 
                  style={{ width: `${stats.humidity}%` }} 
                />
              </div>
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