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

  return (
    <div className="relative w-full h-20 rounded-xl overflow-hidden shadow-lg">
      <div className="absolute inset-0 bg-slate-700/50">
        <div
          className={`h-full bg-red-700 transition-all duration-1000 ease-linear`}
          style={{ width: `${progress}%` }}
        />
      </div>

      <div className={`absolute inset-0 bg-linear-to-r from-red-500  opacity-90`}>
        <div className="h-full px-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="bg-white/20 backdrop-blur-sm border-2 border-white/40 rounded-lg px-4 py-2 min-w-17.5 flex items-center justify-center">
              <span className="text-2xl font-bold text-white">
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
