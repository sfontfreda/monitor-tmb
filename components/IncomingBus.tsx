import { getBusColor } from '@/lib/routeColors';
import { useState, useEffect } from 'react';

type Props = {
  routeName: string
  destination: string
  arrivalTime: number
};

const getMinutesUntil = (timestamp: string | number): number => {
  let ts = typeof timestamp === 'string' ? parseInt(timestamp, 10) : timestamp;

  if (ts < 1e12) ts = ts * 1000;

  const now = Date.now();
  const diff = ts - now;
  const minutes = Math.floor(diff / 1000 / 60);

  return minutes;
};

const minutesToProgress = (minutes: number, max = 30): number => {
  const clamped = Math.min(Math.max(minutes, 0), max);
  return Math.round(((max - clamped) / max) * 100);
};

const getRouteStyle = (routeName: string) => {
  const { bg, text } = getBusColor(routeName);

  return {
    backgroundColor: bg,
    color: text,
  };
};

const getColorByTime = (minutes: number) => {
  if (minutes <= 2) return 'from-red-500 to-red-600';
  if (minutes <= 5) return 'from-orange-500 to-orange-600';
  if (minutes <= 10) return 'from-yellow-500 to-yellow-600';
  return 'from-green-500 to-green-600';
};

const getProgressBarColor = (minutes: number) => {
  if (minutes <= 2) return 'bg-red-500';
  if (minutes <= 5) return 'bg-orange-500';
  if (minutes <= 10) return 'bg-yellow-500';
  return 'bg-green-500';
};

export default function IncomingBus({ routeName, destination, arrivalTime }: Props) {
  const [minutes, setMinutes] = useState(getMinutesUntil(arrivalTime));

  useEffect(() => {
    setMinutes(getMinutesUntil(arrivalTime));

    const interval = setInterval(() => {
      setMinutes(getMinutesUntil(arrivalTime));
    }, 1000);

    return () => clearInterval(interval);
  }, [arrivalTime]);

  if (minutes < -1) return null;

  const progress = minutesToProgress(minutes);
  const bgColor = getColorByTime(minutes);
  const progressColor = getProgressBarColor(minutes);

  return (
    <div className="relative w-full h-20 rounded-xl overflow-hidden shadow-lg">
      <div className="absolute inset-0">
        <div
          className={`h-full ${progressColor} transition-all duration-1000 ease-linear`}
          style={{ width: `${progress}%` }}
        />
      </div>

      <div className={`absolute inset-0 bg-linear-to-r ${bgColor} opacity-90`}>
        <div className="h-full px-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div style={getRouteStyle(routeName)} 
              className="border-2 border-white rounded-lg px-4 py-2 min-w-17.5 flex items-center justify-center">
              <span className="text-2xl font-bold">
                {routeName}
              </span>
            </div>
            
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-white/80" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
              <span className="text-xl font-semibold text-white drop-shadow-md">
                {destination}
              </span>
            </div>
          </div>

          <div className="text-right">
              {minutes > 0 ?             
                <div className="text-5xl font-bold text-white drop-shadow-lg">
                  {minutes} 
                </div> 
                : 
                <div className="text-3xl font-bold text-white drop-shadow-lg">
                Arribant
                </div>}
                
            <div className="text-sm text-white/80 font-medium -mt-1">
              {minutes > 0 ? 'min' : ''}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
