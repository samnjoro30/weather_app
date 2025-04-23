export interface GeoLocation {
  name: string
  lat: number
  lon: number
  country: string
  state?: string
}

const API_KEY = 'YOUR_API_KEY' // 🔐 Replace this with your OpenWeatherMap API key

export async function searchCity(query: string): Promise<GeoLocation[]> {
  const url = `https://api.openweathermap.org/geo/1.0/direct?q=${encodeURIComponent(query)}&limit=1&appid=${API_KEY}`

  const res = await fetch(url)
  if (!res.ok) {
    throw new Error(`Failed to fetch geocoding data: ${res.statusText}`)
  }

  const data = await res.json()
  return data as GeoLocation[]
}
