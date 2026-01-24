import type { SavedStop } from '@/lib/types';

type Props = {
  savedStops: SavedStop[];
  setSavedStops: (stops: SavedStop[]) => void;
  loading: boolean;
  onSave: () => void;
  hasValidStops: () => boolean;
};

export default function ConfigMenu({
  savedStops,
  setSavedStops,
  loading,
  onSave,
  hasValidStops
}: Props) {
  const handleChange = (index: number, value: string) => {
    const newStops = [...savedStops];
    newStops[index].code = value;
    setSavedStops(newStops);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && hasValidStops()) {
      onSave();
    }
  };

  return (
    <div className="w-200 h-120 bg-linear-to-br from-slate-900 to-slate-800 flex items-center justify-center p-6">
      <div className="w-full max-w-2xl">
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold text-white mb-1">
            Configuració de parades
          </h1>
          <p className="text-sm text-slate-400">
            Afegeix fins a 3 codis de parada
          </p>
        </div>
        <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-2xl shadow-2xl p-6">
          
          <div className="grid grid-cols-3 gap-4 mb-6">
            {[0, 1, 2].map((index) => (
              <div key={index} className="space-y-2">
                <label className="block font-semibold text-slate-300">
                  Parada {index + 1}
                  {index > 0 && <span className="text-slate-500 font-normal"> (opcional)</span>}
                </label>

                <div className="relative">
                  <input
                    type="number"
                    value={savedStops[index].code}
                    onChange={(e) => handleChange(index, e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Codi"
                    className="w-full h-16 bg-slate-700/50 border-2 border-slate-600 rounded-xl px-4 text-xl font-semibold text-white text-center placeholder-slate-500 appearance-none [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none focus:outline-none focus:border-red-500 focus:bg-slate-700 transition-all"
                  />
                  
                  {savedStops[index].code && savedStops[index].name && (
                    <div className="absolute -top-1 -right-1">
                      <div className="bg-red-500 rounded-full p-1 shadow-lg">
                        <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          <button
            onClick={onSave}
            disabled={loading || !hasValidStops()}
            className={`w-full h-14 rounded-xl text-lg font-bold transition-all ${
              loading || !hasValidStops()
                ? 'bg-slate-700 text-slate-500 cursor-not-allowed'
                : 'bg-linear-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white shadow-lg shadow-red-500/30 hover:shadow-xl hover:shadow-red-500/40'
            }`}
          >
            {loading ? (
              <div className="flex items-center justify-center gap-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Carregant...
              </div>
            ) : (
              'Guardar parades'
            )}
          </button>
        </div>
        <div className="mt-4 text-center text text-slate-500">
          {`El codi de parada es troba a les marquesines, a l'aplicació o la pàgina web de TMB.`}
        </div>
      </div>
    </div>
  );
}