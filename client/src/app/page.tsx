import SearchContainer from "./components/searchContainer";
import Header from "./components/header";
import WeatherSidebar from "./weather/sidebar";
import Forecast from "./weather/forecast";
import WeatherStats from "./weather/stats";
import Footer from "./components/footer";

export default function Home() {
  return (
    <div className="min-h-screen bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-sky-100 via-blue-200 to-cyan-100">
      <Header />

      <main className="px-4 md:px-6 py-4 max-w-6xl mx-auto space-y-6">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Sidebar on the left */}
          <div className="lg:w-1/3 w-full">
            <WeatherSidebar />
          </div>

          {/* Main content stack */}
          <div className="flex flex-col gap-6 flex-1">
            <SearchContainer />
            <Forecast />
            <WeatherStats />
            
          </div>
        </div>
      </main>
      <Footer/>
    </div>
  );
}
