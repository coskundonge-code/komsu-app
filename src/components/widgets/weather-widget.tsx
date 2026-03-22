'use client'

import { Sun, Cloud, CloudRain, CloudDrizzle } from 'lucide-react'
import { useCurrentUser } from '@/lib/hooks/use-auth'

interface WeatherDay {
  date: string
  condition: string
  high: number
  low: number
  icon: 'sun' | 'cloud' | 'rain' | 'drizzle'
}

const weatherData = {
  current: {
    location: 'İstanbul, Kadıköy',
    condition: 'Kısmen Bulutlu',
    temperature: 18,
    humidity: 65,
    windSpeed: 12,
    icon: 'cloud' as const,
  },
  forecast: [
    {
      date: 'Bugün',
      condition: 'Kısmen Bulutlu',
      high: 20,
      low: 15,
      icon: 'cloud' as const,
    },
    {
      date: 'Yarın',
      condition: 'Güneşli',
      high: 22,
      low: 16,
      icon: 'sun' as const,
    },
    {
      date: 'Sal',
      condition: 'Yağmurlu',
      high: 18,
      low: 12,
      icon: 'rain' as const,
    },
    {
      date: 'Çar',
      condition: 'Hafif Yağış',
      high: 17,
      low: 11,
      icon: 'drizzle' as const,
    },
  ] as WeatherDay[],
}

const WeatherIcon = ({ icon }: { icon: string }) => {
  const iconProps = { className: 'w-8 h-8 text-text-secondary' }
  switch (icon) {
    case 'sun':
      return <Sun {...iconProps} className="w-8 h-8 text-yellow-500" />
    case 'cloud':
      return <Cloud {...iconProps} />
    case 'rain':
      return <CloudRain {...iconProps} className="w-8 h-8 text-blue-500" />
    case 'drizzle':
      return <CloudDrizzle {...iconProps} className="w-8 h-8 text-blue-400" />
    default:
      return <Cloud {...iconProps} />
  }
}

export function WeatherWidget() {
  const { user } = useCurrentUser()
  const metadata = user?.user_metadata
  const dynamicLocation = metadata?.il && metadata?.ilce
    ? `${metadata.il}, ${metadata.ilce}`
    : weatherData.current.location
  return (
    <div className="bg-surface rounded-lg shadow-sm border border-border overflow-hidden">
      <div className="p-4">
        <p className="text-sm font-semibold text-text-primary mb-4 flex items-center gap-2">
          <Sun className="w-4 h-4 text-primary" />
          Mahalle Hava Durumu
        </p>
        <div className="space-y-3">
          {/* Location & Temp */}
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[13px] font-medium text-text-primary">{dynamicLocation}</p>
              <p className="text-[12px] text-text-muted">{weatherData.current.condition}</p>
            </div>
            <div className="flex items-center">
              <WeatherIcon icon={weatherData.current.icon} />
              <p className="text-xl font-bold text-text-primary ml-1">{weatherData.current.temperature}°</p>
            </div>
          </div>

          {/* Weather Details */}
          <div className="grid grid-cols-2 gap-2 pt-2 border-t border-border">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 text-text-muted flex items-center justify-center">💧</div>
              <div>
                <p className="text-[10px] text-text-muted">Nem</p>
                <p className="text-xs font-medium text-text-primary">{weatherData.current.humidity}%</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 text-text-muted flex items-center justify-center">💨</div>
              <div>
                <p className="text-[10px] text-text-muted">Rüzgar</p>
                <p className="text-xs font-medium text-text-primary">{weatherData.current.windSpeed} km/h</p>
              </div>
            </div>
          </div>

          {/* 3-Day Forecast */}
          <div className="pt-3 border-t border-border">
            <p className="text-[10px] text-text-muted font-semibold mb-2">3 Günlük Tahmini</p>
            <div className="grid grid-cols-3 gap-2">
              {weatherData.forecast.map((day, idx) => (
                <div key={idx} className="bg-background rounded-lg p-2 text-center">
                  <p className="text-[10px] text-text-muted font-medium mb-1">{day.date}</p>
                  <div className="flex justify-center mb-1">
                    <WeatherIcon icon={day.icon} />
                  </div>
                  <div className="text-[9px] text-text-primary">
                    <span className="font-semibold">{day.high}°</span>
                    <span className="text-text-muted">/{day.low}°</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Credit */}
          <p className="text-[10px] text-text-muted pt-2 border-t border-border">
            Powered by OpenWeather
          </p>
        </div>
      </div>
    </div>
  )
}
