import type { SavedStop, APIResponse } from './types';

export async function fetchBusStops(
  validStops: SavedStop[],
  allStops: SavedStop[]
) {
  const promises = validStops.map(stop =>
    fetch(`/api/tmb/bus?stop=${stop.code}`).then(res => res.json())
  );
  const results = await Promise.all(promises);

  const updatedStops = [...allStops];

  results.forEach((result, index) => {
    const stopIndex = allStops.findIndex(s => s.code === validStops[index].code);

    if (stopIndex !== -1) {
      if (result.parades?.[0]?.nom_parada) {
        updatedStops[stopIndex].name = result.parades[0].nom_parada;
      } else {
        updatedStops[stopIndex].name = '';
      }
    }
  });

  const allBuses = results.flatMap(
    result => result.parades?.[0]?.linies_trajectes || []
  );

  const busData: APIResponse = {
    parades: [{
      linies_trajectes: allBuses,
      nom_parada: '',
      codi_parada: ''
    }]
  };

  return { updatedStops, busData };
}