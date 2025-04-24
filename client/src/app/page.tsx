import Image from "next/image";
import SearchContainer from "./components/searchContainer";
import Header from "./components/header";
import WeatherSidebar from "./weather/sidebar";
import Forecast from "./weather/forecast";
import WeatherStats from "./weather/stats";

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
       <Header /> 

      {/* Main Content Section */}
      <main className="flex flex-col lg:flex-row justify-center items-start gap-6 px-6 sm:px-12 mt-6">
        
        {/* Sidebar: Current Weather Details */}
        <div className="bg-white/10 backdrop-blur-md rounded-xl border border-white/20 p-4 shadow-md text-white">
          <WeatherSidebar />
        </div>

        {/* Right Section */}
        <div className="flex-1 space-y-6">
          
          {/* Search Box */}
          <div className="bg-white/10 backdrop-blur-md rounded-xl border border-white/20 p-4 shadow-md text-white">
            <SearchContainer />
          </div>

          {/* 3-Day Forecast */}
          <div className="bg-white/10 backdrop-blur-md rounded-xl border border-white/20 p-4 shadow-md text-white">
            <Forecast />
          </div>

          {/* Weather Stats (Wind + Humidity) */}
          {/* <div className="grid grid-cols-1 md:grid-cols-2 gap-4"> */}
            <div className="bg-white p-4 rounded-xl shadow-md">
              <WeatherStats  />
            
           
          </div>
          
        </div>
      </main>
    </div>
  );
}
