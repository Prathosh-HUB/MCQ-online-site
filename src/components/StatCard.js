"use client";

export default function StatCard({ icon, label, value, subtext, color = "blue", trend }) {
  const colorMap = {
    blue: "from-blue-600 to-blue-400",
    purple: "from-purple-600 to-pink-500",
    emerald: "from-emerald-600 to-teal-400",
    amber: "from-amber-600 to-orange-400",
    red: "from-red-600 to-rose-400",
    indigo: "from-indigo-600 to-purple-500",
  };

  const gradient = colorMap[color] || colorMap.blue;

  return (
    <div className="bg-slate-800 border border-slate-700 rounded-xl p-6 hover:border-slate-600 transition-all">
      <div className="flex items-start justify-between mb-4">
        <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${gradient} flex items-center justify-center text-2xl`}>
          {icon}
        </div>
        {trend !== undefined && (
          <span className={`flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full ${
            trend >= 0 ? "bg-emerald-600/20 text-emerald-400" : "bg-red-600/20 text-red-400"
          }`}>
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={trend >= 0 ? "M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" : "M13 17h8m0 0v-8m0 8l-8-8-4 4-6-6"} />
            </svg>
            {Math.abs(trend)}%
          </span>
        )}
      </div>
      <p className="text-3xl font-bold text-white mb-1">{value}</p>
      <p className="text-sm text-slate-400">{label}</p>
      {subtext && <p className="text-xs text-slate-500 mt-1">{subtext}</p>}
    </div>
  );
}

