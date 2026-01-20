type Props = {
  routeName: string
  destination: string
  arrivalTime: number
};

const getMinutesUntil = (timestamp: string | number): string => {
  let ts = typeof timestamp === 'string' ? parseInt(timestamp, 10) : timestamp;

  if (ts < 1e12) ts = ts * 1000;

  const now = Date.now();
  const diff = ts - now;
  const minutes = Math.floor(diff / 1000 / 60);

  return minutes > 0 ? `${minutes} min` : 'Arribant';
};

export default function IncomingBus({ routeName, destination, arrivalTime }: Props) {

  return (
    <div className="p-4 border rounded-md shadow-sm mb-2 flex justify-between items-center">
      <div>
        <h3 className="font-bold">{routeName}</h3>
        <p className="text-sm text-gray-600">{destination}</p>
      </div>

      <span className="text-lg font-semibold">
        {getMinutesUntil(arrivalTime)}
      </span>
    </div>
    );
}
