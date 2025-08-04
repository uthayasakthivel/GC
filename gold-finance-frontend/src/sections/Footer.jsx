import logo from "../assets/guruchanra-logo-header.png";
import { FaFacebookF, FaLinkedinIn } from "react-icons/fa";
import { IoLogoTwitter } from "react-icons/io";
const Footer = () => {
  return (
    <div className="bg-bar-color text-white p-6 pt-0 pb-0">
      <div className="flex flex-wrap items-center justify-center sm:justify-between max-w-7xl mx-auto  z-20 mt-12 gap-3 sm:gap-0 pb-3 sm:pb-0">
        <a href="/">
          <img
            src={logo}
            alt="Guru Chandra Gold Finance logo"
            className="h-16 md:h-16 lg:h-20 w-auto"
          />
        </a>
        <p>© 2025 Guru Chanra, Tenkasi. All rights reserved.</p>
        <div className="flex flex-col sm:flex-row items-center justify-between ">
          <div className="flex justify-between gap-6">
            <div className="rounded-full border border-white w-fit h-fit p-2">
              <FaLinkedinIn />
            </div>
            <div className="rounded-full border border-white w-fit h-fit p-2">
              <FaFacebookF />
            </div>
            <div className="rounded-full border border-white w-fit h-fit p-2">
              <IoLogoTwitter />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Footer;
