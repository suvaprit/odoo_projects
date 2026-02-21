"use client"

import { Truck, AlertTriangle, Gauge, Package, TrendingUp, TrendingDown } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useFleet } from "@/lib/fleet-context"

export function KpiCards() {
  const { vehicles, trips, maintenanceLogs } = useFleet()

  const activeFleet = vehicles.filter(v => v.status !== "Retired").length
  const maintenanceAlerts = maintenanceLogs.filter(m => !m.completed).length
  const availableVehicles = vehicles.filter(v => v.status === "Available").length
  const utilizationRate = activeFleet > 0
    ? Math.round(((activeFleet - availableVehicles) / activeFleet) * 100)
    : 0
  const pendingCargo = trips
    .filter(t => t.status === "Draft" || t.status === "Dispatched")
    .reduce((sum, t) => sum + t.cargoWeight, 0)

  const kpis = [
    {
      title: "Active Fleet",
      value: activeFleet,
      description: `${availableVehicles} available now`,
      icon: Truck,
      trend: "+2 this month",
      trendUp: true,
    },
    {
      title: "Maintenance Alerts",
      value: maintenanceAlerts,
      description: "Vehicles in shop",
      icon: AlertTriangle,
      trend: maintenanceAlerts > 2 ? "Above average" : "Normal",
      trendUp: maintenanceAlerts <= 2,
    },
    {
      title: "Utilization Rate",
      value: `${utilizationRate}%`,
      description: "Fleet utilization",
      icon: Gauge,
      trend: utilizationRate >= 60 ? "Good" : "Below target",
      trendUp: utilizationRate >= 60,
    },
    {
      title: "Pending Cargo",
      value: `${(pendingCargo / 1000).toFixed(1)}t`,
      description: `${trips.filter(t => t.status === "Dispatched").length} active trips`,
      icon: Package,
      trend: "In transit",
      trendUp: true,
    },
  ]

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {kpis.map((kpi) => (
        <Card key={kpi.title}>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {kpi.title}
            </CardTitle>
            <kpi.icon className="size-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{kpi.value}</div>
            <div className="flex items-center gap-1 mt-1">
              {kpi.trendUp ? (
                <TrendingUp className="size-3 text-emerald-600 dark:text-emerald-400" />
              ) : (
                <TrendingDown className="size-3 text-amber-600 dark:text-amber-400" />
              )}
              <p className="text-xs text-muted-foreground">
                {kpi.trend} &middot; {kpi.description}
              </p>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
