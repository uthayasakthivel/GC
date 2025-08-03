export default function BalanceSection({ balance }) {
  const cash = balance?.cash ?? 0;
  const goldGrams = balance?.goldGrams ?? 0;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-10 bg-gradient-to-br from-white to-slate-100 border border-slate-200 p-8 rounded-xl shadow">
      <div>
        <div className="mb-5 flex items-center">
          <span className="font-semibold w-44 text-slate-700">
            Opening Balance:
          </span>
          <span className="text-slate-900 ml-2">₹{cash.toLocaleString()}</span>
        </div>
        <div className="mb-5 flex items-center">
          <span className="font-semibold w-44 text-slate-700">
            Opening Cash:
          </span>
          <span className="text-slate-900 ml-2">₹{cash.toLocaleString()}</span>
        </div>
        <div className="flex items-center">
          <span className="font-semibold w-44 text-slate-700">
            Opening Gold:
          </span>
          <span className="text-slate-900 ml-2">{goldGrams} gm</span>
        </div>
      </div>
      <div>
        {/* Placeholder for future: closing balance, etc */}
        <div className="mb-5 flex items-center">
          <span className="font-semibold w-44 text-slate-700">
            Closing Balance:
          </span>
          <span className="text-slate-900 ml-2">₹0.00</span>
        </div>
        <div className="mb-5 flex items-center">
          <span className="font-semibold w-44 text-slate-700">
            Closing Cash:
          </span>
          <span className="text-slate-900 ml-2">₹0.00</span>
        </div>
        <div className="mb-5 flex items-center">
          <span className="font-semibold w-44 text-slate-700">
            Closing Gold:
          </span>
          <span className="text-slate-900 ml-2">0 gm</span>
        </div>
        <div className="mb-5 flex items-center">
          <span className="font-semibold w-44 text-slate-700">
            Outstanding Balance:
          </span>
          <span className="text-slate-900 ml-2">₹0.00</span>
        </div>
        <div className="flex items-center">
          <span className="font-semibold w-44 text-slate-700">Cash:</span>
          <span className="text-slate-900 ml-2">₹0.00</span>
        </div>
      </div>
    </div>
  );
}
