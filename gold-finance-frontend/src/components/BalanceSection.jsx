import { CreditCardIcon } from "@heroicons/react/24/solid";

export default function BalanceSection({ balance, closingBalance }) {
  const cash = balance?.cash ?? 0;
  const goldGrams = balance?.goldGrams ?? 0;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
      {/* Opening Balance Card */}
      <div className="relative w-full bg-gradient-to-br from-indigo-500 via-purple-600 to-pink-500 text-white rounded-2xl p-6 shadow-2xl overflow-hidden transform hover:scale-105 transition-transform duration-300">
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-[url('/images/abs2.jpg')] bg-cover bg-center opacity-10"></div>

        {/* Card Header */}
        <div className="flex justify-between items-center mb-6 relative z-10">
          <h2 className="text-lg font-semibold tracking-wide">
            Opening Balance
          </h2>
          <CreditCardIcon className="h-8 w-8 text-white opacity-80" />
        </div>

        {/* Balance Details */}
        <div className="space-y-3 relative z-10">
          <div className="flex justify-between">
            <span className="text-sm opacity-80">Balance</span>
            <span className="font-bold text-xl">₹{cash.toLocaleString()}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm opacity-80">Cash</span>
            <span className="font-medium">₹{cash.toLocaleString()}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm opacity-80">Gold</span>
            <span className="font-medium">{goldGrams} gm</span>
          </div>
        </div>
      </div>

      {/* Closing Balance Card */}
      <div className="relative w-full bg-gradient-to-br from-pink-500 via-red-500 to-yellow-500 text-white rounded-2xl p-6 shadow-2xl overflow-hidden transform hover:scale-105 transition-transform duration-300">
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-[url('/images/abs4.jpg')] bg-cover bg-center opacity-10"></div>

        {/* Card Header */}
        <div className="flex justify-between items-center mb-6 relative z-10">
          <h2 className="text-lg font-semibold tracking-wide">
            Closing Balance
          </h2>
          <CreditCardIcon className="h-8 w-8 text-white opacity-80" />
        </div>

        {/* Balance Details */}
        <div className="space-y-3 relative z-10">
          <div className="flex justify-between">
            <span className="text-sm opacity-80">Balance</span>
            <span className="font-bold text-xl">₹{closingBalance.cash}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm opacity-80">Cash</span>
            <span className="font-medium">₹{closingBalance.cash}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm opacity-80">Gold</span>
            <span className="font-medium">{closingBalance.goldGrams} gm</span>
          </div>
        </div>
      </div>
    </div>
  );
}
