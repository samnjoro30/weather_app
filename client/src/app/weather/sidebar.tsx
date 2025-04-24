'use client'
import { useEffect, useState } from 'react'
import Image from 'next/image'

interface WeatherData {
  icon: string
  temperature: number
  condition: string
  date: string
  location: string
  auto_detected?: boolean
  using_geolocation?: boolean
}

export default function WeatherSidebar() {
  const [weather, setWeather] = useState<WeatherData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [unit, setUnit] = useState<'C' | 'F'>('C') // New state for temperature unit

  useEffect(() => {
    const fetchWeather = async (latitude?: number, longitude?: number) => {
      try {
        let url = 'http://localhost:8000/api/weather'
        
        if (latitude && longitude) {
          url += `?lat=${latitude}&lon=${longitude}`
        }
        
        const res = await fetch(url)
        
        if (!res.ok) {
          throw new Error('Failed to fetch weather data')
        }
        
        const data = await res.json()
        setWeather(data)
      } catch (error) {
        console.error('Error fetching weather:', error)
        setError('Could not load weather data. Please try again later.')
      } finally {
        setLoading(false)
      }
    }

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          fetchWeather(position.coords.latitude, position.coords.longitude)
        },
        (error) => {
          console.warn('Geolocation error:', error)
          fetchWeather()
        }
      )
    } else {
      fetchWeather()
    }
  }, [])

  const toggleUnit = () => {
    setUnit(unit === 'C' ? 'F' : 'C')
  }

  const convertTemp = (temp: number) => {
    return unit === 'F' ? (temp * 9/5 + 32).toFixed(1) : temp.toFixed(1)
  }

  if (loading) {
    return (
      <div className="w-full sm:w-1/3 max-w-sm h-64 bg-white/90 shadow-lg rounded-2xl flex justify-center items-center">
        <div className="animate-pulse flex flex-col items-center space-y-4">
          <div className="h-20 w-20 bg-gray-200 rounded-full"></div>
          <div className="h-8 w-24 bg-gray-200 rounded"></div>
          <div className="h-4 w-32 bg-gray-200 rounded"></div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="w-full sm:w-1/3 max-w-sm h-64 bg-white/90 shadow-lg rounded-2xl flex flex-col justify-center items-center p-6">
        <p className="text-red-500 mb-4">{error}</p>
        <button 
          onClick={() => window.location.reload()}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
        >
          Retry
        </button>
      </div>
    )
  }

  if (!weather) {
    return (
      <div className="w-full sm:w-1/3 max-w-sm h-64 bg-white/90 shadow-lg rounded-2xl flex justify-center items-center">
        <p className="text-gray-500">Weather data unavailable</p>
      </div>
    )
  }

  return (
    <div className="w-full bg-cyan-50/70 backdrop-blur-sm border border-cyan-100 shadow-lg rounded-2xl overflow-hidden min-w-[320px] max-w-md lg:max-w-lg mx-auto 
      h-[calc(100vh-4rem)] my-8">
      
      {/* Main content wrapper */}
      <div className="p-8 flex flex-col items-center h-full">
        {/* Weather Icon */}
        <div className="mb-6 w-28 h-28 relative">
          <Image
            src={weather.icon}
            alt={weather.condition}
            fill
            className="object-contain"
            unoptimized
          />
        </div>
  
        {/* Temperature and toggle */}
        <div className="flex items-center mb-4">
          <span className="text-6xl font-bold text-gray-800">
            {convertTemp(weather.temperature)}
          </span>
          <button 
            onClick={toggleUnit}
            className="ml-3 px-3 py-1.5 bg-gray-100 rounded-full text-base font-medium text-gray-600 hover:bg-gray-200 transition"
          >
            °{unit}
          </button>
        </div>
  
        {/* Condition */}
        <p className="text-xl font-medium text-gray-600 capitalize mb-6">
          {weather.condition.toLowerCase()}
        </p>
  
        {/* Spacer pushes content below to bottom */}
        <div className="w-full text-center border-t border-gray-100 pt-6 mt-auto">
          <p className="text-base text-gray-500 mb-2">{weather.date}</p>
          <p className="text-lg font-medium text-gray-700">
            {weather.location}
          </p>
        </div>
      </div>
    </div>
  )
  }  