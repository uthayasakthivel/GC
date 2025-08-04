import AboutUs from "../../sections/AboutUs";
import BannerCarousel from "../../sections/BannerCarousel";
import Footer from "../../sections/Footer";
import GetInTouch from "../../sections/GetInTouch";
import Header from "../../sections/Header";
import Services from "../../sections/Services";
import TodayRate from "../../sections/TodayRate";

export default function HomePage() {
  return (
    <div
      className="font-family-base bg-gradient-to-b from-orange-100 via-orange-50 to-white"
      style={{ fontFamily: "var(--font-family-base)" }}
    >
      <Header />
      <BannerCarousel />
      <TodayRate />
      <AboutUs />
      <Services />
      <GetInTouch />
      <Footer />
    </div>
  );
}
