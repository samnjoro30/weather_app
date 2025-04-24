<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class GeocodingController extends Controller {
    public  function search(Request $request)
    {
        $request->validate([
            'query' => 'required|string|min:2'
        ]); 

        $apiKey = config('services.weather.key');
        $query = $request->input('query');
        
        try {
            $response = Http::get('https://api.openweathermap.org/geo/1.0/direct', [
                'q' => $query,
                'limit' => 5, // Return top 5 results
                'appid' => $apiKey
            ]);

            if ($response->failed()) {
                throw new \Exception("Geocoding API request failed: " . $response->status());
            }

            $locations = collect($response->json())->map(function ($item) {
                return [
                    'name' => $item['name'] ?? 'Unknown',
                    'lat' => $item['lat'] ?? 0,
                    'lon' => $item['lon'] ?? 0,
                    'country' => $item['country'] ?? 'Unknown',
                    'state' => $item['state'] ?? null,
                ];
            });

            return response()->json($locations);

        } catch (\Exception $e) {
            Log::error("Geocoding error: " . $e->getMessage());
            return response()->json([
                'error' => 'Failed to fetch location data',
                'details' => env('APP_DEBUG') ? $e->getMessage() : null
            ], 500);
        }
    }
}