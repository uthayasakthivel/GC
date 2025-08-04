import { CheckCircleIcon } from "@heroicons/react/24/solid";
import aboutUsImage from "../assets/about-us.png";

const AboutUs = () => {
  return (
    <div className="max-w-7xl mx-auto mt-12 scroll-mt-36 p-6" id="about">
      <h2 className="text-2xl md:text-4xl mb-8 font-bold leading-snug text-[#1e293b] text-center">
        About Us
      </h2>
      <div className="hidden lg:block">
        <div className="flex flex-col md:flex-row gap-10 lg:gap-30">
          {/* Image Section */}
          <div className="w-auto lg:w-1/2 h-full lg:h-auto">
            <img
              src={aboutUsImage}
              alt="shri madasamy nadar: founder of guruchanra finance"
              className=" [box-shadow:4px_45px_250px_10px_#193A4B] rounded-[25px]"
            />
          </div>

          {/*  Content Section */}
          <div className="flex items-center w-1/2">
            <div className="flex flex-col gap-3">
              <p>
                At Guru Chanra Gold Finance, we are dedicated to providing
                trusted and transparent services in gold buying, selling, and
                gold loan solutions.{" "}
              </p>
              <p>
                Our journey is rooted in the vision of{" "}
                <span className="text-btn-gradient-bottom">
                  Shri R. Madasamy Nadar
                </span>
                , whose values of honesty and service still guide our business
                today.
              </p>
              <p>We specialize in:</p>
              <p className="flex gap-2">
                <CheckCircleIcon className="w-6 text-btn-gradient-bottom" />{" "}
                Buying and selling gold at fair market prices
              </p>
              <p className="flex gap-2">
                <CheckCircleIcon className="w-6 text-btn-gradient-top" /> Gold
                loans with quick processing and secure handling
              </p>
              <p className="flex gap-2">
                <CheckCircleIcon className="w-6 text-dark-color" /> Financial
                assistance through easy and reliable procedures
              </p>
              <p>
                Carrying forward a legacy of trust and service, Guru Chandra
                Gold Finance is built on the pillars of integrity, transparency,
                and customer care. Whether you are looking to unlock the value
                of your gold or invest with confidence, we’re here to help.
              </p>
              <p>Your gold, your trust — our responsibility.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile */}
      <div className="block lg:hidden">
        <div className="flex flex-col md:flex-row gap-10 lg:gap-30">
          {/* Image Section */}
          <div className="w-auto lg:w-1/2 h-full lg:h-auto">
            <img
              src={aboutUsImage}
              alt="shri madasamy nadar: founder of guruchanra finance"
              className=" [box-shadow:4px_45px_250px_10px_#193A4B] rounded-[25px]"
            />
          </div>

          {/*  Content Section */}
          <div className="flex items-center w-full md:w-1/2">
            <div className="flex flex-col gap-6 md:gap-12">
              <p>
                At Guru Chanra Gold Finance, we are dedicated to providing
                trusted and transparent services in gold buying, selling, and
                gold loan solutions.{" "}
              </p>
              <p>
                Our journey is rooted in the vision of{" "}
                <span className="text-btn-gradient-bottom">
                  Shri R. Madasamy Nadar
                </span>
                , whose values of honesty and service still guide our business
                today.
              </p>
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-3 mt-6 md:mt-12">
          {" "}
          <p>We specialize in:</p>
          <p className="flex gap-2">
            <CheckCircleIcon className="w-6 text-btn-gradient-bottom" /> Buying
            and selling gold at fair market prices
          </p>
          <p className="flex gap-2">
            <CheckCircleIcon className="w-6 text-btn-gradient-top" /> Gold loans
            with quick processing and secure handling
          </p>
          <p className="flex gap-2">
            <CheckCircleIcon className="w-6 text-dark-color" /> Financial
            assistance through easy and reliable procedures
          </p>
          <p>
            Carrying forward a legacy of trust and service, Guru Chandra Gold
            Finance is built on the pillars of integrity, transparency, and
            customer care. Whether you are looking to unlock the value of your
            gold or invest with confidence, we’re here to help.
          </p>
          <p>Your gold, your trust — our responsibility.</p>
        </div>
      </div>
    </div>
  );
};

export default AboutUs;
