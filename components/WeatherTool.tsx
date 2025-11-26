import React, { useState, useEffect } from 'react';
import { Search, MapPin, Wind, Droplets, Thermometer, Loader2, Navigation, Sun } from 'lucide-react';
import { fetchWeather } from '../services/geminiService';
import { WeatherData, GroundingChunk } from '../types';
import { getWeatherIcon } from './WeatherIcons';
import { TemperatureChart } from './TemperatureChart';
import { SourceList } from './SourceList';

export const WeatherTool: React.FC = () => {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [sources, setSources] = useState<GroundingChunk[]>([]);
  const [rawText, setRawText] = useState<string>('');
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    setError(null);
    setWeather(null);
    setSources([]);
    setRawText('');

    try {
      const response = await fetchWeather(query);
      if (response.data) {
        setWeather(response.data);
      } else {
        setRawText(response.rawText || "Could not retrieve structured data.");
      }
      setSources(response.groundingMetadata);
    } catch (err: any) {
      setError("Failed to fetch weather. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleGeolocation = () => {
    if (!navigator.geolocation) {
      setError("Geolocation is not supported by your browser");
      return;
    }

    setLoading(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setQuery(`${latitude}, ${longitude}`);
        fetchWeather(`${latitude}, ${longitude}`).then(response => {
           if (response.data) setWeather(response.data);
           else setRawText(response.rawText || "Error parsing.");
           setSources(response.groundingMetadata);
        }).catch(() => {
           setError("Failed to fetch weather for your location.");
        }).finally(() => setLoading(false));
      },
      () => {
        setError("Unable to retrieve your location");
        setLoading(false);
      }
    );
  };

  return (
    <div className="w-full max-w-6xl mx-auto space-y-6 animate-fadeIn">
      <div className="flex items-center gap-3 mb-4">
        <div className="p-3 bg-blue-500/20 rounded-xl text-blue-400">
           <Sun size={24} />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-white">Weather Forecast</h2>
          <p className="text-slate-400 text-sm">Real-time reports grounded in Google Search</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Panel: Search & Current Weather */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-slate-800/50 backdrop-blur-md border border-white/10 rounded-3xl p-6 shadow-xl">
            <form onSubmit={handleSearch} className="relative">
              <input 
                type="text" 
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="City, ZIP, or Coords..."
                className="w-full bg-slate-900/50 border border-slate-700 rounded-xl py-3 pl-10 pr-12 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all placeholder-slate-500 text-white"
              />
              <Search className="absolute left-3 top-3.5 text-slate-400" size={18} />
              <button 
                type="button" 
                onClick={handleGeolocation}
                className="absolute right-3 top-2.5 p-1 hover:bg-white/10 rounded-full transition-colors text-blue-400"
                title="Use my location"
              >
                <Navigation size={18} />
              </button>
            </form>
            <button 
              onClick={() => handleSearch()}
              disabled={loading}
              className="mt-3 w-full bg-blue-600 hover:bg-blue-500 text-white font-medium py-2.5 rounded-xl transition-all shadow-lg shadow-blue-900/20 flex justify-center items-center disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? <Loader2 className="animate-spin" size={20} /> : "Get Forecast"}
            </button>
          </div>

          {weather && (
            <div className="bg-gradient-to-br from-blue-900/40 to-slate-900/40 backdrop-blur-md border border-white/10 rounded-3xl p-8 shadow-xl relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-8 opacity-20 transform group-hover:scale-110 transition-transform duration-700">
                 {getWeatherIcon(weather.current.condition, 120, "text-white")}
              </div>
              
              <div className="relative z-10">
                <div className="flex items-center gap-2 text-slate-300 mb-1">
                  <MapPin size={16} />
                  <span className="text-sm font-medium tracking-wide">{weather.location}</span>
                </div>
                
                <div className="mt-4 mb-6">
                  <div className="flex items-start">
                    <span className="text-7xl font-bold tracking-tighter text-white">
                      {Math.round(weather.current.temp_c)}
                    </span>
                    <span className="text-3xl font-light text-blue-300 mt-2">°C</span>
                  </div>
                  <p className="text-lg text-blue-200 font-medium mt-1">{weather.current.condition}</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-slate-900/30 rounded-xl p-3 flex items-center gap-3">
                    <div className="p-2 bg-blue-500/20 rounded-lg text-blue-300">
                      <Wind size={20} />
                    </div>
                    <div>
                      <p className="text-xs text-slate-400">Wind</p>
                      <p className="font-semibold text-white">{weather.current.wind_kph} <span className="text-xs font-normal">km/h</span></p>
                    </div>
                  </div>
                  <div className="bg-slate-900/30 rounded-xl p-3 flex items-center gap-3">
                    <div className="p-2 bg-cyan-500/20 rounded-lg text-cyan-300">
                      <Droplets size={20} />
                    </div>
                    <div>
                      <p className="text-xs text-slate-400">Humidity</p>
                      <p className="font-semibold text-white">{weather.current.humidity}%</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {error && (
            <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-4 text-red-200 text-center text-sm">
              {error}
            </div>
          )}
        </div>

        {/* Right Panel: Forecast & Details */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          {!weather && !rawText && !loading && (
            <div className="h-full flex flex-col items-center justify-center bg-slate-800/30 backdrop-blur-sm border border-white/5 rounded-3xl p-12 text-center border-dashed">
              <div className="bg-slate-700/50 p-6 rounded-full mb-6">
                <Sun size={48} className="text-slate-500" />
              </div>
              <h2 className="text-xl font-bold text-slate-300 mb-2">No Location Selected</h2>
              <p className="text-slate-500 max-w-sm">
                Enter a city or use your location to see the magic.
              </p>
            </div>
          )}

          {!weather && rawText && (
             <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-3xl p-8">
               <h3 className="text-xl font-bold mb-4 text-white">Weather Report</h3>
               <div className="prose prose-invert max-w-none text-slate-300 whitespace-pre-wrap">
                 {rawText}
               </div>
               <SourceList sources={sources} />
             </div>
          )}

          {weather && (
            <div className="bg-slate-800/50 backdrop-blur-md border border-white/10 rounded-3xl p-8 shadow-xl flex-1">
              <div className="flex justify-between items-end mb-6">
                <h2 className="text-xl font-bold text-white">5-Day Forecast</h2>
              </div>
              
              <div className="space-y-3">
                {weather.forecast.map((day, idx) => (
                  <div key={idx} className="flex items-center justify-between p-4 bg-white/5 hover:bg-white/10 rounded-2xl transition-colors group border border-white/5">
                    <div className="w-24 font-medium text-slate-300">{day.date}</div>
                    
                    <div className="flex items-center gap-3 flex-1 justify-center">
                      <div className="text-blue-300 group-hover:scale-110 transition-transform">
                        {getWeatherIcon(day.condition, 28)}
                      </div>
                      <span className="text-sm text-slate-400 hidden sm:block">{day.condition}</span>
                    </div>

                    <div className="flex items-center gap-4 w-32 justify-end">
                       <span className="text-slate-400 text-sm">{Math.round(day.min_temp_c)}°</span>
                       <div className="w-16 h-1.5 bg-slate-700 rounded-full overflow-hidden relative">
                          <div className="absolute inset-y-0 bg-gradient-to-r from-blue-400 to-orange-400 opacity-80" style={{ left: '10%', right: '10%' }}></div>
                       </div>
                       <span className="font-bold text-white">{Math.round(day.max_temp_c)}°</span>
                    </div>
                  </div>
                ))}
              </div>

              <TemperatureChart forecast={weather.forecast} />
              
              <div className="mt-8 bg-blue-500/10 border border-blue-500/20 rounded-xl p-4">
                <h3 className="text-sm font-semibold text-blue-200 mb-2">AI Summary</h3>
                <p className="text-sm text-slate-300 leading-relaxed">
                  {weather.summary}
                </p>
              </div>

              <SourceList sources={sources} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};