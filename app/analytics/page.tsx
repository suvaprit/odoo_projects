import { DashboardShell } from "@/components/dashboard-shell"
import { AnalyticsReports } from "@/components/analytics/analytics-reports"

export default function AnalyticsPage() {
  return (
    <DashboardShell title="Analytics" breadcrumbs={[{ label: "Analytics & Reports" }]}>
      <AnalyticsReports />
    </DashboardShell>
  )
}
