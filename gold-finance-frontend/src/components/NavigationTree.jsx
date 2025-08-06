import { useNavigate } from "react-router-dom";
import logo from "../assets/guruchanra-logo-header.png";

export default function NavigationTree() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center mb-12">
      <div className="flex flex-col items-center">
        <img
          src={logo}
          alt="Guruchanra Logo"
          className="w-40 h-auto mb-3 drop-shadow-lg rounded-lg bg-white p-2 border border-slate-200"
          style={{ objectFit: "contain" }}
        />
        <h1 className="text-3xl font-extrabold mb-8 text-amber-900 tracking-wide drop-shadow">
          Guruchanra
        </h1>
      </div>
      <div className="flex flex-row gap-14 w-full justify-center">
        {/* Gold Sales */}
        <div className="flex flex-col items-center">
          <div className="font-semibold text-amber-700 mb-3 text-lg">
            Gold Sales
          </div>
          <select
            className="border border-slate-300 rounded-lg px-5 py-2 mb-2 bg-white shadow focus:ring-2 focus:ring-amber-400 transition"
            onChange={(e) => {
              if (e.target.value) navigate(e.target.value);
              console.log(e.target.value);
            }}
            defaultValue=""
          >
            <option value="" disabled>
              Select Sheet
            </option>
            <option value="/buying-sheet">Buying Sheet</option>
            <option value="/selling-sheet">Selling Sheet</option>
            <option value="/melting-sheet">Melting Sheet</option>
          </select>
        </div>
        {/* Gold Finance */}
        <div className="flex flex-col items-center">
          <div className="font-semibold text-amber-700 mb-3 text-lg">
            Gold Finance
          </div>
          <button
            onClick={() => navigate("/gold-finance-sheet")}
            className="border border-slate-300 rounded-lg px-5 py-2 bg-amber-50 hover:bg-amber-100 shadow transition"
          >
            Gold Finance Sheet
          </button>
        </div>
        {/* Gold Loan */}
        <div className="flex flex-col items-center">
          <div className="font-semibold text-amber-700 mb-3 text-lg">
            Gold Loan
          </div>
          <div className="text-slate-400 italic">Coming soon</div>
        </div>
      </div>
    </div>
  );
}
