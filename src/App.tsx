import { useState, useEffect, useCallback, type FormEvent, type ReactNode, type MouseEvent } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  MapPin, 
  Search, 
  Sun, 
  Cloud, 
  CloudRain, 
  Wind, 
  Droplets, 
  SunMedium, 
  Sunset, 
  Sunrise, 
  ChevronRight, 
  Plus,
  X,
  Loader2,
  Calendar,
  Home,
  List,
  Thermometer,
  Activity
} from 'lucide-react';
import { getWeatherData, type WeatherData } from './services/weatherService';
import { cn } from './lib/utils';

type Tab = 'inicio' | 'pronostico' | 'ubicaciones';

export default function App() {
  const [activeTab, setActiveTab] = useState<Tab>('inicio');
  const [location, setLocation] = useState<string | null>(null);
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());
  const [searchQuery, setSearchQuery] = useState('');
  const [savedLocations, setSavedLocations] = useState([
    { name: 'San Francisco', temp: 20, condition: 'Soleado' },
    { name: 'New York', temp: 11, condition: 'Nublado' },
    { name: 'London', temp: 9, condition: 'Lluvia Ligera' },
  ]);

  const fetchWeather = useCallback(async (loc: string) => {
    setLoading(true);
    try {
      const data = await getWeatherData(loc);
      setWeather(data);
      setLastUpdated(new Date());
    } catch (error) {
      console.error("Error fetching weather:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    // Intentar obtener geolocalización al inicio
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setLocation(`${latitude}, ${longitude}`);
        },
        (error) => {
          console.warn("Error de geolocalización:", error.message);
          setLocation('San Francisco, CA'); // Ubicación por defecto si falla
        }
      );
    } else {
      setLocation('San Francisco, CA');
    }
  }, []);

  useEffect(() => {
    if (location) {
      fetchWeather(location);
    }
  }, [location, fetchWeather]);

  // Actualización automática cada 5 minutos para mantener datos en tiempo real
  useEffect(() => {
    if (!location) return;

    const intervalId = setInterval(() => {
      fetchWeather(location);
    }, 300000); // 300,000 ms = 5 minutos

    return () => clearInterval(intervalId);
  }, [location, fetchWeather]);

  const handleSearch = (e: FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setLocation(searchQuery);
      setSearchQuery('');
      setActiveTab('inicio');
    }
  };

  const handleAddLocation = async () => {
    const query = searchQuery.trim() || (weather?.location);
    if (!query) return;
    
    // Evitar duplicados simples
    if (savedLocations.some(loc => loc.name.toLowerCase() === query.toLowerCase())) {
      setSearchQuery('');
      return;
    }

    setLoading(true);
    try {
      const data = await getWeatherData(query);
      setSavedLocations(prev => [
        { 
          name: data.location, 
          temp: data.current.temp, 
          condition: data.current.condition 
        },
        ...prev
      ]);
      setSearchQuery('');
    } catch (error) {
      console.error("Error al añadir ubicación:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveLocation = (e: MouseEvent, index: number) => {
    e.stopPropagation();
    setSavedLocations(prev => prev.filter((_, i) => i !== index));
  };

  const getWeatherIcon = (condition: string) => {
    const c = condition.toLowerCase();
    if (c.includes('sol') || c.includes('despejado')) return <Sun className="w-6 h-6 text-yellow-400" />;
    if (c.includes('lluvia') || c.includes('chubasco')) return <CloudRain className="w-6 h-6 text-blue-400" />;
    if (c.includes('nub') || c.includes('cubierto')) return <Cloud className="w-6 h-6 text-gray-400" />;
    return <SunMedium className="w-6 h-6 text-yellow-200" />;
  };

  if (loading && !weather) {
    return (
      <div className="min-h-screen bg-[#0a0f1e] flex items-center justify-center text-white">
        <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0f1e] text-white font-sans selection:bg-blue-500/30 pb-32">
      {/* Header */}
      <header className="p-6 pt-[calc(1.5rem+var(--safe-area-top))] flex items-center justify-between sticky top-0 bg-[#0a0f1e]/80 backdrop-blur-md z-50">
        <div className="flex items-center gap-2">
          <MapPin className="w-5 h-5 text-blue-400" />
          <div className="flex flex-col">
            <h1 className="text-lg font-semibold truncate max-w-[200px]">
              {weather?.location || location}
            </h1>
            <span className="text-[10px] opacity-40 uppercase tracking-widest">
              Actualizado: {lastUpdated.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </span>
          </div>
        </div>
        <button 
          onClick={() => setActiveTab('ubicaciones')}
          className="p-2 hover:bg-white/10 rounded-full transition-colors"
        >
          <Search className="w-5 h-5" />
        </button>
      </header>

      <main className="pb-24 px-4 max-w-md mx-auto">
        <AnimatePresence mode="wait">
          {activeTab === 'inicio' && weather && (
            <motion.div
              key="inicio"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-8"
            >
              {/* Hero Section */}
              <section className="relative h-[400px] rounded-3xl overflow-hidden group">
                <img 
                  src={`https://picsum.photos/seed/${weather.location}/800/1200`} 
                  alt="City" 
                  className="absolute inset-0 w-full h-full object-cover brightness-50 group-hover:scale-105 transition-transform duration-700"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-6">
                  <span className="text-8xl font-light tracking-tighter mb-2">
                    {weather.current.temp}°C
                  </span>
                  <h2 className="text-2xl font-medium uppercase tracking-widest opacity-80">
                    {weather.current.condition}
                  </h2>
                  <div className="mt-8 bg-black/20 backdrop-blur-md px-6 py-3 rounded-full border border-white/10 flex items-center gap-4">
                    <Sun className="w-5 h-5 text-yellow-400" />
                    <span className="text-sm font-medium">
                      MÁX: {weather.current.high}°C MÍN: {weather.current.low}°C
                    </span>
                  </div>
                </div>
              </section>

              {/* Hourly Forecast */}
              <section className="space-y-4">
                <div className="flex justify-between items-end">
                  <h3 className="text-xs font-bold uppercase tracking-widest opacity-50">Próximas 24 Horas</h3>
                  <span className="text-[10px] opacity-30 uppercase tracking-tighter">Hora local de {weather.location}</span>
                </div>
                <div className="flex gap-3 overflow-x-auto pb-4 no-scrollbar">
                  {weather.hourly.map((hour, i) => (
                    <div 
                      key={i}
                      className={cn(
                        "min-w-[90px] p-4 rounded-2xl flex flex-col items-center gap-3 border border-white/5",
                        i === 0 ? "bg-blue-600/20 border-blue-500/30" : "bg-white/5"
                      )}
                    >
                      <span className="text-xs font-bold uppercase tracking-tighter opacity-60">
                        {i === 0 ? 'Ahora' : hour.time}
                      </span>
                      {getWeatherIcon(hour.condition)}
                      <span className="text-lg font-semibold">{hour.temp}°C</span>
                    </div>
                  ))}
                </div>
              </section>

              {/* Details Grid */}
              <section className="grid grid-cols-2 gap-4">
                <DetailCard 
                  icon={<Droplets className="w-4 h-4 text-blue-400" />}
                  label="HUMEDAD"
                  value={weather.current.humidity}
                  desc="El punto de rocío es 11°C ahora."
                />
                <DetailCard 
                  icon={<SunMedium className="w-4 h-4 text-yellow-400" />}
                  label="ÍNDICE UV"
                  value={weather.current.uvIndex}
                  desc="Use protección solar hasta las 4 PM."
                />
                <DetailCard 
                  icon={<Wind className="w-4 h-4 text-gray-400" />}
                  label="VIENTO"
                  value={weather.current.wind}
                  desc="Constante desde el noroeste."
                />
                <DetailCard 
                  icon={<Sunset className="w-4 h-4 text-orange-400" />}
                  label="PUESTA DE SOL"
                  value={weather.current.sunset}
                  desc={`Amanecer: ${weather.current.sunrise}`}
                />
              </section>

              {/* Sensación Térmica Section */}
              <section className="bg-gradient-to-br from-blue-600/10 to-purple-600/10 border border-white/10 rounded-3xl p-8 flex flex-col items-center justify-center text-center space-y-4">
                <div className="bg-white/10 p-4 rounded-2xl">
                  <Thermometer className="w-8 h-8 text-blue-400" />
                </div>
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-widest opacity-50 mb-1">Sensación Térmica</h3>
                  <p className="text-6xl font-light tracking-tighter">{weather.current.feelsLike}°C</p>
                </div>
                <p className="text-sm opacity-60 max-w-[200px]">
                  {weather.current.feelsLike > weather.current.temp 
                    ? "Se siente más cálido que la temperatura real." 
                    : weather.current.feelsLike < weather.current.temp 
                    ? "Se siente más fresco que la temperatura real." 
                    : "Coincide con la temperatura real."}
                </p>
              </section>

              {/* Air Quality Section */}
              <section className="bg-white/5 border border-white/10 rounded-3xl p-6 space-y-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Activity className="w-5 h-5 text-green-400" />
                    <h3 className="text-xs font-bold uppercase tracking-widest opacity-50">Calidad del Aire</h3>
                  </div>
                  <span className={cn(
                    "px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest",
                    weather.airQuality.aqi <= 50 ? "bg-green-500/20 text-green-400" :
                    weather.airQuality.aqi <= 100 ? "bg-yellow-500/20 text-yellow-400" :
                    "bg-red-500/20 text-red-400"
                  )}>
                    {weather.airQuality.level}
                  </span>
                </div>

                <div className="flex flex-col items-center justify-center py-4">
                  <span className="text-7xl font-light tracking-tighter">{weather.airQuality.aqi}</span>
                  <span className="text-[10px] font-bold uppercase tracking-widest opacity-40 mt-2">Índice AQI</span>
                </div>

                <div className="grid grid-cols-3 gap-4 pt-4 border-t border-white/5">
                  <PollutantItem label="PM2.5" value={weather.airQuality.pollutants.pm25} />
                  <PollutantItem label="PM10" value={weather.airQuality.pollutants.pm10} />
                  <PollutantItem label="O3" value={weather.airQuality.pollutants.o3} />
                  <PollutantItem label="NO2" value={weather.airQuality.pollutants.no2} />
                  <PollutantItem label="SO2" value={weather.airQuality.pollutants.so2} />
                  <PollutantItem label="CO" value={weather.airQuality.pollutants.co} />
                </div>
              </section>

            </motion.div>
          )}

          {activeTab === 'pronostico' && weather && (
            <motion.div
              key="pronostico"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-8"
            >
              <div className="flex flex-col gap-2">
                <div className="flex justify-between items-center">
                  <h2 className="text-5xl font-bold tracking-tight">Pronóstico</h2>
                  <div className="text-right">
                    <span className="text-4xl font-light">{weather.current.temp}°C</span>
                    <p className="text-[10px] uppercase font-bold opacity-40 tracking-widest">Actual</p>
                  </div>
                </div>
                <p className="text-sm opacity-60">Próximos 10 días en {weather.location}</p>
              </div>

              <div className="space-y-3">
                {weather.daily.map((day, i) => (
                  <div 
                    key={i}
                    className="bg-white/5 border border-white/5 p-5 rounded-2xl flex items-center justify-between group hover:bg-white/10 transition-colors cursor-pointer"
                  >
                    <div className="flex items-center gap-4 w-24">
                      <span className="font-bold text-lg">{i === 0 ? 'Hoy' : day.day}</span>
                    </div>
                    <div className="flex flex-col items-center gap-1">
                      {getWeatherIcon(day.condition)}
                      <span className="text-[10px] font-bold text-blue-400">{day.rainChance}</span>
                    </div>
                    <div className="flex items-center gap-6">
                      <span className="text-xl font-semibold">{day.tempMax}°C</span>
                      <span className="text-xl font-semibold opacity-40">{day.tempMin}°C</span>
                      <ChevronRight className="w-4 h-4 opacity-20 group-hover:opacity-100 transition-opacity" />
                    </div>
                  </div>
                ))}
              </div>

              <div className="bg-blue-600/10 border border-blue-500/20 p-6 rounded-3xl space-y-2">
                <h4 className="text-xs font-bold uppercase tracking-widest opacity-60">Análisis del Clima</h4>
                <p className="text-sm leading-relaxed">
                  Se espera mayor humedad el próximo fin de semana con un descenso gradual de las temperaturas.
                </p>
              </div>
            </motion.div>
          )}

          {activeTab === 'ubicaciones' && (
            <motion.div
              key="ubicaciones"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="space-y-8"
            >
              <div className="space-y-2">
                <h2 className="text-5xl font-bold tracking-tight">Gestionar Ubicaciones</h2>
                <p className="text-sm opacity-60">Personaliza tu feed del clima añadiendo ciudades</p>
              </div>

              <form onSubmit={handleSearch} className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 opacity-30" />
                <input 
                  type="text" 
                  placeholder="Buscar una ciudad"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
                />
              </form>

              <div className="space-y-4">
                {savedLocations.map((loc, i) => (
                  <div key={i} className="relative group">
                    <button
                      onClick={() => {
                        setLocation(loc.name);
                        setActiveTab('inicio');
                      }}
                      className="w-full bg-white/5 border border-white/5 p-6 rounded-3xl flex items-center justify-between hover:bg-white/10 transition-all text-left"
                    >
                      <div>
                        <h3 className="text-2xl font-bold">{loc.name}</h3>
                        <p className="text-sm opacity-60 uppercase tracking-widest mt-1">{loc.condition}</p>
                      </div>
                      <div className="flex items-center gap-6">
                        {getWeatherIcon(loc.condition)}
                        <span className="text-5xl font-light tracking-tighter">{loc.temp}°</span>
                      </div>
                    </button>
                    <button 
                      onClick={(e) => handleRemoveLocation(e, i)}
                      className="absolute -top-2 -right-2 w-8 h-8 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-lg hover:bg-red-600"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>

              <button 
                onClick={handleAddLocation}
                disabled={loading}
                className="w-16 h-16 bg-white text-black rounded-full flex items-center justify-center shadow-xl shadow-white/10 mx-auto hover:scale-110 active:scale-95 transition-all disabled:opacity-50 disabled:hover:scale-100"
              >
                {loading ? <Loader2 className="w-8 h-8 animate-spin" /> : <Plus className="w-8 h-8" />}
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 p-4 pb-[calc(1rem+var(--safe-area-bottom))] bg-[#0a0f1e]/80 backdrop-blur-xl border-t border-white/5 z-50">
        <div className="max-w-md mx-auto flex items-center justify-around">
          <NavButton 
            active={activeTab === 'inicio'} 
            onClick={() => setActiveTab('inicio')}
            icon={<Home className="w-5 h-5" />}
            label="INICIO"
          />
          <NavButton 
            active={activeTab === 'pronostico'} 
            onClick={() => setActiveTab('pronostico')}
            icon={<Calendar className="w-5 h-5" />}
            label="PRONÓSTICO"
          />
          <NavButton 
            active={activeTab === 'ubicaciones'} 
            onClick={() => setActiveTab('ubicaciones')}
            icon={<List className="w-5 h-5" />}
            label="UBICACIONES"
          />
        </div>
      </nav>
    </div>
  );
}

function DetailCard({ icon, label, value, desc }: { icon: ReactNode, label: string, value: string, desc: string }) {
  return (
    <div className="bg-white/5 border border-white/5 p-5 rounded-3xl space-y-4">
      <div className="flex items-center gap-2 opacity-60">
        {icon}
        <span className="text-[10px] font-bold uppercase tracking-widest">{label}</span>
      </div>
      <div className="space-y-1">
        <p className="text-2xl font-semibold">{value}</p>
        <p className="text-[10px] leading-relaxed opacity-40">{desc}</p>
      </div>
    </div>
  );
}

function PollutantItem({ label, value }: { label: string, value: string }) {
  return (
    <div className="flex flex-col items-center gap-1">
      <span className="text-[9px] font-bold opacity-40 uppercase">{label}</span>
      <span className="text-sm font-medium">{value}</span>
    </div>
  );
}

function NavButton({ active, onClick, icon, label }: { active: boolean, onClick: () => void, icon: ReactNode, label: string }) {
  return (
    <button 
      onClick={onClick}
      className={cn(
        "flex flex-col items-center gap-1.5 px-6 py-2 rounded-2xl transition-all",
        active ? "bg-white/10 text-white" : "text-white/40 hover:text-white/60"
      )}
    >
      {icon}
      <span className="text-[9px] font-bold tracking-widest uppercase">{label}</span>
    </button>
  );
}
