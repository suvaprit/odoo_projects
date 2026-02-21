"use client"

import { Bar, BarChart, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Line, LineChart, Cell, PieChart, Pie } from "recharts"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { useFleet } from "@/lib/fleet-context"
import { getMonthlyFuelData, getVehicleStatusCounts, getTripStatusCounts } from "@/lib/data"

export function DashboardCharts() {
  const { vehicles, trips, fuelLogs } = useFleet()

  const monthlyFuel = getMonthlyFuelData(fuelLogs)
  const statusCounts = getVehicleStatusCounts(vehicles)
  const tripCounts = getTripStatusCounts(trips)

  const pieColors = [
    "oklch(0.55 0.14 165)",
    "oklch(0.55 0.15 240)",
    "oklch(0.65 0.16 45)",
    "oklch(0.50 0.02 240)",
  ]

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {/* Fuel Cost Trend */}
      <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle className="text-base">Monthly Fuel Cost</CardTitle>
          <CardDescription>Fuel expenses across all vehicles by month</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[280px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyFuel} margin={{ top: 5, right: 5, bottom: 5, left: 5 }}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                <XAxis dataKey="month" tick={{ fontSize: 12 }} className="text-muted-foreground" />
                <YAxis tick={{ fontSize: 12 }} className="text-muted-foreground" tickFormatter={(v) => `\u20B9${v}`} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "var(--color-popover)",
                    border: "1px solid var(--color-border)",
                    borderRadius: "8px",
                    color: "var(--color-popover-foreground)",
                  }}
                  formatter={(value: number) => [`\u20B9${value.toFixed(2)}`, "Cost"]}
                />
                <Bar dataKey="cost" fill="var(--color-chart-1)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Vehicle Status Pie */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Vehicle Status</CardTitle>
          <CardDescription>Current fleet distribution</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[280px] flex flex-col items-center justify-center">
            <ResponsiveContainer width="100%" height={180}>
              <PieChart>
                <Pie
                  data={statusCounts}
                  cx="50%"
                  cy="50%"
                  innerRadius={45}
                  outerRadius={75}
                  paddingAngle={4}
                  dataKey="count"
                  nameKey="status"
                >
                  {statusCounts.map((_, index) => (
                    <Cell key={index} fill={pieColors[index]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: "var(--color-popover)",
                    border: "1px solid var(--color-border)",
                    borderRadius: "8px",
                    color: "var(--color-popover-foreground)",
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex flex-wrap items-center justify-center gap-3 mt-2">
              {statusCounts.map((item, i) => (
                <div key={item.status} className="flex items-center gap-1.5 text-xs">
                  <div className="size-2.5 rounded-full" style={{ backgroundColor: pieColors[i] }} />
                  <span className="text-muted-foreground">{item.status}</span>
                  <span className="font-medium">{item.count}</span>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Trip Activity */}
      <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle className="text-base">Trip Activity</CardTitle>
          <CardDescription>Fuel consumption trend by month</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[240px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={monthlyFuel} margin={{ top: 5, right: 5, bottom: 5, left: 5 }}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                <XAxis dataKey="month" tick={{ fontSize: 12 }} className="text-muted-foreground" />
                <YAxis tick={{ fontSize: 12 }} className="text-muted-foreground" tickFormatter={(v) => `${v}L`} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "var(--color-popover)",
                    border: "1px solid var(--color-border)",
                    borderRadius: "8px",
                    color: "var(--color-popover-foreground)",
                  }}
                  formatter={(value: number) => [`${value}L`, "Liters"]}
                />
                <Line
                  type="monotone"
                  dataKey="liters"
                  stroke="var(--color-chart-2)"
                  strokeWidth={2}
                  dot={{ r: 3, fill: "var(--color-chart-2)" }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Trip Status Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Trip Summary</CardTitle>
          <CardDescription>Current trip status breakdown</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-3">
            {tripCounts.map((item) => {
              const total = trips.length
              const percentage = total > 0 ? Math.round((item.count / total) * 100) : 0
              return (
                <div key={item.status} className="flex flex-col gap-1.5">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">{item.status}</span>
                    <span className="font-medium">{item.count}</span>
                  </div>
                  <div className="h-2 rounded-full bg-secondary">
                    <div
                      className="h-full rounded-full bg-primary transition-all"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
