"use client"

import { Download, FileText, TrendingUp, IndianRupee, Gauge } from "lucide-react"
import {
  Bar, BarChart, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  Line, LineChart, Cell, PieChart, Pie,
} from "recharts"
import { useFleet } from "@/lib/fleet-context"
import { getMonthlyFuelData } from "@/lib/data"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { toast } from "sonner"

export function AnalyticsReports() {
  const { vehicles, drivers, trips, maintenanceLogs, fuelLogs, expenses } = useFleet()

  // Calculations
  const completedTrips = trips.filter(t => t.status === "Completed")
  const totalDistance = completedTrips.reduce((sum, t) => sum + (t.distance || 0), 0)
  const totalFuelCost = fuelLogs.reduce((sum, f) => sum + f.cost, 0)
  const totalFuelLiters = fuelLogs.reduce((sum, f) => sum + f.liters, 0)
  const totalMaintenanceCost = maintenanceLogs.reduce((sum, m) => sum + m.cost, 0)
  const totalExpenseCost = expenses.reduce((sum, e) => sum + e.amount, 0)
  const totalOperationalCost = totalFuelCost + totalMaintenanceCost + totalExpenseCost

  // Fuel efficiency
  const avgFuelEfficiency = totalFuelLiters > 0 && totalDistance > 0
    ? (totalDistance / totalFuelLiters).toFixed(2)
    : "N/A"

  // Cost per km
  const costPerKm = totalDistance > 0
    ? (totalOperationalCost / totalDistance).toFixed(2)
    : "N/A"

  // Vehicle ROI data
  const vehicleROI = vehicles.map(v => {
    const vTrips = completedTrips.filter(t => t.vehicleId === v.id)
    const vFuel = fuelLogs.filter(f => f.vehicleId === v.id).reduce((sum, f) => sum + f.cost, 0)
    const vMaint = maintenanceLogs.filter(m => m.vehicleId === v.id).reduce((sum, m) => sum + m.cost, 0)
    const vExpense = expenses.filter(e => e.vehicleId === v.id).reduce((sum, e) => sum + e.amount, 0)
    const vDistance = vTrips.reduce((sum, t) => sum + (t.distance || 0), 0)
    const totalCost = vFuel + vMaint + vExpense
    return {
      name: v.name,
      licensePlate: v.licensePlate,
      trips: vTrips.length,
      distance: vDistance,
      fuelCost: vFuel,
      maintenanceCost: vMaint,
      expenseCost: vExpense,
      totalCost,
      costPerKm: vDistance > 0 ? (totalCost / vDistance).toFixed(2) : "N/A",
      status: v.status,
    }
  }).sort((a, b) => b.trips - a.trips)

  // Cost breakdown for pie chart
  const costBreakdown = [
    { name: "Fuel", value: totalFuelCost },
    { name: "Maintenance", value: totalMaintenanceCost },
    { name: "Other", value: totalExpenseCost },
  ].filter(c => c.value > 0)

  const pieColors = [
    "oklch(0.45 0.12 240)",
    "oklch(0.65 0.16 45)",
    "oklch(0.55 0.14 165)",
  ]

  // Monthly fuel data
  const monthlyFuel = getMonthlyFuelData(fuelLogs)

  // Driver performance
  const driverPerformance = drivers.map(d => ({
    name: d.name,
    trips: d.totalTrips,
    completionRate: d.completionRate,
    safetyScore: d.safetyScore,
  })).sort((a, b) => b.safetyScore - a.safetyScore)

  // Export CSV
  function exportCSV(data: Record<string, unknown>[], filename: string) {
    if (data.length === 0) {
      toast.error("No data to export")
      return
    }
    const headers = Object.keys(data[0])
    const csv = [
      headers.join(","),
      ...data.map(row => headers.map(h => JSON.stringify(row[h] ?? "")).join(","))
    ].join("\n")

    const blob = new Blob([csv], { type: "text/csv" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `${filename}.csv`
    a.click()
    URL.revokeObjectURL(url)
    toast.success(`${filename}.csv exported`)
  }

  // Export PDF (simple print-friendly version)
  function exportPDF() {
    window.print()
    toast.success("Print dialog opened for PDF export")
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-balance">Analytics & Reports</h1>
          <p className="text-muted-foreground mt-1">
            Fleet performance insights and cost analysis
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => exportCSV(vehicleROI.map(v => ({
              vehicle: v.name,
              licensePlate: v.licensePlate,
              trips: v.trips,
              distance: v.distance,
              fuelCost: v.fuelCost,
              maintenanceCost: v.maintenanceCost,
              totalCost: v.totalCost,
              costPerKm: v.costPerKm,
            })), "fleet-report")}
          >
            <Download className="mr-2 size-4" />
            Export CSV
          </Button>
          <Button variant="outline" onClick={exportPDF}>
            <FileText className="mr-2 size-4" />
            Export PDF
          </Button>
        </div>
      </div>

      {/* Top-level KPIs */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10">
                <Gauge className="size-5 text-primary" />
              </div>
              <div>
                <div className="text-2xl font-bold font-mono">{avgFuelEfficiency}</div>
                <p className="text-sm text-muted-foreground">Avg Fuel Efficiency (km/L)</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="flex size-10 items-center justify-center rounded-lg bg-accent/10">
                <IndianRupee className="size-5 text-accent" />
              </div>
              <div>
                <div className="text-2xl font-bold font-mono">&#8377;{costPerKm}</div>
                <p className="text-sm text-muted-foreground">Cost per km</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="flex size-10 items-center justify-center rounded-lg bg-emerald-500/10">
                <TrendingUp className="size-5 text-emerald-600 dark:text-emerald-400" />
              </div>
              <div>
                <div className="text-2xl font-bold">{completedTrips.length}</div>
                <p className="text-sm text-muted-foreground">Completed Trips</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold font-mono">&#8377;{totalOperationalCost.toLocaleString()}</div>
            <p className="text-sm text-muted-foreground">Total Operational Cost</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="vehicles">Vehicle ROI</TabsTrigger>
          <TabsTrigger value="drivers">Driver Performance</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="flex flex-col gap-4">
          <div className="grid gap-4 md:grid-cols-2">
            {/* Monthly Cost Chart */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Monthly Fuel Costs</CardTitle>
                <CardDescription>Fuel spending by month</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[280px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={monthlyFuel}>
                      <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                      <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                      <YAxis tick={{ fontSize: 12 }} tickFormatter={(v) => `\u20B9${v}`} />
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

            {/* Cost Breakdown Pie */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Cost Breakdown</CardTitle>
                <CardDescription>Where your money goes</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[280px] flex flex-col items-center justify-center">
                  <ResponsiveContainer width="100%" height={200}>
                    <PieChart>
                      <Pie
                        data={costBreakdown}
                        cx="50%"
                        cy="50%"
                        innerRadius={50}
                        outerRadius={80}
                        paddingAngle={4}
                        dataKey="value"
                        nameKey="name"
                      >
                        {costBreakdown.map((_, index) => (
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
                        formatter={(value: number) => [`\u20B9${value.toLocaleString()}`, ""]}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="flex items-center gap-4">
                    {costBreakdown.map((item, i) => (
                      <div key={item.name} className="flex items-center gap-1.5 text-xs">
                        <div className="size-2.5 rounded-full" style={{ backgroundColor: pieColors[i] }} />
                        <span className="text-muted-foreground">{item.name}</span>
                        <span className="font-medium">&#8377;{item.value.toLocaleString()}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Fuel Consumption Trend */}
            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle className="text-base">Fuel Consumption Trend</CardTitle>
                <CardDescription>Monthly liters consumed</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[240px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={monthlyFuel}>
                      <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                      <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                      <YAxis tick={{ fontSize: 12 }} tickFormatter={(v) => `${v}L`} />
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
          </div>
        </TabsContent>

        <TabsContent value="vehicles">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-base">Vehicle ROI Analysis</CardTitle>
                <CardDescription>Cost and performance metrics per vehicle</CardDescription>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => exportCSV(vehicleROI.map(v => ({
                  vehicle: v.name,
                  licensePlate: v.licensePlate,
                  trips: v.trips,
                  distance: v.distance,
                  fuelCost: v.fuelCost,
                  maintenanceCost: v.maintenanceCost,
                  totalCost: v.totalCost,
                  costPerKm: v.costPerKm,
                })), "vehicle-roi")}
              >
                <Download className="mr-2 size-4" />
                CSV
              </Button>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Vehicle</TableHead>
                    <TableHead>License</TableHead>
                    <TableHead className="text-right">Trips</TableHead>
                    <TableHead className="text-right">Distance</TableHead>
                    <TableHead className="text-right">Fuel Cost</TableHead>
                    <TableHead className="text-right">Maintenance</TableHead>
                    <TableHead className="text-right">Total Cost</TableHead>
                    <TableHead className="text-right">Cost/km</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {vehicleROI.map((v) => (
                    <TableRow key={v.name}>
                      <TableCell className="font-medium">{v.name}</TableCell>
                      <TableCell className="font-mono text-sm">{v.licensePlate}</TableCell>
                      <TableCell className="text-right">{v.trips}</TableCell>
                      <TableCell className="text-right font-mono text-sm">
                        {v.distance.toLocaleString()} km
                      </TableCell>
                      <TableCell className="text-right font-mono text-sm">
                        &#8377;{v.fuelCost.toLocaleString()}
                      </TableCell>
                      <TableCell className="text-right font-mono text-sm">
                        &#8377;{v.maintenanceCost.toLocaleString()}
                      </TableCell>
                      <TableCell className="text-right font-mono text-sm font-bold">
                        &#8377;{v.totalCost.toLocaleString()}
                      </TableCell>
                      <TableCell className="text-right font-mono text-sm">
                        {v.costPerKm !== "N/A" ? `\u20B9${v.costPerKm}` : "N/A"}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="drivers">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-base">Driver Performance</CardTitle>
                <CardDescription>Safety scores, completion rates, and trip counts</CardDescription>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => exportCSV(driverPerformance, "driver-performance")}
              >
                <Download className="mr-2 size-4" />
                CSV
              </Button>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Driver</TableHead>
                    <TableHead className="text-right">Total Trips</TableHead>
                    <TableHead className="text-right">Completion Rate</TableHead>
                    <TableHead className="text-right">Safety Score</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {driverPerformance.map((d) => (
                    <TableRow key={d.name}>
                      <TableCell className="font-medium">{d.name}</TableCell>
                      <TableCell className="text-right font-mono">{d.trips}</TableCell>
                      <TableCell className="text-right font-mono">{d.completionRate}%</TableCell>
                      <TableCell className="text-right">
                        <span className={`font-bold font-mono ${
                          d.safetyScore >= 90
                            ? "text-emerald-600 dark:text-emerald-400"
                            : d.safetyScore >= 75
                            ? "text-amber-600 dark:text-amber-400"
                            : "text-red-600 dark:text-red-400"
                        }`}>
                          {d.safetyScore}
                        </span>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
