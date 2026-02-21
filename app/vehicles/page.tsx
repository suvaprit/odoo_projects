import { DashboardShell } from "@/components/dashboard-shell"
import { VehicleRegistry } from "@/components/vehicles/vehicle-registry"

export default function VehiclesPage() {
  return (
    <DashboardShell title="Vehicles" breadcrumbs={[{ label: "Vehicles" }]}>
      <VehicleRegistry />
    </DashboardShell>
  )
}
