export interface GeoLocation {
  name: string
  lat: number
  lon: number
  country: string
  state?: string
}

export async function searchCity(query: string): Promise<GeoLocation[]> {
  const url = `http://localhost:8000/api/location?query=${encodeURIComponent(query)}`;

  try {
    const res = await fetch(url)
    if (!res.ok) {
      const message = await res.text()
      throw new Error(`Error ${res.status}: ${res.statusText} - ${message}`)
    }

    return await res.json()
  } catch (err: any) {
    console.error('Fetch error:', err.message)
    throw err
  }
}
