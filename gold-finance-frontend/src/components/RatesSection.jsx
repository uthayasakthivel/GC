export default function RatesSection({ rates }) {
  return (
    <div className="flex flex-col md:flex-row justify-between items-center bg-gradient-to-r from-slate-50 to-slate-200 border border-slate-300 p-8 rounded-xl mb-10 shadow-sm">
      <div>
        <h2 className="font-bold text-xl mb-3 text-slate-800 tracking-wide">
          Today Rates
        </h2>
        <div className="mb-1">
          22kt Gold:{" "}
          <span className="font-semibold text-amber-700">{rates.gold22}</span>
        </div>
        <div className="mb-1">
          24kt Gold:{" "}
          <span className="font-semibold text-amber-700">{rates.gold24}</span>
        </div>
        <div>
          Silver:{" "}
          <span className="font-semibold text-amber-700">{rates.silver}</span>
        </div>
      </div>
      <div className="mt-8 md:mt-0">
        <h2 className="font-bold text-xl mb-3 text-slate-800 tracking-wide">
          Our Buying Rates
        </h2>
        <div className="mb-1">
          22kt Gold:{" "}
          <span className="font-semibold text-amber-700">{rates.gold22}</span>
        </div>
        <div className="mb-1">
          24kt Gold:{" "}
          <span className="font-semibold text-amber-700">{rates.gold24}</span>
        </div>
        <div>
          Silver:{" "}
          <span className="font-semibold text-amber-700">{rates.silver}</span>
        </div>
      </div>
    </div>
  );
}
