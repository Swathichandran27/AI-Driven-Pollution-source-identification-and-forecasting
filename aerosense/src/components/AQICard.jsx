export default function AQICard({ title, value, status }) {
  return (
    <div className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition">
      <h4 className="text-gray-500 mb-2">{title}</h4>
      <p className="text-3xl font-bold mb-3">{value}</p>
      <span className="px-3 py-1 bg-orange-400 text-white rounded-full text-sm">
        {status}
      </span>
    </div>
  )
}