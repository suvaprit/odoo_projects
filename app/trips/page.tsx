import { DashboardShell } from "@/components/dashboard-shell"
import { TripManagement } from "@/components/trips/trip-management"

export default function TripsPage() {
  return (
    <DashboardShell title="Trips" breadcrumbs={[{ label: "Trips" }]}>
      <TripManagement />
    </DashboardShell>
  )
}
