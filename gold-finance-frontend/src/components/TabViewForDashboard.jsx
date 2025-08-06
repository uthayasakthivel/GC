import { useState } from "react";

const TabViewForDashboard = ({ tabs }) => {
  const [activeTab, setActiveTab] = useState(tabs[0]?.label || "");
  const [activeSubTab, setActiveSubTab] = useState(
    tabs[0]?.subTabs?.[0]?.label || ""
  );

  return (
    <div className="w-full">
      {/* Main Tabs */}
      <div className="flex flex-wrap border-b border-gray-300">
        {tabs.map((tab) => (
          <button
            key={tab.label}
            onClick={() => {
              setActiveTab(tab.label);
              setActiveSubTab(tab.subTabs?.[0]?.label || "");
            }}
            className={`flex-1 text-center py-3 font-medium text-gray-700 relative
              transition-all duration-300 ease-in-out
              ${
                activeTab === tab.label
                  ? "text-blue-600"
                  : "hover:text-blue-500"
              }`}
          >
            {tab.label}
            {activeTab === tab.label && (
              <span className="absolute left-0 bottom-0 w-full h-1 bg-blue-600 rounded-t-md" />
            )}
          </button>
        ))}
      </div>

      {/* Nested Tabs */}
      {tabs.find((t) => t.label === activeTab)?.subTabs && (
        <div className="flex border-b border-gray-200 bg-gray-50">
          {tabs
            .find((t) => t.label === activeTab)
            ?.subTabs.map((subTab) => (
              <button
                key={subTab.label}
                onClick={() => setActiveSubTab(subTab.label)}
                className={`px-4 py-2 text-sm font-medium transition-all
                  ${
                    activeSubTab === subTab.label
                      ? "text-amber-700 border-b-2 border-amber-700 bg-white"
                      : "text-gray-600 hover:text-amber-700"
                  }`}
              >
                {subTab.label}
              </button>
            ))}
        </div>
      )}

      {/* Tab Content */}
      <div className="p-6">
        {tabs
          .find((t) => t.label === activeTab)
          ?.subTabs?.find((s) => s.label === activeSubTab)?.content ||
          tabs.find((t) => t.label === activeTab)?.content}
      </div>
    </div>
  );
};

export default TabViewForDashboard;
