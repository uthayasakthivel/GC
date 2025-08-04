import {
  ClockIcon,
  InboxArrowDownIcon,
  MapIcon,
  MapPinIcon,
  PhoneArrowUpRightIcon,
} from "@heroicons/react/24/solid";
import React from "react";
import MapEmbed from "./MapEmbed";

const GetInTouch = () => {
  return (
    <div
      className="bg-[#ffe8ed] pt-16 pb-8 relative rounded-lg scroll-mt-36 p-6"
      id="contact"
      style={{
        boxShadow: "0px 141px 200px -80px rgba(25, 58, 75, 0.3)",
      }}
    >
      <div className="max-w-7xl mx-auto h-full">
        <div className="flex flex-col md:flex-row gap-5 lg:gap-30 ">
          {/*  Content Section */}
          <div className="flex items-center w-full md:w-1/2">
            <div className="flex flex-col gap-8">
              <h2 className="text-2xl uppercase md:text-4xl  font-bold leading-snug text-[#1e293b] ">
                Get in <span className="text-[#E85744]">touch</span>
              </h2>
              <p>
                Have questions or need assistance with jewellery loans,
                purchases, or financing options? We’re here to help! Reach out
                to us any time — our friendly team is ready to assist you.
              </p>
              <div className="flex flex-col sm:flex-row gap-8 justify-between">
                <div className="flex w-full sm:w-1/2 items-center gap-4">
                  <PhoneArrowUpRightIcon width={30} />
                  <div className="flex-col">
                    <p className="uppercase">phone</p>
                    <p className="text-highlight">03 5432 1234</p>
                  </div>
                </div>
                <div className="flex w-full sm:w-1/2 items-center gap-4">
                  <InboxArrowDownIcon width={30} />
                  <div className="flex-col">
                    <p className="uppercase">email</p>
                    <p className="text-highlight">info@marcc.com.au</p>
                  </div>
                </div>
              </div>
              <div className="flex flex-col sm:flex-row  gap-8 justify-between">
                <div className="flex w-full sm:w-1/2 items-center gap-4">
                  <MapPinIcon width={30} />
                  <div className="flex-col">
                    <p className="uppercase">Address</p>
                    <p className="text-highlight">9/117, middle street</p>
                    <p className="text-highlight">Kelaiyapillaiyoor</p>
                    <p className="text-highlight">Tenkasi - 627423</p>
                  </div>
                </div>
                <div className="flex w-full sm:w-1/2 items-center gap-4">
                  <ClockIcon width={30} />
                  <div className="flex-col">
                    <p className="uppercase">Business Hours</p>
                    <p className="text-highlight">
                      {" "}
                      Monday – Saturday: 9:30 AM – 7:00 PM
                    </p>
                    <p className="text-highlight">Sunday: Closed</p>
                    <p className="text-highlight">Tenkasi - 627423</p>
                  </div>
                </div>
              </div>

              <button className="hover:cursor-pointer hover-bounce-scale px-8 py-3 rounded-full bg-[#f59e0b] hover:bg-[#d97706] text-white font-semibold transition-colors duration-300 w-fit">
                Contact Us
              </button>
            </div>
          </div>
          {/* Map Section */}
          <div className="w-full md:w-1/2  h-full z-40">
            <MapEmbed />
          </div>
        </div>
      </div>
      <div className="hidden sm:block absolute w-1/4 h-full rounded-lg bg-dark-color top-0 right-0"></div>
    </div>
  );
};

export default GetInTouch;
