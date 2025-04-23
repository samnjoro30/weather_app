<?php
namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;

class weatherDay extends Controller
{
    public function getWeather(Request $request)
    {
        // Get API key from config (store in .env)
        $apiKey = config('services.weather.key');
        
        // Determine location - either from query param or from IP
        $location = $request->query('city');
        $autoLocation = false;
        
        if (!$location) {
            // Try to get location from IP
            try {
                $ip = $request->ip();
                // For local development, use a test IP or default location
                if ($ip === '127.0.0.1') {
                    $ip = ''; // Use empty string to fall back to client IP
                    // Or set a default for testing:
                    // $location = 'Nairobi';
                }
                
                if (!$location) {
                    $ipInfo = Http::get("http://ip-api.com/json/{$ip}")->json();
                    if ($ipInfo && $ipInfo['status'] === 'success') {
                        $location = $ipInfo['city'] ?? $ipInfo['country'];
                        $autoLocation = true;
                    }
                }
            } catch (\Exception $e) {
                \Log::error("IP location failed: " . $e->getMessage());
            }
        }
        
        if (!$location) {
            return response()->json(['error' => 'Location not provided and could not be determined'], 400);
        }
        
        try {
            // Fetch weather data from a weather API (using OpenWeatherMap in this example)
            $response = Http::get("https://api.openweathermap.org/data/2.5/weather", [
                'q' => $location,
                'appid' => $apiKey,
                'units' => 'metric',
            ]);
            
            if ($response->failed()) {
                return response()->json(['error' => 'Failed to fetch weather data'], 500);
            }
            
            $weatherData = $response->json();
            
            // Format the data for your frontend
            return response()->json([
                'temperature' => round($weatherData['main']['temp']),
                'condition' => $weatherData['weather'][0]['main'],
                'icon' => "https://openweathermap.org/img/wn/{$weatherData['weather'][0]['icon']}@2x.png",
                'date' => now()->format('l, F j, Y'),
                'location' => $weatherData['name'],
                'auto_detected' => $autoLocation,
            ]);
            
        } catch (\Exception $e) {
            \Log::error("Weather API error: " . $e->getMessage());
            return response()->json(['error' => 'Weather service unavailable'], 503);
        }
    }
}