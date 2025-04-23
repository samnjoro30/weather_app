'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'

interface ForecastItem {
  date: string
  min: number
  max: number
  icon: string
  condition?: string
}

export default function Forecast() {
  const [forecast, setForecast] = useState<ForecastItem[]>([])
  const [location, setLocation] = useState('Nairobi')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string|null>(null)

  useEffect(() => {
    const fetchForecast = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Try to get user's location first
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(
            async (position) => {
              try {
                const res = await fetch(
                  `http://localhost:8000/api/forecast?lat=${position.coords.latitude}&lon=${position.coords.longitude}`
                );
                if (!res.ok) throw new Error('Failed to fetch forecast');
                
                const data = await res.json();
                // Convert object to array if needed
                const forecastData = data && typeof data === 'object' 
                  ? Object.values(data) 
                  : [];
                setForecast(forecastData);
              } catch (err) {
                console.error('Geolocation fetch error:', err);
                await fetchDefaultForecast();
              } finally {
                setLoading(false);
              }
            },
            async (error) => {
              console.warn('Geolocation failed, using default:', error);
              await fetchDefaultForecast();
            }
          );
        } else {
          await fetchDefaultForecast();
        }
      } catch (err) {
        console.error('Unexpected error:', err);
        setError('Failed to load forecast');
        setLoading(false);
      }
    };
    const fetchDefaultForecast = async () => {
      try {
        const res = await fetch(`http://localhost:8000/api/forecast?city=${location}`);
        if (!res.ok) throw new Error('Failed to fetch default forecast');
        
        const data = await res.json();
        // Convert object to array if needed
        const forecastData = data && typeof data === 'object' 
          ? Object.values(data) 
          : [];
        setForecast(forecastData);
      } catch (err) {
        console.error('Default fetch error:', err);
        setError('Failed to load default forecast');
      } finally {
        setLoading(false);
      }
    };
  
    fetchForecast();
  }, [location]);

  if (loading) {
    return <div className="text-center py-8">Loading forecast...</div>
  }

  if (error) {
    return <div className="text-center py-8 text-red-500">{error}</div>
  }

  return (
    <div className="forecast-container">
      <div className="flex gap-4 w-full justify-center flex-wrap">
        {forecast.map((day, index) => (
          <div
            key={index}
            className="flex flex-col items-center bg-white rounded-xl shadow-sm p-4 w-32 hover:shadow-md transition-shadow"
          >
            <p className="text-sm font-medium text-gray-700">{day.date}</p>
            <Image 
              src={day.icon} 
              alt="weather icon" 
              width={50} 
              height={50}
              unoptimized // Weather API icons might not support optimization
            />
            <p className="text-xs text-gray-500">
              {day.min}° - {day.max}°C
            </p>
          </div>
        ))}
      </div>
    </div>
  )
}
