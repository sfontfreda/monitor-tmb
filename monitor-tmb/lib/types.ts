export type BusInfo = {
  nom_linia: string;
  desti: string;
  temps_arribada: number;
};

export type IncomingBusesTimestamp = {
  temps_arribada: number;
};

export type StopRoutes = {
  nom_linia: string;
  desti_trajecte: string;
  propers_busos?: IncomingBusesTimestamp[];
};

export type Stop = {
  linies_trajectes: StopRoutes[];
};

export type APIResponse = {
  parades?: Stop[];
  error?: string;
};