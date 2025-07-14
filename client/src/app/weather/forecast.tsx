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
                // const forecastData = data && typeof data === 'object' 
                //   ? Object.values(data) 
                //   : [];

                  const forecastData = convertToForecastArray(data)
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
        // const forecastData = data && typeof data === 'object' 
        //   ? Object.values(data) 
        //   : [];
          const forecastData = convertToForecastArray(data);
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
  const convertToForecastArray = (data: any): ForecastItem[] => {
    if (!data || typeof data !== 'object') return [];
    
    try {
      const values = Object.values(data);
      return values.filter((item): item is ForecastItem => (
        typeof item === 'object' && item !== null &&
        'date' in item && typeof item.date === 'string' &&
        'min' in item && typeof item.min === 'number' &&
        'max' in item && typeof item.max === 'number' &&
        'icon' in item && typeof item.icon === 'string'
      ));
    } catch {
      return [];
    }
  };

  if (loading) {
    return <div className="text-center py-8">Loading forecast...</div>
  }

  if (error) {
    return <div className="text-center py-8 text-red-500">{error}</div>
  }

  return (
    <div className="bg-cyan-50/70 backdrop-blur-sm border border-cyan-100 rounded-xl shadow-lg p-6 w-full max-w-6xl mx-auto min-h-[200px]">
      <div className="flex flex-col md:flex-row justify-center items-center md:items-stretch gap-6 w-full px-4">
        {forecast.slice(0, 3).map((day, index) => (
          <div
            key={index}
            className="flex flex-col items-center bg-white rounded-xl shadow-sm p-4 min-h-[200px] w-full max-w-[250px] hover:shadow-md transition-shadow"
          >
            <p className="text-sm font-semibold text-gray-800">{day.date}</p>
            <Image 
              src={day.icon} 
              alt="weather icon" 
              width={60} 
              height={60}
              unoptimized
              className="my-3"
            />
            <p className="text-sm text-gray-600">{day.min}° / {day.max}°C</p>
          </div>
        ))}
      </div>
    </div>
  );
  
}
