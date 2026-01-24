'use client';

import { useState, useEffect } from 'react';
import ConfigMenu from '@/components/ConfigMenu';
import ResultsPage from '@/components/ResultsPage';
import type { SavedStop, APIResponse } from '@/lib/types';
import { fetchBusStops } from '@/lib/api';

export default function Home() {
  const [savedStops, setSavedStops] = useState<SavedStop[]>([
    { code: '', name: '' },
    { code: '', name: '' },
    { code: '', name: '' }
  ]);
  const [data, setData] = useState<APIResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [showMenu, setShowMenu] = useState(true);

  const hasValidStops = () => {
    return savedStops.some(stop => stop.code.trim() !== '');
  };

  const getBusStopData = async () => {
    const validStops = savedStops.filter(stop => stop.code.trim() !== '');
    if (validStops.length === 0) return;

    setLoading(true);
    try {
      const { updatedStops, busData } = await fetchBusStops(validStops, savedStops);
      setSavedStops(updatedStops);
      setData(busData);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (showMenu || !hasValidStops()) return;

    getBusStopData();
    const interval = setInterval(getBusStopData, 30000);
    return () => clearInterval(interval);
  }, [showMenu]);

  useEffect(() => {
    if (!hasValidStops()) {
      setShowMenu(true);
    }
  }, []);

  return showMenu ? (
    <ConfigMenu
      savedStops={savedStops}
      setSavedStops={setSavedStops}
      loading={loading}
      onSave={() => {
        getBusStopData();
        setShowMenu(false);
      }}
      hasValidStops={hasValidStops}
    />
  ) : (
    <ResultsPage
      data={data}
      savedStops={savedStops}
      onOpenMenu={() => setShowMenu(true)}
    />
  );
}