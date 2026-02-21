import { DashboardShell } from "@/components/dashboard-shell"
import { DriverManagement } from "@/components/drivers/driver-management"

export default function DriversPage() {
  return (
    <DashboardShell title="Drivers" breadcrumbs={[{ label: "Drivers" }]}>
      <DriverManagement />
    </DashboardShell>
  )
}
