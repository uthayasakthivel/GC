const MapEmbed = () => {
  return (
    <div className="w-full h-[400px] rounded-lg overflow-hidden shadow-lg">
      <iframe
        title="Google Map"
        className="w-full h-full border-0"
        loading="lazy"
        allowFullScreen
        referrerPolicy="no-referrer-when-downgrade"
        src="https://www.google.com/maps/embed?pb=!1m17!1m12!1m3!1d3942.313512744433!2d77.37061827501678!3d8.850375691204006!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m2!1m1!2zOMKwNTEnMDEuNCJOIDc3wrAyMicyMy41IkU!5e0!3m2!1sen!2sin!4v1753611886978!5m2!1sen!2sin"
      ></iframe>
    </div>
  );
};

export default MapEmbed;
