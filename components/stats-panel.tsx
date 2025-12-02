import type React from "react"
import { Mountain, Flame, Moon, Camera, Layers } from "lucide-react"
import type { Location } from "@/lib/types"

interface StatsPanelProps {
  locations: Location[]
}

export function StatsPanel({ locations }: StatsPanelProps) {
  const stats = {
    total: locations.length,
    overworld: locations.filter((l) => l.dimension === "overworld").length,
    nether: locations.filter((l) => l.dimension === "nether").length,
    end: locations.filter((l) => l.dimension === "end").length,
    screenshots: locations.filter((l) => l.type === "screenshot").length,
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-8">
      <StatCard icon={<Layers className="w-5 h-5" />} label="TOTAL" value={stats.total} color="total" />
      <StatCard icon={<Mountain className="w-5 h-5" />} label="OVERWORLD" value={stats.overworld} color="chart-1" />
      <StatCard icon={<Flame className="w-5 h-5" />} label="NETHER" value={stats.nether} color="chart-4" />
      <StatCard icon={<Moon className="w-5 h-5" />} label="END" value={stats.end} color="chart-5" />
      <StatCard icon={<Camera className="w-5 h-5" />} label="CAPTURAS" value={stats.screenshots} color="accent" />
    </div>
  )
}

function StatCard({
  icon,
  label,
  value,
  color,
}: {
  icon: React.ReactNode
  label: string
  value: number
  color: string
}) {
  const colorClasses: Record<string, string> = {
    total: "text-amber-400 border-amber-400/30 bg-amber-400/5",
    "chart-1": "text-chart-1 border-chart-1/30 bg-chart-1/5",
    "chart-4": "text-chart-4 border-chart-4/30 bg-chart-4/5",
    "chart-5": "text-chart-5 border-chart-5/30 bg-chart-5/5",
    accent: "text-accent border-accent/30 bg-accent/5",
  }

  return (
    <div className={`border p-4 ${colorClasses[color]} relative overflow-hidden group`}>
      <div className="absolute top-0 right-0 w-16 h-16 opacity-10 transform translate-x-4 -translate-y-4">{icon}</div>
      <div className="flex items-center gap-2 mb-2">
        {icon}
        <span className="text-[10px] font-mono tracking-widest opacity-70">{label}</span>
      </div>
      <p className="text-3xl font-bold font-mono">{value}</p>
    </div>
  )
}
