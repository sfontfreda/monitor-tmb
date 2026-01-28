import type { SavedStop } from "@/lib/types";

type Props = {
  savedStops: SavedStop[]
}

export default function BusStopsList({ savedStops }: Props) {

  const validStops = savedStops.filter(stop => stop.code !== "");
  const textSize = validStops.length === 3 ? "text-2xl" : "text-3xl";

  if (validStops.length === 0) return null;

  return (
    <div className="flex w-full flex-wrap gap-x-4">
      {validStops.map((stop, index) => (
        stop.name &&
        <div key={stop.code} className={textSize}>
          <span>
            {stop.name}
          </span>
          <span className="ml-2.5 text-gray-400 font-medium">
            ({stop.code})
          </span>
          {index < validStops.length - 1 &&
            <span className="ml-2.5">|</span>
          }
        </div>
      ))}
    </div>
  );
}