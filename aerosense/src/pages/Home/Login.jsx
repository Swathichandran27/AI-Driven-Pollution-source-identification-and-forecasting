import { Link, useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

export default function Login() {
  const location = useLocation();
  const navigate = useNavigate();
  const [userRole, setUserRole] = useState("user");
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    rememberMe: false,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const role = params.get("role");
    if (role === "user" || role === "policymaker") {
      setUserRole(role);
    }
  }, [location]);

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = async (e) => {
  e.preventDefault();
  setIsLoading(true);

  try {
    const response = await fetch("http://localhost:5000/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: formData.email,
        password: formData.password,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "Login failed");
    }

    // ✅ SAVE USER (IMPORTANT)
    localStorage.setItem("user", JSON.stringify(data.user));

    // ✅ REDIRECT BASED ON ROLE FROM BACKEND
    if (data.user.role === "citizen") {
      navigate("/citizen");
    } else {
      navigate("/policy");
    }

  } catch (error) {
    console.error(error);
    alert(error.message);
  } finally {
    setIsLoading(false);
  }
};

  const roleConfig = {
    user: {
      title: "Citizen Login",
      subtitle: "Access your personal air quality dashboard",
      gradient: "from-blue-600 to-blue-500",
      icon: "👤",
      badge: "Citizen Access",
    },
    policymaker: {
      title: "Policymaker Portal",
      subtitle: "Access analytics, reports, and policy tools",
      gradient: "from-purple-600 to-purple-500",
      icon: "🏛️",
      badge: "Government Access",
    },
  };

  const config = roleConfig[userRole];

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-[#0A0F1C] via-[#0B1120] to-[#050A16]">
      {/* Animated background elements */}
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

      {/* Floating particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-blue-400/30 rounded-full animate-float"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${3 + Math.random() * 4}s`,
            }}
          />
        ))}
      </div>

      <div className="relative min-h-screen flex items-center justify-center px-4 sm:px-6 py-12">
        <div className="w-full max-w-6xl flex flex-col lg:flex-row gap-8 items-center">
          
          {/* Left Side - Branding & Info */}
          <div className="w-full lg:w-1/2 space-y-8">
            <div className="flex items-center gap-3 group">
              <div className="relative">
                <div className="absolute inset-0 bg-blue-500/20 blur-xl rounded-full group-hover:bg-blue-500/30 transition-all duration-500" />
                <img
                  src="/image.png"
                  alt="AeroSense Logo"
                  className="h-14 md:h-16 object-contain relative z-10 drop-shadow-lg"
                />
              </div>
              <span className="text-white font-bold text-2xl tracking-tight bg-gradient-to-r from-white to-blue-300 bg-clip-text text-transparent">
                AeroSense
              </span>
            </div>

            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 bg-white/5 backdrop-blur-sm rounded-full px-4 py-2 border border-white/10">
                <span className="text-2xl">{config.icon}</span>
                <span className="text-blue-300 text-sm font-medium tracking-wide">
                  {config.badge}
                </span>
              </div>
              
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
                <span className="bg-gradient-to-r from-white via-blue-100 to-blue-300 bg-clip-text text-transparent">
                  {config.title}
                </span>
              </h1>
              
              <p className="text-gray-400 text-lg">
                {config.subtitle}
              </p>
            </div>

            {/* Features List */}
            <div className="space-y-4 pt-4">
              {userRole === "user" ? (
                <>
                  <div className="flex items-center gap-3 text-gray-300">
                    <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center">
                      <svg className="w-4 h-4 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <span>Real-time AQI monitoring in your area</span>
                  </div>
                  <div className="flex items-center gap-3 text-gray-300">
                    <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center">
                      <svg className="w-4 h-4 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                    </div>
                    <span>Personalized health recommendations</span>
                  </div>
                  <div className="flex items-center gap-3 text-gray-300">
                    <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center">
                      <svg className="w-4 h-4 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                      </svg>
                    </div>
                    <span>Air quality forecasts and alerts</span>
                  </div>
                </>
              ) : (
                <>
                  <div className="flex items-center gap-3 text-gray-300">
                    <div className="w-8 h-8 rounded-full bg-purple-500/20 flex items-center justify-center">
                      <svg className="w-4 h-4 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                      </svg>
                    </div>
                    <span>City-wide pollution analytics</span>
                  </div>
                  <div className="flex items-center gap-3 text-gray-300">
                    <div className="w-8 h-8 rounded-full bg-purple-500/20 flex items-center justify-center">
                      <svg className="w-4 h-4 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z" />
                      </svg>
                    </div>
                    <span>Policy impact simulations</span>
                  </div>
                  <div className="flex items-center gap-3 text-gray-300">
                    <div className="w-8 h-8 rounded-full bg-purple-500/20 flex items-center justify-center">
                      <svg className="w-4 h-4 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <span>Historical trend analysis</span>
                  </div>
                </>
              )}
            </div>

            {/* Role Switcher */}
            <div className="pt-6 flex gap-3">
              <Link
                to="/login?role=user"
                className={`px-5 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                  userRole === "user"
                    ? "bg-blue-500 text-white shadow-lg shadow-blue-500/30"
                    : "bg-white/5 text-gray-400 hover:bg-white/10"
                }`}
              >
                Citizen Login
              </Link>
              <Link
                to="/login?role=policymaker"
                className={`px-5 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                  userRole === "policymaker"
                    ? "bg-purple-500 text-white shadow-lg shadow-purple-500/30"
                    : "bg-white/5 text-gray-400 hover:bg-white/10"
                }`}
              >
                Policymaker Login
              </Link>
            </div>
          </div>

          {/* Right Side - Login Form */}
          <div className="w-full lg:w-1/2">
            <div className="bg-gradient-to-br from-[#0F1A3A]/90 via-[#111C44]/90 to-[#0A1230]/90 backdrop-blur-xl rounded-3xl border border-white/10 shadow-2xl p-8 md:p-10">
              <div className="mb-8 text-center">
                <h2 className="text-2xl font-bold text-white mb-2">
                  Welcome Back
                </h2>
                <p className="text-gray-400 text-sm">
                  Sign in to access your {userRole === "user" ? "personal dashboard" : "policy control panel"}
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Email Input */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-300 block">
                    Email Address
                  </label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <svg className="h-5 w-5 text-gray-500 group-focus-within:text-blue-400 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                      </svg>
                    </div>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-300"
                      placeholder={userRole === "user" ? "citizen@example.com" : "policymaker@government.gov"}
                    />
                  </div>
                </div>

                {/* Password Input */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-300 block">
                    Password
                  </label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <svg className="h-5 w-5 text-gray-500 group-focus-within:text-blue-400 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6-4h12a2 2 0 012 2v6a2 2 0 01-2 2H6a2 2 0 01-2-2v-6a2 2 0 012-2zm10-4V7a4 4 0 00-8 0v4h8z" />
                      </svg>
                    </div>
                    <input
                      type={showPassword ? "text" : "password"}
                      name="password"
                      value={formData.password}
                      onChange={handleInputChange}
                      required
                      className="w-full pl-10 pr-12 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-300"
                      placeholder="••••••••"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    >
                      {showPassword ? (
                        <svg className="h-5 w-5 text-gray-400 hover:text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                        </svg>
                      ) : (
                        <svg className="h-5 w-5 text-gray-400 hover:text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                      )}
                    </button>
                  </div>
                </div>

                {/* Remember Me & Forgot Password */}
                <div className="flex items-center justify-between">
                  <label className="flex items-center gap-2 cursor-pointer group">
                    <input
                      type="checkbox"
                      name="rememberMe"
                      checked={formData.rememberMe}
                      onChange={handleInputChange}
                      className="w-4 h-4 rounded border-white/20 bg-white/5 text-blue-500 focus:ring-blue-500 focus:ring-offset-0"
                    />
                    <span className="text-sm text-gray-400 group-hover:text-gray-300 transition-colors">
                      Remember me
                    </span>
                  </label>
                  <Link
                    to="/forgot-password"
                    className="text-sm text-blue-400 hover:text-blue-300 transition-colors"
                  >
                    Forgot password?
                  </Link>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className={`w-full bg-gradient-to-r ${config.gradient} text-white py-3 rounded-xl font-medium shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 transition-all duration-300 hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 relative overflow-hidden group`}
                >
                  <span className="relative z-10 flex items-center justify-center gap-2">
                    {isLoading ? (
                      <>
                        <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                        </svg>
                        Signing in...
                      </>
                    ) : (
                      <>
                        Sign In
                        <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                        </svg>
                      </>
                    )}
                  </span>
                  <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </button>

                {/* Demo Credentials */}
                <div className="pt-4 text-center">
                  <p className="text-xs text-gray-500 mb-2">Demo Credentials</p>
                  <div className="flex justify-center gap-4 text-xs">
                    <span className="text-gray-400">Email: demo@example.com</span>
                    <span className="text-gray-400">Password: demo123</span>
                  </div>
                </div>
              </form>

              {/* Sign Up Link */}
              <div className="mt-8 text-center">
                <p className="text-gray-400 text-sm">
                  Don't have an account?{" "}
                  <Link
                    to={`/signup?role=${userRole}`}
                    className="text-blue-400 hover:text-blue-300 font-medium transition-colors"
                  >
                    Sign up
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes float {
          0%, 100% {
            transform: translateY(0px) translateX(0px);
            opacity: 0;
          }
          50% {
            transform: translateY(-20px) translateX(10px);
            opacity: 0.5;
          }
        }
        .animate-float {
          animation: float linear infinite;
        }
      `}</style>
    </div>
  );
}