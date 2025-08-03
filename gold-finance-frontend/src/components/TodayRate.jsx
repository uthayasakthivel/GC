import silverImage from "../assets/silver.png";
import goldImage from "../assets/gold.png";
import rupeeSymbol from "../assets/Rupee.png";
import verticalLine from "../assets/vertical_line.png";
import horizontalLine from "../assets/horizontal_line.png";
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  ChevronUpIcon,
} from "@heroicons/react/24/solid";

const TodayRate = () => {
  return (
    <div className="bg-pink-200">
      <div className="max-w-7xl mx-auto scroll-mt-36 p-6" id="about">
        <h2 className="text-2xl md:text-4xl relative top-3 font-bold leading-snug text-[#1e293b] text-center">
          Today's Rate
        </h2>
        <div className="md:flex justify-between relative gap-12">
          {/* Gold Section */}
          <div className="flex items-center md:w-1/2 justify-center md:justify-end">
            <div className="image mr-4 w-48 md:w-64">
              <img src={goldImage} alt="" />
            </div>
            <div className="flex flex-col gap-2">
              <p className="font-medium text-lg md:text-2xl">Gold 1Gm 22 CT</p>
              <div className="flex gap-1 items-center">
                <div className="w-6 md:w-8">
                  <img src={rupeeSymbol} alt="" />
                </div>
                <p className="font-bold text-2xl md:text-3xl text-btn-gradient-bottom">
                  9020
                </p>
              </div>
            </div>
          </div>

          {/* Vertical Line in the Center */}
          <div className="hidden md:block absolute left-1/2 -translate-x-1/2 bottom-12 h-24 md:h-38">
            <img src={verticalLine} alt="" className="object-cover" />
          </div>

          {/* Silver Section */}
          <div className="flex items-center md:w-1/2 justify-center md:justify-end pr-6 flex-row-reverse">
            <div className="image mr-4 w-48 md:w-64">
              <img src={silverImage} alt="" />
            </div>
            <div className="flex flex-col gap-2">
              <p className="font-medium text-lg md:text-2xl">Silver 1Gm</p>
              <div className="flex gap-1 items-center">
                <div className="w-6 md:w-8">
                  <img src={rupeeSymbol} alt="" />
                </div>
                <p className="font-bold text-2xl md:text-3xl text-btn-gradient-bottom">
                  9020
                </p>
              </div>
            </div>
          </div>

          {/* Bottom Horizontal Line with Arrows */}
          <div className="flex items-center w-full absolute left-0 bottom-0 md:bottom-4">
            <ChevronLeftIcon className="w-4 h-4 text-line-color absolute -left-2" />
            <div className="flex-grow h-[1.5px] bg-line-color" />
            <ChevronRightIcon className="w-4 h-4 text-line-color absolute -right-2" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default TodayRate;
