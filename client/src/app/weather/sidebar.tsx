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
  

  useEffect(() => {
    const fetchWeather = async (latitude?: number, longitude?: number) => {
      try {
        let url = 'http://localhost:8000/api/weather'
        
        // If coordinates are available, add them as query params
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

    // Try to get user's geolocation first
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          fetchWeather(position.coords.latitude, position.coords.longitude)
        },
        (error) => {
          console.warn('Geolocation error:', error)
          // Fall back to IP-based location if geolocation fails
          fetchWeather()
        }
      )
    } else {
      // Browser doesn't support geolocation, use IP-based location
      fetchWeather()
    }
  }, [])

  if (loading) {
    return (
      <div className="w-full sm:w-1/3 max-w-sm flex justify-center items-center h-64 bg-white/90 shadow-md rounded-xl">
        <p className="text-gray-500">Loading weather data...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="w-full sm:w-1/3 max-w-sm flex justify-center items-center h-64 bg-white/90 shadow-md rounded-xl">
        <p className="text-red-500">{error}</p>
      </div>
    )
  }

  if (!weather) {
    return (
      <div className="w-full sm:w-1/3 max-w-sm flex justify-center items-center h-64 bg-white/90 shadow-md rounded-xl">
        <p className="text-gray-500">Weather data unavailable</p>
      </div>
    )
  }

  return (
    <div className="w-full sm:w-1/3 max-w-sm h-full flex flex-col justify-between items-center rounded-xl bg-white/90 shadow-md p-6">
      <div className="mb-4">
        <Image 
          src={weather.icon} 
          alt="Weather Icon" 
          width={100} 
          height={100} 
          unoptimized // Weather API icons might not be optimized
        />
      </div>
      <div className="text-4xl font-semibold text-gray-800">
        {weather.temperature}°C
      </div>
      <div className="text-lg text-gray-600">{weather.condition}</div>
      <div className="text-center mt-6 text-sm text-gray-500">
        <p>{weather.date}</p>
        <p className="font-medium">
          {weather.location}
          {weather.auto_detected && (
            <span className="text-xs text-gray-400 ml-1">(your location)</span>
          )}
        </p>
      </div>
    </div>
  )
}