import React from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/solid";
import bannerimage1 from "../assets/banner-image-1-bg-removed.png";

const slides = [
  {
    title: "Sell, Loan & Finance\nTrusted Gold Services",
    subtitle:
      "Get the best value when selling your gold or flexible loans and financing tailored to your needs. Experience trust and transparency every step of the way.",
    image: bannerimage1,
  },
  {
    title: "Pure & Natural",
    subtitle: "Organic, authentic and rooted in tradition",
    image:
      "https://www.hindustantimes.com/ht-img/img/2025/05/11/550x309/Rajinikanth_1725187854966_1746979562473.jpg",
  },
  {
    title: "Crafted with Love",
    subtitle: "From local farms to your table",
    image:
      "https://www.hindustantimes.com/ht-img/img/2025/05/11/550x309/Rajinikanth_1725187854966_1746979562473.jpg",
  },
];

// Custom arrow components
const Arrow = ({ direction, onClick }) => (
  <button
    onClick={onClick}
    className={`absolute top-1/2 -translate-y-1/2 z-10 
      bg-white/80 hover:bg-white text-[#1e293b] 
      w-12 h-12 flex items-center justify-center 
      rounded-full shadow-md transition 
      ${
        direction === "left" ? "2xl:-left-10 left-4" : "2xl:-right-10 right-4"
      }`}
    aria-label={direction === "left" ? "Previous Slide" : "Next Slide"}
  >
    {direction === "left" ? (
      <ChevronLeftIcon className="w-6 h-6" />
    ) : (
      <ChevronRightIcon className="w-6 h-6" />
    )}
  </button>
);

export default function BannerCarousel() {
  const settings = {
    dots: true,
    infinite: true,
    speed: 1000,
    // autoplay: true,
    autoplaySpeed: 1000,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: true,
    nextArrow: <Arrow direction="right" />,
    prevArrow: <Arrow direction="left" />,
    appendDots: (dots) => (
      <div className="absolute bottom-4 w-full flex justify-center">
        <ul className="flex items-center absolute left-1/2 -top-16 transform -translate-x-1/2">
          {dots}
        </ul>
      </div>
    ),
    customPaging: () => (
      <div className="w-3 h-3 bg-red-400 rounded-full opacity-50 hover:opacity-100 transition-all"></div>
    ),
  };

  return (
    <div
      className="relative w-full max-w-7xl mx-auto mt-25 scroll-mt-36 pt-8 lg:pt-0"
      id="home"
    >
      <Slider {...settings}>
        {slides.map((slide, index) => (
          <div key={index}>
            <div className="w-full flex flex-col md:flex-row">
              {/* Left Content */}
              <div className="flex-1 flex flex-col justify-center p-6 pb-0 md:pl-16 text-left">
                <p className="text-sm md:text-lg text-gray-500 mb-2">
                  Trusted Gold Solutions Under One Roof
                </p>
                <h2 className="text-3xl md:text-5xl font-bold leading-snug text-[#1e293b] whitespace-pre-line">
                  {slide.title}
                </h2>
                <p className="text-base md:text-lg text-gray-700 mt-4 whitespace-pre-line max-w-xl leading-relaxed">
                  {slide.subtitle}
                </p>
                <div className="mt-6 flex gap-4 flex-wrap pb-4 md:pb-0">
                  {/* Call Us Button */}
                  <button className="hover:cursor-pointer hover-bounce-scale px-8 py-3 rounded-full bg-[#f59e0b] hover:bg-[#d97706] text-white font-semibold transition-colors duration-300">
                    Call Us
                  </button>

                  <button className="hover:cursor-pointer hover-bounce-scale px-8 py-3 rounded-full bg-[#334155] hover:bg-[#1e293b] text-white font-semibold transition-colors duration-300">
                    Reach Us
                  </button>
                </div>
              </div>

              {/* Right Image */}
              <div className="flex-1 flex items-center justify-center p-4 pb-0">
                <img
                  src={slide.image}
                  alt="Banner"
                  className="w-full max-w-[500px] h-auto 2xl:max-w-none 2xl:w-auto 2xl:h-auto"
                />
              </div>
            </div>
          </div>
        ))}
      </Slider>
    </div>
  );
}
