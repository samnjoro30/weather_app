<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Cache;

class WeatherController extends Controller
{
    public function current(Request $request)
    {
        $apiKey = config('services.weather.key');
        
        $city = $request->query('city');
        $lat = $request->query('lat');
        $lon = $request->query('lon');

        // Validate input
        if (!$city && (!$lat || !$lon)) {
            return response()->json([
                'error' => 'Please provide either a city name or both latitude and longitude'
            ], 400);
        }

        // Create cache key
        $cacheKey = $city ? "weather:{$city}" : "weather:{$lat},{$lon}";

        return Cache::remember($cacheKey, now()->addHour(), function() use ($apiKey, $city, $lat, $lon) {
            try {
                // Build API URL
                $url = "https://api.openweathermap.org/data/2.5/weather";
                $params = [
                    'units' => 'metric',
                    'appid' => $apiKey,
                ];

                if ($city) {
                    $params['q'] = $city;
                } else {
                    $params['lat'] = $lat;
                    $params['lon'] = $lon;
                }

                $response = Http::get($url, $params);

                if ($response->failed()) {
                    throw new \Exception("Weather API request failed: " . $response->status());
                }

                $data = $response->json();

                // Return structured response with location info
                return [
                    'weather' => [
                        'wind_speed' => $data['wind']['speed'] ?? 0,
                        'wind_direction' => $data['wind']['deg'] ?? 0,
                        'humidity' => $data['main']['humidity'] ?? 0,
                    ],
                    'location' => [
                        'name' => $data['name'] ?? 'Unknown',
                        'country' => $data['sys']['country'] ?? 'Unknown',
                        'lat' => $data['coord']['lat'] ?? $lat,
                        'lon' => $data['coord']['lon'] ?? $lon,
                    ]
                ];

            } catch (\Exception $e) {
                \Log::error("Weather API error: " . $e->getMessage());
                return response()->json([
                    'error' => 'Failed to fetch weather data',
                    'details' => $e->getMessage()
                ], 500);
            }
        });
    }
}