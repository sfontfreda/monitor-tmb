'use client';

import { useState, useMemo } from 'react';
import IncomingBus from "@/components/IncomingBus";
import type { APIResponse, BusInfo, StopRoutes, IncomingBusesTimestamp } from "@/lib/types";

export default function Home() {
  const [data, setData] = useState<APIResponse | null>(null);
  const [stopCode, setStopCode] = useState('');
  const [loading, setLoading] = useState(false);

  const getBusStopData = async () => {
    if (!stopCode) return;
    
    setLoading(true);
    try {
      const response = await fetch(`/api/tmb/bus?stop=${stopCode}`);
      const json = await response.json();
      setData(json);
    } catch (error) {
      console.error('Error:', error);
      setData({ error: 'Error al carregar les dades' });
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && stopCode) {
      getBusStopData();
    }
  };

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
      .sort((a: BusInfo, b: BusInfo) => a.temps_arribada - b.temps_arribada);
  }, [data]);

  const hasNoBuses = data && !data.error && allBuses.length === 0;

  return (
    <div className="p-5 max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">Monitor TMB</h1>

      <div className="flex gap-2 mb-8">
        <input
          type="number"
          value={stopCode}
          onChange={(e) => setStopCode(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Codi de parada (ex: 503)"
          className="border border-gray-300 p-2 rounded-md flex-1 appearance-none [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
        />

        <button
          onClick={getBusStopData}
          disabled={loading || !stopCode}
          className={`px-6 py-2 rounded-md font-medium transition-colors ${
            loading || !stopCode
              ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
              : 'bg-blue-500 hover:bg-blue-600 text-white cursor-pointer'
          }`}
        >
          {loading ? 'Carregant...' : 'Buscar'}
        </button>
      </div>

      {allBuses.length > 0 && (
        <div className="space-y-3">
          {allBuses.map((bus, index) => (
            <IncomingBus
              key={`${bus.nom_linia}-${bus.temps_arribada}-${index}`}
              routeName={bus.nom_linia}
              destination={bus.desti}
              arrivalTime={bus.temps_arribada}
            />
          ))}
        </div>
      )}

      {hasNoBuses && (
        <div className="text-center text-gray-500 py-8">
          No hi ha busos disponibles per aquesta parada
        </div>
      )}

      {data?.error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
          {data.error}
        </div>
      )}
    </div>
  );
}
