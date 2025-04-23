<?php
namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;


class ForecastController extends Controller
{
    private $apiKey;
    private $daysToShow = 3;
    private $hoursToInclude = 24; // 3 days * 8 periods per day

    public function __construct()
    {
        $this->apiKey = config('services.weather.key');
    }

    public function getForecast(Request $request)
    {
        try {
            $location = $this->getLocationFromRequest($request);
            $forecastData = $this->fetchForecastData($location);
            $processedData = $this->processForecastData($forecastData);
            
            return response()->json($processedData);
            
        } catch (\Exception $e) {
            Log::error("Forecast error: " . $e->getMessage());
            return response()->json([
                'error' => 'Could not retrieve forecast',
                'details' => env('APP_DEBUG') ? $e->getMessage() : null
            ], 500);
        }
    }

    private function getLocationFromRequest(Request $request)
    {
        if ($request->has(['lat', 'lon'])) {
            return [
                'type' => 'coordinates',
                'lat' => $request->lat,
                'lon' => $request->lon
            ];
        }

        return [
            'type' => 'city',
            'name' => $request->query('city', 'Nairobi') // Default to Nairobi
        ];
    }

    private function fetchForecastData(array $location)
    {
        $params = [
            'appid' => $this->apiKey,
            'units' => 'metric',
            'cnt' => $this->hoursToInclude
        ];

        if ($location['type'] === 'coordinates') {
            $params['lat'] = $location['lat'];
            $params['lon'] = $location['lon'];
        } else {
            $params['q'] = $location['name'];
        }

        $response = Http::get("https://api.openweathermap.org/data/2.5/forecast", $params);

        if ($response->failed()) {
            throw new \Exception("Weather API request failed with status: " . $response->status());
        }

        return $response->json();
    }

    private function processForecastData(array $forecastData)
    {
        $groupedByDate = [];
        
        foreach ($forecastData['list'] as $item) {
            $date = date('Y-m-d', $item['dt']);
            
            if (!isset($groupedByDate[$date])) {
                $groupedByDate[$date] = [
                    'min_temp' => $item['main']['temp_min'],
                    'max_temp' => $item['main']['temp_max'],
                    'icons' => [$item['weather'][0]['icon']],
                    'conditions' => [$item['weather'][0]['main']],
                    'timestamp' => $item['dt']
                ];
            } else {
                $groupedByDate[$date]['min_temp'] = min($groupedByDate[$date]['min_temp'], $item['main']['temp_min']);
                $groupedByDate[$date]['max_temp'] = max($groupedByDate[$date]['max_temp'], $item['main']['temp_max']);
                $groupedByDate[$date]['icons'][] = $item['weather'][0]['icon'];
                $groupedByDate[$date]['conditions'][] = $item['weather'][0]['main'];
            }
        }

        // Sort by date and limit to requested days
        ksort($groupedByDate);
        $dailyForecasts = array_slice($groupedByDate, 0, $this->daysToShow);

        return array_map(function ($day) {
            return [
                'date' => date('D, M j', $day['timestamp']),
                'min' => round($day['min_temp']),
                'max' => round($day['max_temp']),
                'icon' => $this->getMostRepresentativeIcon($day['icons']),
                'condition' => $this->getMostCommonCondition($day['conditions'])
            ];
        }, $dailyForecasts);
    }

    private function getMostRepresentativeIcon(array $icons)
    {
        $iconCounts = array_count_values($icons);
        arsort($iconCounts);
        $mostCommonIcon = key($iconCounts);
        
        return "https://openweathermap.org/img/wn/{$mostCommonIcon}@2x.png";
    }

    private function getMostCommonCondition(array $conditions)
    {
        $conditionCounts = array_count_values($conditions);
        arsort($conditionCounts);
        return key($conditionCounts);
    }
}
