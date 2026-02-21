"use client"

import { useState } from "react"
import { Plus, Fuel, Receipt } from "lucide-react"
import { useFleet } from "@/lib/fleet-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table"
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription,
} from "@/components/ui/dialog"
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { toast } from "sonner"

export function FuelExpenseModule() {
  const { fuelLogs, expenses, vehicles, addFuelLog, addExpense } = useFleet()
  const [fuelDialogOpen, setFuelDialogOpen] = useState(false)
  const [expenseDialogOpen, setExpenseDialogOpen] = useState(false)

  const [fuelForm, setFuelForm] = useState({
    vehicleId: "",
    liters: 0,
    cost: 0,
    date: new Date().toISOString().split("T")[0],
    odometerAtFill: 0,
  })

  const [expenseForm, setExpenseForm] = useState({
    vehicleId: "",
    category: "Tolls",
    amount: 0,
    date: new Date().toISOString().split("T")[0],
    description: "",
  })

  const totalFuelCost = fuelLogs.reduce((sum, f) => sum + f.cost, 0)
  const totalFuelLiters = fuelLogs.reduce((sum, f) => sum + f.liters, 0)
  const totalExpenseCost = expenses.reduce((sum, e) => sum + e.amount, 0)
  const totalOperationalCost = totalFuelCost + totalExpenseCost

  // Per-vehicle cost breakdown
  const vehicleCosts = vehicles.map(v => {
    const vFuel = fuelLogs.filter(f => f.vehicleId === v.id).reduce((sum, f) => sum + f.cost, 0)
    const vExpense = expenses.filter(e => e.vehicleId === v.id).reduce((sum, e) => sum + e.amount, 0)
    return { ...v, fuelCost: vFuel, expenseCost: vExpense, totalCost: vFuel + vExpense }
  }).filter(v => v.totalCost > 0).sort((a, b) => b.totalCost - a.totalCost)

  function handleAddFuel() {
    if (!fuelForm.vehicleId || fuelForm.liters <= 0) {
      toast.error("Please fill in all fields")
      return
    }
    addFuelLog(fuelForm)
    toast.success("Fuel log added")
    setFuelDialogOpen(false)
    setFuelForm({ vehicleId: "", liters: 0, cost: 0, date: new Date().toISOString().split("T")[0], odometerAtFill: 0 })
  }

  function handleAddExpense() {
    if (!expenseForm.vehicleId || !expenseForm.description) {
      toast.error("Please fill in all fields")
      return
    }
    addExpense(expenseForm)
    toast.success("Expense recorded")
    setExpenseDialogOpen(false)
    setExpenseForm({ vehicleId: "", category: "Tolls", amount: 0, date: new Date().toISOString().split("T")[0], description: "" })
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-balance">Fuel & Expenses</h1>
          <p className="text-muted-foreground mt-1">
            Track fuel consumption and operational costs
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setExpenseDialogOpen(true)}>
            <Receipt className="mr-2 size-4" />
            Add Expense
          </Button>
          <Button onClick={() => setFuelDialogOpen(true)}>
            <Fuel className="mr-2 size-4" />
            Log Fuel
          </Button>
        </div>
      </div>

      {/* Summary */}
      <div className="grid gap-4 sm:grid-cols-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold font-mono">&#8377;{totalFuelCost.toLocaleString()}</div>
            <p className="text-sm text-muted-foreground">Total Fuel Cost</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold font-mono">{totalFuelLiters.toLocaleString()}L</div>
            <p className="text-sm text-muted-foreground">Total Fuel Consumed</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold font-mono">&#8377;{totalExpenseCost.toLocaleString()}</div>
            <p className="text-sm text-muted-foreground">Other Expenses</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold font-mono">&#8377;{totalOperationalCost.toLocaleString()}</div>
            <p className="text-sm text-muted-foreground">Total Operational Cost</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="fuel" className="w-full">
        <TabsList>
          <TabsTrigger value="fuel">Fuel Logs</TabsTrigger>
          <TabsTrigger value="expenses">Expenses</TabsTrigger>
          <TabsTrigger value="breakdown">Cost Breakdown</TabsTrigger>
        </TabsList>

        <TabsContent value="fuel">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Fuel Logs</CardTitle>
              <CardDescription>{fuelLogs.length} entries recorded</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Vehicle</TableHead>
                    <TableHead className="text-right">Liters</TableHead>
                    <TableHead className="text-right">Cost</TableHead>
                    <TableHead className="text-right">Price/L</TableHead>
                    <TableHead className="text-right">Odometer</TableHead>
                    <TableHead>Date</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {[...fuelLogs]
                    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                    .map((log) => {
                      const vehicle = vehicles.find(v => v.id === log.vehicleId)
                      return (
                        <TableRow key={log.id}>
                          <TableCell className="font-medium">{vehicle?.name || "Unknown"}</TableCell>
                          <TableCell className="text-right font-mono text-sm">{log.liters}L</TableCell>
                          <TableCell className="text-right font-mono text-sm">&#8377;{log.cost.toFixed(2)}</TableCell>
                          <TableCell className="text-right font-mono text-sm text-muted-foreground">
                            &#8377;{(log.cost / log.liters).toFixed(2)}
                          </TableCell>
                          <TableCell className="text-right font-mono text-sm">
                            {log.odometerAtFill.toLocaleString()} km
                          </TableCell>
                          <TableCell className="text-muted-foreground">
                            {new Date(log.date).toLocaleDateString()}
                          </TableCell>
                        </TableRow>
                      )
                    })}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="expenses">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Expense Records</CardTitle>
              <CardDescription>{expenses.length} entries recorded</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Vehicle</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead className="text-right">Amount</TableHead>
                    <TableHead>Date</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {[...expenses]
                    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                    .map((expense) => {
                      const vehicle = vehicles.find(v => v.id === expense.vehicleId)
                      return (
                        <TableRow key={expense.id}>
                          <TableCell className="font-medium">{vehicle?.name || "Unknown"}</TableCell>
                          <TableCell><Badge variant="secondary">{expense.category}</Badge></TableCell>
                          <TableCell className="text-muted-foreground">{expense.description}</TableCell>
                          <TableCell className="text-right font-mono text-sm">&#8377;{expense.amount.toFixed(2)}</TableCell>
                          <TableCell className="text-muted-foreground">
                            {new Date(expense.date).toLocaleDateString()}
                          </TableCell>
                        </TableRow>
                      )
                    })}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="breakdown">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Cost Breakdown by Vehicle</CardTitle>
              <CardDescription>Aggregated fuel and expense costs per vehicle</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Vehicle</TableHead>
                    <TableHead>License Plate</TableHead>
                    <TableHead className="text-right">Fuel Cost</TableHead>
                    <TableHead className="text-right">Other Expenses</TableHead>
                    <TableHead className="text-right">Total Cost</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {vehicleCosts.map((v) => (
                    <TableRow key={v.id}>
                      <TableCell className="font-medium">{v.name}</TableCell>
                      <TableCell className="font-mono text-sm">{v.licensePlate}</TableCell>
                      <TableCell className="text-right font-mono text-sm">&#8377;{v.fuelCost.toLocaleString()}</TableCell>
                      <TableCell className="text-right font-mono text-sm">&#8377;{v.expenseCost.toLocaleString()}</TableCell>
                      <TableCell className="text-right font-mono text-sm font-bold">&#8377;{v.totalCost.toLocaleString()}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Fuel Dialog */}
      <Dialog open={fuelDialogOpen} onOpenChange={setFuelDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Log Fuel Purchase</DialogTitle>
            <DialogDescription>Record a fuel fill-up for a vehicle.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-2">
            <div className="flex flex-col gap-2">
              <Label>Vehicle</Label>
              <Select
                value={fuelForm.vehicleId}
                onValueChange={(v) => setFuelForm(f => ({ ...f, vehicleId: v }))}
              >
                <SelectTrigger><SelectValue placeholder="Select vehicle" /></SelectTrigger>
                <SelectContent>
                  {vehicles.filter(v => v.fuelType !== "Electric").map(v => (
                    <SelectItem key={v.id} value={v.id}>
                      {v.name} - {v.licensePlate}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div className="flex flex-col gap-2">
                <Label htmlFor="f-liters">Liters</Label>
                <Input id="f-liters" type="number" value={fuelForm.liters}
                  onChange={(e) => setFuelForm(f => ({ ...f, liters: parseFloat(e.target.value) || 0 }))} />
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="f-cost">Cost (&#8377;)</Label>
                <Input id="f-cost" type="number" value={fuelForm.cost}
                  onChange={(e) => setFuelForm(f => ({ ...f, cost: parseFloat(e.target.value) || 0 }))} />
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="f-odo">Odometer</Label>
                <Input id="f-odo" type="number" value={fuelForm.odometerAtFill}
                  onChange={(e) => setFuelForm(f => ({ ...f, odometerAtFill: parseInt(e.target.value) || 0 }))} />
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="f-date">Date</Label>
              <Input id="f-date" type="date" value={fuelForm.date}
                onChange={(e) => setFuelForm(f => ({ ...f, date: e.target.value }))} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setFuelDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleAddFuel}>Log Fuel</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Expense Dialog */}
      <Dialog open={expenseDialogOpen} onOpenChange={setExpenseDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Add Expense</DialogTitle>
            <DialogDescription>Record an operational expense for a vehicle.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-2">
            <div className="flex flex-col gap-2">
              <Label>Vehicle</Label>
              <Select
                value={expenseForm.vehicleId}
                onValueChange={(v) => setExpenseForm(f => ({ ...f, vehicleId: v }))}
              >
                <SelectTrigger><SelectValue placeholder="Select vehicle" /></SelectTrigger>
                <SelectContent>
                  {vehicles.map(v => (
                    <SelectItem key={v.id} value={v.id}>
                      {v.name} - {v.licensePlate}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-2">
                <Label>Category</Label>
                <Select
                  value={expenseForm.category}
                  onValueChange={(v) => setExpenseForm(f => ({ ...f, category: v }))}
                >
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Tolls">Tolls</SelectItem>
                    <SelectItem value="Parking">Parking</SelectItem>
                    <SelectItem value="Insurance">Insurance</SelectItem>
                    <SelectItem value="Registration">Registration</SelectItem>
                    <SelectItem value="Towing">Towing</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="e-amount">Amount (&#8377;)</Label>
                <Input id="e-amount" type="number" value={expenseForm.amount}
                  onChange={(e) => setExpenseForm(f => ({ ...f, amount: parseFloat(e.target.value) || 0 }))} />
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="e-date">Date</Label>
              <Input id="e-date" type="date" value={expenseForm.date}
                onChange={(e) => setExpenseForm(f => ({ ...f, date: e.target.value }))} />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="e-desc">Description</Label>
              <Input id="e-desc" value={expenseForm.description}
                onChange={(e) => setExpenseForm(f => ({ ...f, description: e.target.value }))}
                placeholder="Description of expense" />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setExpenseDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleAddExpense}>Add Expense</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
