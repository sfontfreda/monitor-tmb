import { useMemo } from 'react';
import IncomingBus from './IncomingBus';
import Clock from './Clock';
import type { APIResponse, SavedStop, BusInfo, StopRoutes, IncomingBusesTimestamp } from '@/lib/types';
import BusStopsList from './BusStopsList';

type Props = {
  data: APIResponse | null;
  savedStops: SavedStop[];
  onOpenMenu: () => void;
};

export default function ResultsPage({ data, savedStops, onOpenMenu }: Props) {

  const allBuses: BusInfo[] = useMemo(() => {
    if (!data?.parades?.[0]?.linies_trajectes) return [];

    return data.parades[0].linies_trajectes
      .flatMap((linia: StopRoutes) =>
        linia.propers_busos?.map((bus: IncomingBusesTimestamp) => ({
          nom_linia: linia.nom_linia,
          desti: linia.desti_trajecte,
          temps_arribada: bus.temps_arribada,
        })) ?? []
      )
      .sort((a, b) => a.temps_arribada - b.temps_arribada);
  }, [data]);

  const validStops = savedStops.filter(stop => stop.code !== "");
  const hasNoBuses = data && !data.error && allBuses.length === 0;

  return (
    <div onClick={onOpenMenu}
      className="w-200 h-120 bg-linear-to-br from-slate-800 to-slate-900 text-white flex flex-col overflow-hidden">
      <div className="px-6 py-4 flex justify-between items-center border-b border-slate-700">
        <div className="flex gap-3 items-center text-sm">
          <BusStopsList savedStops={validStops} />
        </div>
        <Clock />
      </div>
      <div className="flex-1 overflow-y-auto p-3 space-y-3">
        {allBuses.length > 0 && (
          <>
            {allBuses.slice(0, 4).map((bus, index) => (
              <IncomingBus
                key={`${bus.nom_linia}-${bus.temps_arribada}-${index}`}
                routeName={bus.nom_linia}
                destination={bus.desti}
                arrivalTime={bus.temps_arribada}
              />
            ))}
          </>
        )}

        {hasNoBuses && (
          <div className="h-full flex items-center justify-center">
            <div className="text-center text-slate-400">
              <svg className="w-16 h-16 mx-auto mb-4 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="text-xl">No hi ha busos disponibles</p>
              <p className="text-sm mt-2 text-slate-500">Prem la cantonada vermella per configurar</p>
            </div>
          </div>
        )}

        {data?.error && (
          <div className="bg-red-900/50 border border-red-500 text-red-200 px-4 py-3 rounded-lg">
            {data.error}
          </div>
        )}
      </div>
    </div>
  );
}