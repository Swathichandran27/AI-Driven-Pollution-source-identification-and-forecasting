import { Link } from "react-router-dom";
import { useEffect, useState } from "react";

export default function Home() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <div className="relative h-screen overflow-hidden bg-gradient-to-br from-[#0A0F1C] via-[#0B1120] to-[#050A16]">
      {/* Animated gradient orbs */}
      <div
        className="absolute top-1/4 -left-64 w-96 h-96 bg-blue-600/20 rounded-full blur-[120px] animate-pulse"
        style={{
          transform: `translate(${mousePosition.x * 0.02}px, ${mousePosition.y * 0.02}px)`,
        }}
      />
      <div
        className="absolute bottom-1/4 -right-64 w-[500px] h-[500px] bg-purple-600/15 rounded-full blur-[120px] animate-pulse"
        style={{
          transform: `translate(${-mousePosition.x * 0.01}px, ${-mousePosition.y * 0.01}px)`,
        }}
      />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[radial-gradient(ellipse_at_center,_rgba(59,130,246,0.08)_0%,_transparent_70%)]" />

      <div className="relative h-full flex items-center justify-center px-4 sm:px-6">
        <div className="w-full max-w-7xl bg-gradient-to-br from-[#0F1A3A]/90 via-[#111C44]/90 to-[#0A1230]/90 backdrop-blur-xl rounded-[48px] border border-white/10 shadow-2xl p-8 md:p-10 transition-all duration-500 hover:shadow-[0_0_80px_rgba(59,130,246,0.2)]">
          {/* Navbar */}
          <div className="flex flex-wrap justify-between items-center gap-4 mb-12">
            <div className="flex items-center gap-2 group">
              <div className="relative">
                <div className="absolute inset-0 bg-blue-500/20 blur-xl rounded-full group-hover:bg-blue-500/30 transition-all duration-500" />
                <img
                  src="/image1.png"
                  alt="AeroSense Logo"
                  className="h-14 md:h-16 object-contain relative z-10 drop-shadow-lg"
                />
              </div>
              <span className="text-white font-bold text-xl tracking-tight bg-gradient-to-r from-white to-blue-300 bg-clip-text text-transparent">
                AeroSense
              </span>
            </div>

            <div className="flex items-center gap-4 md:gap-6">
              <Link
                to="/login?role=user"
                className="relative group overflow-hidden px-5 py-2 rounded-full text-gray-300 hover:text-white transition-all duration-300"
              >
                <span className="relative z-10">Login</span>
                <div className="absolute inset-0 bg-white/5 rounded-full scale-0 group-hover:scale-100 transition-transform duration-300" />
              </Link>

              <Link
                to="/signup?role=user"
                className="relative group bg-gradient-to-r from-blue-500 to-blue-600 text-white px-6 py-2.5 rounded-full font-medium shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 hover:scale-105 transition-all duration-300"
              >
                <span className="relative z-10">Get Started</span>
                <div className="absolute inset-0 bg-white/20 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </Link>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex flex-col lg:flex-row items-center justify-between gap-12">
            {/* LEFT */}
            <div className="w-full lg:w-1/2">
              <div className="inline-flex items-center gap-2 bg-blue-500/10 backdrop-blur-sm rounded-full px-4 py-1.5 border border-blue-400/20 mb-6">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500" />
                </span>
                <span className="text-blue-300 text-xs font-medium tracking-wide">
                  LIVE AIR QUALITY MONITORING
                </span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight">
                <span className="bg-gradient-to-r from-white via-blue-100 to-blue-300 bg-clip-text text-transparent">
                  AI Powered
                </span>
                <br />
                <span className="text-white">Pollution Intelligence</span>
              </h1>

              <p className="mt-6 text-gray-400 text-base md:text-lg leading-relaxed">
                Detect emission hotspots, forecast air quality trends,
                and optimize routes using advanced AI algorithms.
              </p>

              {/* Stats Cards */}
              <div className="grid grid-cols-2 gap-5 mt-10">
                <div className="group relative bg-gradient-to-br from-[#16224F] to-[#0F1940] p-6 rounded-2xl border border-blue-400/20 hover:border-blue-400/50 transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/10 hover:-translate-y-1">
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-transparent rounded-2xl" />
                  <p className="text-gray-400 text-sm flex items-center gap-1">
                    <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                    Live AQI
                  </p>
                  <p className="text-5xl font-bold text-blue-400 mt-2">78</p>
                  <p className="text-green-400 text-sm mt-1 flex items-center gap-1">
                    Moderate
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                    </svg>
                  </p>
                </div>

                <div className="group relative bg-gradient-to-br from-[#16224F] to-[#0F1940] p-6 rounded-2xl border border-yellow-400/20 hover:border-yellow-400/50 transition-all duration-300 hover:shadow-lg hover:shadow-yellow-500/10 hover:-translate-y-1">
                  <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/5 to-transparent rounded-2xl" />
                  <p className="text-gray-400 text-sm">Risk Assessment</p>
                  <p className="text-5xl font-bold text-yellow-400 mt-2">35<span className="text-2xl">%</span></p>
                  <p className="text-gray-400 text-sm mt-1">Wind-based prediction</p>
                </div>
              </div>

              {/* Buttons */}
              <div className="flex flex-wrap gap-4 mt-10">
                <Link
                  to="/login?role=user"
                  className="group relative overflow-hidden bg-gradient-to-r from-blue-600 to-blue-500 px-8 py-3.5 rounded-xl text-white font-medium shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50 transition-all duration-300 hover:scale-105"
                >
                  <span className="relative z-10 flex items-center gap-2">
                    User Login
                    <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-blue-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </Link>

                <Link
                  to="/login?role=policymaker"
                  className="group relative bg-transparent border border-blue-500/50 backdrop-blur-sm px-8 py-3.5 rounded-xl text-blue-400 font-medium hover:bg-blue-500 hover:text-white transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/20 hover:scale-105"
                >
                  <span className="flex items-center gap-2">
                    Policymaker
                    <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </span>
                </Link>
              </div>
            </div>

            {/* RIGHT - Enhanced Earth Globe */}
            <div className="relative w-full lg:w-1/2 flex items-center justify-center">
              <div className="absolute w-[400px] h-[400px] bg-gradient-to-r from-blue-500/20 via-cyan-500/20 to-blue-600/20 rounded-full blur-[100px] animate-pulse" />

              <div className="relative group">
                <div className="absolute inset-0 bg-blue-500/30 rounded-full blur-2xl group-hover:blur-3xl transition-all duration-500" />

                <div className="relative w-[280px] h-[280px] md:w-[340px] md:h-[340px] rounded-full overflow-hidden shadow-2xl shadow-blue-500/30 ring-2 ring-blue-400/20 group-hover:ring-blue-400/40 transition-all duration-500">
                  <img
                    src="https://upload.wikimedia.org/wikipedia/commons/9/97/The_Earth_seen_from_Apollo_17.jpg"
                    alt="Earth"
                    className="w-full h-full object-cover scale-105 group-hover:scale-110 transition-transform duration-10000 animate-spin-slow"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0B1120]/60 via-transparent to-transparent pointer-events-none" />
                </div>

                {/* Orbiting rings */}
                <div className="absolute inset-0 rounded-full border border-blue-400/20 animate-pulse" />
                <div className="absolute inset-[-15px] rounded-full border border-blue-400/10 animate-pulse delay-300" />
                <div className="absolute inset-[-30px] rounded-full border border-cyan-400/5 animate-pulse delay-700" />

                {/* Floating particles */}
                <div className="absolute top-1/4 -right-8 w-2 h-2 bg-blue-400 rounded-full animate-ping" />
                <div className="absolute bottom-1/3 -left-4 w-1.5 h-1.5 bg-cyan-400 rounded-full animate-ping delay-500" />
                <div className="absolute top-2/3 right-4 w-1 h-1 bg-blue-300 rounded-full animate-pulse" />
              </div>

              {/* Stats badge */}
              <div className="absolute bottom-8 left-1/2 -translate-x-1/2 lg:bottom-0 lg:left-auto lg:right-0 lg:translate-x-0 bg-black/40 backdrop-blur-xl rounded-2xl px-4 py-2 border border-white/10">
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1">
                    <div className="w-2 h-2 bg-green-400 rounded-full" />
                    <span className="text-xs text-gray-300">25 Sensors</span>
                  </div>
                  <div className="w-px h-4 bg-white/20" />
                  <div className="flex items-center gap-1">
                    <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse" />
                    <span className="text-xs text-gray-300">Real-time</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Footer stats bar */}
          <div className="mt-16 pt-6 border-t border-white/10 flex flex-wrap justify-between items-center gap-4 text-xs text-gray-500">
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1">
                <span className="w-1.5 h-1.5 bg-green-400 rounded-full" />
                Good
              </span>
              <span className="flex items-center gap-1">
                <span className="w-1.5 h-1.5 bg-yellow-400 rounded-full" />
                Moderate
              </span>
              <span className="flex items-center gap-1">
                <span className="w-1.5 h-1.5 bg-orange-500 rounded-full" />
                Unhealthy
              </span>
            </div>
            <div className="flex gap-4">
              <span>📍 12 monitored zones</span>
              <span>🔄 Updated every 5min</span>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes spin-slow {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
        .animate-spin-slow {
          animation: spin-slow 30s linear infinite;
        }
        .transition-transform-duration-10000 {
          transition-duration: 10000ms;
        }
      `}</style>
    </div>
  );
}