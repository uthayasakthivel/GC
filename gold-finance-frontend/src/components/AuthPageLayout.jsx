export default function AuthPageLayout({ children, image }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="w-full max-w-5xl bg-white rounded-3xl shadow-lg overflow-hidden flex flex-col md:flex-row">
        {/* Left Image Section */}
        <div className="md:w-1/2 relative overflow-hidden h-64 md:h-auto">
          <img
            src={image}
            alt="Login visual"
            className="w-full h-full object-cover transition-transform duration-500 ease-in-out hover:scale-110"
          />
        </div>

        {/* Right Form Section */}
        <div className="md:w-1/2 p-6 md:p-10 flex flex-col justify-center gap-3 relative">
          <h1 className="text-center text-2xl font-bold mb-4">Guru Chandra</h1>
          {children}
        </div>
      </div>
    </div>
  );
}
