import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0B1120] via-[#0F1B3D] to-[#0B1120] 
                    flex items-center justify-center p-10">
                                   
      {/* Main Container */}
      <div className="w-full max-w-7xl bg-gradient-to-br from-[#0F1B3D] to-[#111C44]
                      rounded-[50px] border border-blue-500/20
                      shadow-[0_0_80px_rgba(59,130,246,0.15)]
                      p-16 flex flex-col">

        {/* Navbar */}
        <div className="flex justify-between items-center mb-16">

          {/* FIXED LOGO */}
          <img 
            src="/image1.png" 
            alt="AeroSense Logo"
            className="h-20 object-contain"
          />

          <div className="flex items-center gap-10 text-gray-300 text-lg">
            <Link to="/login?role=user" className="hover:text-white transition">
              Login
            </Link>

            <Link
              to="/signup?role=user"
              className="bg-white text-black px-8 py-3 rounded-full 
                         font-medium hover:scale-105 transition">
              Get Started
            </Link>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex items-center justify-between">

          {/* LEFT SIDE */}
          <div className="max-w-xl">

            <h3 className="text-6xl font-bold text-white leading-tight">
              AI Powered Pollution Intelligence
           
            </h3>

            <p className="mt-8 text-gray-400 text-lg leading-relaxed">
              Detect emission hotspots, forecast air quality trends,
              and optimize routes based on pollution exposure using AI.
            </p>

            {/* AQI + Risk */}
            <div className="grid grid-cols-2 gap-8 mt-12">

              <div className="bg-[#16224F] p-8 rounded-3xl 
                              border border-blue-400/20 shadow-lg">
                <p className="text-gray-400 text-sm">Live AQI Index</p>
                <p className="text-5xl font-bold text-blue-400 mt-2">78</p>
                <p className="text-green-400 mt-1">Moderate Air Quality</p>
              </div>

              <div className="bg-[#16224F] p-8 rounded-3xl 
                              border border-yellow-400/20 shadow-lg">
                <p className="text-gray-400 text-sm">Pollution Risk</p>
                <p className="text-5xl font-bold text-yellow-400 mt-2">35%</p>
                <p className="text-gray-400 mt-1">
                  Based on wind & humidity
                </p>
              </div>
            </div>

            {/* Buttons */}
            <div className="flex gap-6 mt-14">
              <Link
                to="/login?role=user"
                className="bg-blue-500 px-8 py-4 rounded-xl text-white 
                           hover:bg-blue-600 transition shadow-xl text-lg">
                Login as User
              </Link>

              <Link
                to="/login?role=policymaker"
                className="border border-blue-400 px-8 py-4 rounded-xl 
                           text-blue-400 hover:bg-blue-500 hover:text-white 
                           transition text-lg">
                Policymaker Access
              </Link>
            </div>
          </div>

          {/* RIGHT SIDE - CLEAN GLOBE */}
          <div className="relative flex items-center justify-center">

            {/* Soft Glow */}
            <div className="absolute w-[420px] h-[420px] 
                            bg-blue-500 rounded-full blur-[120px] opacity-20">
            </div>

            <img
              src="https://upload.wikimedia.org/wikipedia/commons/9/97/The_Earth_seen_from_Apollo_17.jpg"
              alt="Earth"
              className="relative w-[380px] h-[380px] object-cover rounded-full
                         animate-spin-slow shadow-xl"
            />

          </div>

        </div>
      </div>
    </div>
  );
}