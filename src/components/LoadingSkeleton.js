export function CardSkeleton() {
  return (
    <div className="animate-pulse bg-slate-800 rounded-xl p-6 border border-slate-700">
      <div className="h-5 bg-slate-700 rounded w-3/4 mb-3"></div>
      <div className="h-4 bg-slate-700 rounded w-full mb-4"></div>
      <div className="h-4 bg-slate-700 rounded w-1/2"></div>
    </div>
  );
}

export function TableRowSkeleton({ cols = 6 }) {
  return (
    <tr className="border-b border-slate-800">
      {Array.from({ length: cols }).map((_, i) => (
        <td key={i} className="py-4 pr-4">
          <div className="h-4 bg-slate-700/50 rounded w-full"></div>
        </td>
      ))}
    </tr>
  );
}

export function ListSkeleton({ rows = 3 }) {
  return (
    <div className="space-y-4">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="animate-pulse bg-slate-800 rounded-xl p-6 border border-slate-700">
          <div className="flex gap-4">
            <div className="h-10 w-10 bg-slate-700 rounded-full"></div>
            <div className="flex-1">
              <div className="h-5 bg-slate-700 rounded w-1/3 mb-3"></div>
              <div className="h-4 bg-slate-700 rounded w-1/2"></div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export function StatsCardSkeleton() {
  return (
    <div className="animate-pulse bg-slate-800 rounded-xl p-6 border border-slate-700">
      <div className="h-4 bg-slate-700 rounded w-1/2 mb-4"></div>
      <div className="h-8 bg-slate-700 rounded w-1/3 mb-2"></div>
      <div className="h-3 bg-slate-700 rounded w-2/3"></div>
    </div>
  );
}

