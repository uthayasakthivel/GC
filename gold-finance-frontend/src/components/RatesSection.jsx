import { CurrencyRupeeIcon } from "@heroicons/react/24/solid";

export default function RatesSection({ todayRates, buyingRates }) {
  if (!todayRates && !buyingRates) return <p>Loading rates...</p>;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
      {/* Today's Rates Card */}
      <div className="relative w-full bg-gradient-to-br from-yellow-500 via-orange-500 to-red-500 text-white rounded-2xl p-6 shadow-2xl overflow-hidden transform hover:scale-105 transition-transform duration-300">
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-[url('/images/abs1.jpg')] bg-cover bg-center opacity-10"></div>

        {/* Card Header */}
        <div className="flex justify-between items-center mb-6 relative z-10">
          <h2 className="text-lg font-semibold tracking-wide">Today's Rates</h2>
          <CurrencyRupeeIcon className="h-8 w-8 text-white opacity-80" />
        </div>

        {/* Rate Details */}
        <div className="space-y-3 relative z-10">
          <div className="flex justify-between">
            <span className="text-sm opacity-80">22kt Gold</span>
            <span className="font-bold text-xl">₹{todayRates.gold22k}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm opacity-80">24kt Gold</span>
            <span className="font-medium">₹{todayRates.gold24k}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm opacity-80">Silver</span>
            <span className="font-medium">₹{todayRates.silver}</span>
          </div>
        </div>
      </div>

      {/* Our Buying Rates Card */}
      <div className="relative w-full bg-gradient-to-br from-green-500 via-teal-600 to-cyan-500 text-white rounded-2xl p-6 shadow-2xl overflow-hidden transform hover:scale-105 transition-transform duration-300">
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-[url('/images/abs3.jpg')] bg-cover bg-center opacity-10"></div>

        {/* Card Header */}
        <div className="flex justify-between items-center mb-6 relative z-10">
          <h2 className="text-lg font-semibold tracking-wide">
            Our Buying Rates
          </h2>
          <CurrencyRupeeIcon className="h-8 w-8 text-white opacity-80" />
        </div>

        {/* Rate Details */}
        <div className="space-y-3 relative z-10">
          <div className="flex justify-between">
            <span className="text-sm opacity-80">22kt Gold</span>
            <span className="font-bold text-xl">₹{buyingRates.gold22k916}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm opacity-80">24kt Gold</span>
            <span className="font-medium">₹{buyingRates.gold22k ?? "N/A"}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm opacity-80">Silver</span>
            <span className="font-medium">
              ₹{buyingRates.silverBuy ?? buyingRates.silver}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
