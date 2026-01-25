// data from GTFS (https://developer.tmb.cat/data/gtfs)

const ROUTE_COLORS = {

    D: { bg: '#93107E', text: '#FFFFFF' },
    H: { bg: '#003888', text: '#FFFFFF' },
    V: { bg: '#6AB023', text: '#FFFFFF' },
    B: { bg: '#F0CC3F', text: '#131313' },
    X: { bg: '#010101', text: '#FFFFFF' },
    N: { bg: '#3366cc', text: '#FFFFFF' },
    default: { bg: '#DA291C', text: '#FFFFFF' },

} as const;

type BusPrefix = Exclude<keyof typeof ROUTE_COLORS, 'default'>;
function isBusPrefix(prefix: string): prefix is BusPrefix {
  return prefix in ROUTE_COLORS && prefix !== 'default';
}

export function getBusColor(shortName: string) {
  const prefix = shortName[0];

  if (isBusPrefix(prefix)) {
    return ROUTE_COLORS[prefix];
  }

  return ROUTE_COLORS.default;
}