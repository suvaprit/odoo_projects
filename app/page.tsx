import { DashboardShell } from "@/components/dashboard-shell"
import { KpiCards } from "@/components/dashboard/kpi-cards"
import { DashboardCharts } from "@/components/dashboard/dashboard-charts"
import { RecentActivity } from "@/components/dashboard/recent-activity"

export default function DashboardPage() {
  return (
    <DashboardShell title="Command Center">
      <div className="flex flex-col gap-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-balance">Command Center</h1>
          <p className="text-muted-foreground mt-1">
            Real-time overview of your fleet operations
          </p>
        </div>
        <KpiCards />
        <DashboardCharts />
        <RecentActivity />
      </div>
    </DashboardShell>
  )
}
