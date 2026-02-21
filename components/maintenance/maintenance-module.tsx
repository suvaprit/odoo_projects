"use client"

import { useState } from "react"
import { Plus, Search, CheckCircle2, Wrench } from "lucide-react"
import { useFleet } from "@/lib/fleet-context"
import { type MaintenanceType } from "@/lib/data"
import { StatusBadge } from "@/components/status-badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
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
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { toast } from "sonner"

const maintenanceTypes: MaintenanceType[] = [
  "Oil Change", "Tire Rotation", "Brake Service", "Engine Repair", "Transmission", "General Inspection", "Body Work"
]

export function MaintenanceModule() {
  const { maintenanceLogs, vehicles, addMaintenanceLog, completeMaintenanceLog } = useFleet()
  const [search, setSearch] = useState("")
  const [filter, setFilter] = useState<string>("all")
  const [dialogOpen, setDialogOpen] = useState(false)

  const [form, setForm] = useState({
    vehicleId: "",
    type: "Oil Change" as MaintenanceType,
    cost: 0,
    date: new Date().toISOString().split("T")[0],
    description: "",
    completed: false,
  })

  const filtered = maintenanceLogs.filter((m) => {
    const vehicle = vehicles.find(v => v.id === m.vehicleId)
    const matchesSearch =
      vehicle?.name.toLowerCase().includes(search.toLowerCase()) ||
      m.type.toLowerCase().includes(search.toLowerCase()) ||
      m.description.toLowerCase().includes(search.toLowerCase())
    const matchesFilter =
      filter === "all" ||
      (filter === "active" && !m.completed) ||
      (filter === "completed" && m.completed)
    return matchesSearch && matchesFilter
  })

  const totalCost = maintenanceLogs.reduce((sum, m) => sum + m.cost, 0)
  const activeMaint = maintenanceLogs.filter(m => !m.completed).length

  function handleAdd() {
    if (!form.vehicleId || !form.description) {
      toast.error("Please fill in all fields")
      return
    }
    addMaintenanceLog(form)
    toast.success("Maintenance record added")
    setDialogOpen(false)
    setForm({
      vehicleId: "",
      type: "Oil Change",
      cost: 0,
      date: new Date().toISOString().split("T")[0],
      description: "",
      completed: false,
    })
  }

  function handleComplete(id: string) {
    completeMaintenanceLog(id)
    toast.success("Maintenance completed - vehicle now available")
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-balance">Maintenance</h1>
          <p className="text-muted-foreground mt-1">
            {activeMaint} active service{activeMaint !== 1 ? "s" : ""} &middot; &#8377;{totalCost.toLocaleString()} total spend
          </p>
        </div>
        <Button onClick={() => setDialogOpen(true)}>
          <Plus className="mr-2 size-4" />
          Add Service Record
        </Button>
      </div>

      {/* Summary */}
      <div className="grid gap-4 sm:grid-cols-3">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="flex size-10 items-center justify-center rounded-lg bg-amber-500/10">
                <Wrench className="size-5 text-amber-600 dark:text-amber-400" />
              </div>
              <div>
                <div className="text-2xl font-bold">{activeMaint}</div>
                <p className="text-sm text-muted-foreground">Active Services</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="flex size-10 items-center justify-center rounded-lg bg-emerald-500/10">
                <CheckCircle2 className="size-5 text-emerald-600 dark:text-emerald-400" />
              </div>
              <div>
                <div className="text-2xl font-bold">
                  {maintenanceLogs.filter(m => m.completed).length}
                </div>
                <p className="text-sm text-muted-foreground">Completed</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold font-mono">&#8377;{totalCost.toLocaleString()}</div>
            <p className="text-sm text-muted-foreground">Total Maintenance Cost</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search maintenance records..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9"
              />
            </div>
            <Select value={filter} onValueChange={setFilter}>
              <SelectTrigger className="w-full sm:w-[160px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Records</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Table */}
      <Card>
        <CardContent className="pt-6">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Vehicle</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Date</TableHead>
                <TableHead className="text-right">Cost</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((log) => {
                const vehicle = vehicles.find(v => v.id === log.vehicleId)
                return (
                  <TableRow key={log.id}>
                    <TableCell className="font-medium">{vehicle?.name || "Unknown"}</TableCell>
                    <TableCell>
                      <Badge variant="secondary">{log.type}</Badge>
                    </TableCell>
                    <TableCell className="max-w-[200px] truncate text-muted-foreground">
                      {log.description}
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {new Date(log.date).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="text-right font-mono text-sm">
                      &#8377;{log.cost.toLocaleString()}
                    </TableCell>
                    <TableCell>
                      <StatusBadge status={log.completed ? "Completed" : "In Shop"} />
                    </TableCell>
                    <TableCell className="text-right">
                      {!log.completed && (
                        <Button variant="outline" size="sm" onClick={() => handleComplete(log.id)}>
                          Complete
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                )
              })}
              {filtered.length === 0 && (
                <TableRow>
                  <TableCell colSpan={7} className="text-center text-muted-foreground py-8">
                    No maintenance records found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Add Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Add Service Record</DialogTitle>
            <DialogDescription>
              Adding a service record will automatically set the vehicle status to "In Shop".
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-2">
            <div className="flex flex-col gap-2">
              <Label>Vehicle</Label>
              <Select
                value={form.vehicleId}
                onValueChange={(v) => setForm(f => ({ ...f, vehicleId: v }))}
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
                <Label>Service Type</Label>
                <Select
                  value={form.type}
                  onValueChange={(v) => setForm(f => ({ ...f, type: v as MaintenanceType }))}
                >
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {maintenanceTypes.map(t => (
                      <SelectItem key={t} value={t}>{t}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="m-cost">Cost (&#8377;)</Label>
                <Input
                  id="m-cost"
                  type="number"
                  value={form.cost}
                  onChange={(e) => setForm(f => ({ ...f, cost: parseFloat(e.target.value) || 0 }))}
                />
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="m-date">Date</Label>
              <Input
                id="m-date"
                type="date"
                value={form.date}
                onChange={(e) => setForm(f => ({ ...f, date: e.target.value }))}
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="m-desc">Description</Label>
              <Textarea
                id="m-desc"
                value={form.description}
                onChange={(e) => setForm(f => ({ ...f, description: e.target.value }))}
                placeholder="Describe the service..."
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleAdd}>Add Record</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
