import TabViewForServices from "../components/TabViewForServices";

const Services = () => {
  return (
    <div
      className="max-w-7xl mx-auto mt-6 md:mt-12 scroll-mt-36 p-6"
      id="services"
    >
      <h2 className="text-2xl md:text-4xl mb-8 font-bold leading-snug text-[#1e293b] text-center">
        Services
      </h2>
      <TabViewForServices />
    </div>
  );
};

export default Services;
