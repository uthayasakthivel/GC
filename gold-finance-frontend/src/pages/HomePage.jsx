import AboutUs from "../components/aboutUs";
import BannerCarousel from "../components/BannerCarousel";
import Footer from "../components/Footer";
import GetInTouch from "../components/GetInTouch";
import Header from "../components/Header";
import Services from "../components/Services";
import TodayRate from "../components/TodayRate";

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
