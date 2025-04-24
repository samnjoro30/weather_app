<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Log;

class WeatherController extends Controller
{
    public function current(Request $request)
    {
        \Log::info('Weather API called', ['ip' => $request->ip()]);
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

        try {
            $data = Cache::remember($cacheKey, now()->addHour(), function() use ($apiKey, $city, $lat, $lon) {
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

                return $response->json();
            });

            // Structure the response
            return response()->json([
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
            ]);

        } catch (\Exception $e) {
            Log::error("Weather API error: " . $e->getMessage());
            return response()->json([
                'error' => 'Failed to fetch weather data',
                'details' => env('APP_DEBUG') ? $e->getMessage() : null
            ], 500);
        }
    }
}