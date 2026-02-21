import { DashboardShell } from "@/components/dashboard-shell"
import { FuelExpenseModule } from "@/components/fuel/fuel-expense-module"

export default function FuelPage() {
  return (
    <DashboardShell title="Fuel & Expenses" breadcrumbs={[{ label: "Fuel & Expenses" }]}>
      <FuelExpenseModule />
    </DashboardShell>
  )
}
