'use client';

import { useState, useMemo } from 'react';
import IncomingBus from "@/components/IncomingBus";

type BusInfo = {
  nom_linia: string;
  desti: string;
  temps_arribada: number;
};

type IncomingBusesTimestamp = {
  temps_arribada: number;
};

type StopRoutes = {
  nom_linia: string;
  desti_trajecte: string;
  propers_busos?: IncomingBusesTimestamp[];
};

type Stop = {
  linies_trajectes: StopRoutes[];
};

type APIResponse = {
  parades?: Stop[];
  error?: string;
};


export default function Home() {
  const [data, setData] = useState<APIResponse | null>(null);
  const [stopCode, setStopCode] = useState('');
  const [loading, setLoading] = useState(false);

  const getBusStopData = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/tmb/bus?stop=${stopCode}`);
      const json = await response.json();
      setData(json);
    } catch (error) {
      console.error('Error:', error);
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

  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
      <h1>Monitor TMB</h1>

      <div style={{ marginBottom: '30px' }}>
        <input
          type="number"
          value={stopCode}
          onChange={(e) => setStopCode(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Codi de parada (ex: 503)"
          className="border border-gray-300 p-2 rounded-md mr-2 appearance-none [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
        />

        <button
          onClick={getBusStopData}
          disabled={loading || stopCode.length === 0}
          className={
            loading || stopCode.length === 0
              ? 'px-4 py-2 rounded-md bg-gray-200 text-gray-400 cursor-not-allowed'
              : 'px-4 py-2 rounded-md bg-blue-400 hover:bg-blue-500 cursor-pointer'
          }
        >
          {loading ? 'Carregant...' : 'Buscar'}
        </button>
      </div>

      <div>
        {allBuses.map((bus) => (
          <IncomingBus
            key={`${bus.nom_linia}-${bus.temps_arribada}`}
            routeName={bus.nom_linia}
            destination={bus.desti}
            arrivalTime={bus.temps_arribada}
          />
        ))}
      </div>

      {data?.error && (
        <div>
          {data.error}
        </div>
      )}
    </div>
  );
}
