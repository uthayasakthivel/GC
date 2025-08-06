import { useState } from "react";
import sellGoldImage from "../assets/sell_gold_image.png";
import { CheckCircleIcon } from "@heroicons/react/24/solid";
const TabViewForServices = () => {
  const tabs = ["Gold Loan", "Gold Sales", "Gold Finance"];
  const [activeTab, setActiveTab] = useState("Gold Loan");

  return (
    <div className="w-full">
      {/* Tab Headers */}
      <div className="flex flex-wrap border-b border-gray-300">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`flex-1 text-center py-3 font-medium text-gray-700 relative
              transition-all duration-300 ease-in-out
              ${activeTab === tab ? "text-blue-600" : "hover:text-blue-500"}`}
          >
            {tab}
            {activeTab === tab && (
              <span className="absolute left-0 bottom-0 w-full h-1 bg-blue-600 rounded-t-md" />
            )}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="p-6">
        {activeTab === "Gold Loan" && (
          <div className="flex gap-12 flex-col lg:flex-row">
            {/* Content Section */}
            <div className="flex items-center w-full lg:w-1/2">
              <div className="flex flex-col gap-3 text-left">
                <p>
                  Need instant cash without selling your gold? Our Gold Loan
                  service is the perfect solution. We offer quick, secure, and
                  hassle-free gold loans starting at just ₹1 interest per ₹100
                  per month (12% annual rate).
                </p>
                <p>
                  At Guru Chandra Gold Finance, your gold is not just collateral
                  — it's handled with care and stored safely in high-security
                  vaults. Whether it’s for personal needs, business
                  requirements, or emergencies, we ensure:
                </p>
                <p className="flex gap-2">
                  <CheckCircleIcon className="w-6 text-[#FDFDBD]" /> Instant
                  loan disbursal within minutes
                </p>
                <p className="flex gap-2">
                  <CheckCircleIcon className="w-6 text-[#FCFB9D]" /> Interest
                  rate starting from ₹1 per ₹100/month (12% per annum)
                </p>
                <p className="flex gap-2">
                  <CheckCircleIcon className="w-6 text-[#FBFA70]" /> Flexible
                  repayment options to suit your situation
                </p>
                <p className="flex gap-2">
                  <CheckCircleIcon className="w-6 text-[#FAF954]" /> No hidden
                  charges or surprises
                </p>
                <p className="flex gap-2">
                  <CheckCircleIcon className="w-6 text-[#F9F729]" /> Safe,
                  insured, and secured storage for your gold
                </p>
                <p className="flex gap-2">
                  <CheckCircleIcon className="w-6 text-[#E3E125]" /> Top-up &
                  renewal options for existing loans
                </p>
                <p>
                  We value your trust as much as your gold. Walk in with your
                  jewel, walk out with confidence.
                </p>
                <p>
                  Get the money you need — while your gold stays safe with us.
                </p>
              </div>
            </div>
            {/* Image Section */}
            <div className="w-full lg:w-1/2">
              <img
                src={sellGoldImage}
                alt="Gold Loan"
                className="w-full h-auto"
              />
            </div>
          </div>
        )}

        {activeTab === "Gold Sales" && (
          <div className="text-center text-lg font-medium text-gray-700">
            Gold Sales Content Coming Soon...
          </div>
        )}

        {activeTab === "Gold Finance" && (
          <div className="text-center text-lg font-medium text-gray-700">
            Gold Finance Content Coming Soon...
          </div>
        )}
      </div>
    </div>
  );
};

export default TabViewForServices;
