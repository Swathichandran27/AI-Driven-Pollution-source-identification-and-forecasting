import { FaTachometerAlt, FaMapMarkedAlt, FaChartLine, FaHeartbeat, FaDollarSign } from "react-icons/fa"

export default function Sidebar() {
  return (
    <div className="w-64 bg-white shadow-lg p-6 hidden md:block">
      <h1 className="text-2xl font-bold text-blue-600 mb-10">AeroSense</h1>

      <nav className="space-y-4 text-gray-600">
        <NavItem icon={<FaTachometerAlt />} text="Dashboard" active />
        <NavItem icon={<FaMapMarkedAlt />} text="Map View" />
        <NavItem icon={<FaChartLine />} text="Forecasts" />
        <NavItem icon={<FaHeartbeat />} text="Health Insights" />
        <NavItem icon={<FaDollarSign />} text="Pricing" />
      </nav>
    </div>
  )
}

function NavItem({ icon, text, active }) {
  return (
    <div className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition 
      ${active ? "bg-blue-500 text-white" : "hover:bg-gray-100"}`}>
      {icon}
      <span>{text}</span>
    </div>
  )
}