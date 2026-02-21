import { DashboardShell } from "@/components/dashboard-shell"
import { MaintenanceModule } from "@/components/maintenance/maintenance-module"

export default function MaintenancePage() {
  return (
    <DashboardShell title="Maintenance" breadcrumbs={[{ label: "Maintenance" }]}>
      <MaintenanceModule />
    </DashboardShell>
  )
}
