"use client"

import { useState } from "react"
import { Plus, Search, ArrowRight, CheckCircle2, XCircle, Send } from "lucide-react"
import { useFleet } from "@/lib/fleet-context"
import { type Trip, type TripStatus } from "@/lib/data"
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
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious,
} from "@/components/ui/pagination"
import { toast } from "sonner"

const ITEMS_PER_PAGE = 8

export function TripManagement() {
  const {
    trips, vehicles, drivers,
    addTrip, updateTripStatus, deleteTrip,
  } = useFleet()

  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [page, setPage] = useState(1)
  const [createOpen, setCreateOpen] = useState(false)
  const [completeOpen, setCompleteOpen] = useState(false)
  const [completingTrip, setCompletingTrip] = useState<Trip | null>(null)
  const [finalOdometer, setFinalOdometer] = useState("")

  // Create form state
  const [newTrip, setNewTrip] = useState({
    vehicleId: "",
    driverId: "",
    cargoWeight: 0,
    pickupLocation: "",
    deliveryLocation: "",
  })

  const filtered = trips.filter((t) => {
    const vehicle = vehicles.find(v => v.id === t.vehicleId)
    const driver = drivers.find(d => d.id === t.driverId)
    const matchesSearch =
      t.pickupLocation.toLowerCase().includes(search.toLowerCase()) ||
      t.deliveryLocation.toLowerCase().includes(search.toLowerCase()) ||
      vehicle?.name.toLowerCase().includes(search.toLowerCase()) ||
      driver?.name.toLowerCase().includes(search.toLowerCase()) ||
      false
    const matchesStatus = statusFilter === "all" || t.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE)
  const paginated = filtered
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE)

  const availableVehicles = vehicles.filter(v => v.status === "Available")
  const availableDrivers = drivers.filter(d =>
    d.status === "Available" && new Date(d.licenseExpiry) >= new Date()
  )

  function handleCreateTrip() {
    if (!newTrip.vehicleId || !newTrip.driverId || !newTrip.pickupLocation || !newTrip.deliveryLocation) {
      toast.error("Please fill in all fields")
      return
    }

    const error = addTrip({
      ...newTrip,
      status: "Draft",
      createdAt: new Date().toISOString(),
    })

    if (error) {
      toast.error(error)
      return
    }

    toast.success("Trip created as draft")
    setCreateOpen(false)
    setNewTrip({ vehicleId: "", driverId: "", cargoWeight: 0, pickupLocation: "", deliveryLocation: "" })
  }

  function handleDispatch(trip: Trip) {
    updateTripStatus(trip.id, "Dispatched")
    toast.success("Trip dispatched - vehicle and driver assigned")
  }

  function openComplete(trip: Trip) {
    setCompletingTrip(trip)
    setFinalOdometer("")
    setCompleteOpen(true)
  }

  function handleComplete() {
    if (!completingTrip) return
    const odometer = parseInt(finalOdometer)
    if (!odometer || odometer <= 0) {
      toast.error("Please enter a valid odometer reading")
      return
    }
    updateTripStatus(completingTrip.id, "Completed", odometer)
    toast.success("Trip completed - vehicle and driver released")
    setCompleteOpen(false)
  }

  function handleCancel(trip: Trip) {
    updateTripStatus(trip.id, "Cancelled")
    toast.success("Trip cancelled")
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-balance">Trip Management</h1>
          <p className="text-muted-foreground mt-1">
            {trips.filter(t => t.status === "Dispatched").length} active trips of {trips.length} total
          </p>
        </div>
        <Button onClick={() => setCreateOpen(true)}>
          <Plus className="mr-2 size-4" />
          Create Trip
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 sm:grid-cols-4">
        {(["Draft", "Dispatched", "Completed", "Cancelled"] as TripStatus[]).map(status => (
          <Card key={status}>
            <CardContent className="pt-6">
              <div className="text-2xl font-bold">
                {trips.filter(t => t.status === status).length}
              </div>
              <p className="text-sm text-muted-foreground">{status}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search trips by location, vehicle, or driver..."
                value={search}
                onChange={(e) => { setSearch(e.target.value); setPage(1) }}
                className="pl-9"
              />
            </div>
            <Select value={statusFilter} onValueChange={(v) => { setStatusFilter(v); setPage(1) }}>
              <SelectTrigger className="w-full sm:w-[160px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="Draft">Draft</SelectItem>
                <SelectItem value="Dispatched">Dispatched</SelectItem>
                <SelectItem value="Completed">Completed</SelectItem>
                <SelectItem value="Cancelled">Cancelled</SelectItem>
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
                <TableHead>Driver</TableHead>
                <TableHead>Route</TableHead>
                <TableHead className="text-right">Cargo</TableHead>
                <TableHead>Created</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginated.map((trip) => {
                const vehicle = vehicles.find(v => v.id === trip.vehicleId)
                const driver = drivers.find(d => d.id === trip.driverId)
                return (
                  <TableRow key={trip.id}>
                    <TableCell className="font-medium">{vehicle?.name || "Unknown"}</TableCell>
                    <TableCell>{driver?.name || "Unknown"}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1 text-muted-foreground">
                        <span className="max-w-[120px] truncate">{trip.pickupLocation}</span>
                        <ArrowRight className="size-3 shrink-0" />
                        <span className="max-w-[120px] truncate">{trip.deliveryLocation}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-right font-mono text-sm">
                      {(trip.cargoWeight / 1000).toFixed(1)}t
                    </TableCell>
                    <TableCell className="text-muted-foreground text-sm">
                      {new Date(trip.createdAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      <StatusBadge status={trip.status} />
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">Actions</Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          {trip.status === "Draft" && (
                            <DropdownMenuItem onClick={() => handleDispatch(trip)}>
                              <Send className="mr-2 size-4" />
                              Dispatch
                            </DropdownMenuItem>
                          )}
                          {trip.status === "Dispatched" && (
                            <DropdownMenuItem onClick={() => openComplete(trip)}>
                              <CheckCircle2 className="mr-2 size-4" />
                              Complete
                            </DropdownMenuItem>
                          )}
                          {(trip.status === "Draft" || trip.status === "Dispatched") && (
                            <>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem
                                className="text-destructive"
                                onClick={() => handleCancel(trip)}
                              >
                                <XCircle className="mr-2 size-4" />
                                Cancel
                              </DropdownMenuItem>
                            </>
                          )}
                          {(trip.status === "Completed" || trip.status === "Cancelled") && (
                            <DropdownMenuItem
                              className="text-destructive"
                              onClick={() => deleteTrip(trip.id)}
                            >
                              Delete
                            </DropdownMenuItem>
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                )
              })}
              {paginated.length === 0 && (
                <TableRow>
                  <TableCell colSpan={7} className="text-center text-muted-foreground py-8">
                    No trips found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
          {totalPages > 1 && (
            <div className="mt-4">
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious
                      href="#"
                      onClick={(e) => { e.preventDefault(); setPage(p => Math.max(1, p - 1)) }}
                    />
                  </PaginationItem>
                  {Array.from({ length: totalPages }, (_, i) => (
                    <PaginationItem key={i}>
                      <PaginationLink
                        href="#"
                        isActive={page === i + 1}
                        onClick={(e) => { e.preventDefault(); setPage(i + 1) }}
                      >
                        {i + 1}
                      </PaginationLink>
                    </PaginationItem>
                  ))}
                  <PaginationItem>
                    <PaginationNext
                      href="#"
                      onClick={(e) => { e.preventDefault(); setPage(p => Math.min(totalPages, p + 1)) }}
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Create Trip Dialog */}
      <Dialog open={createOpen} onOpenChange={setCreateOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Create New Trip</DialogTitle>
            <DialogDescription>
              Assign a vehicle and driver to a new trip. Cargo weight will be validated against vehicle capacity.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-2">
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-2">
                <Label>Vehicle</Label>
                <Select
                  value={newTrip.vehicleId}
                  onValueChange={(v) => setNewTrip(f => ({ ...f, vehicleId: v }))}
                >
                  <SelectTrigger><SelectValue placeholder="Select vehicle" /></SelectTrigger>
                  <SelectContent>
                    {availableVehicles.length === 0 && (
                      <SelectItem value="none" disabled>No available vehicles</SelectItem>
                    )}
                    {availableVehicles.map(v => (
                      <SelectItem key={v.id} value={v.id}>
                        {v.name} ({v.capacity.toLocaleString()} kg)
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex flex-col gap-2">
                <Label>Driver</Label>
                <Select
                  value={newTrip.driverId}
                  onValueChange={(v) => setNewTrip(f => ({ ...f, driverId: v }))}
                >
                  <SelectTrigger><SelectValue placeholder="Select driver" /></SelectTrigger>
                  <SelectContent>
                    {availableDrivers.length === 0 && (
                      <SelectItem value="none" disabled>No available drivers</SelectItem>
                    )}
                    {availableDrivers.map(d => (
                      <SelectItem key={d.id} value={d.id}>
                        {d.name} ({d.licenseCategory})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="t-cargo">Cargo Weight (kg)</Label>
              <Input
                id="t-cargo"
                type="number"
                value={newTrip.cargoWeight}
                onChange={(e) => setNewTrip(f => ({ ...f, cargoWeight: parseInt(e.target.value) || 0 }))}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-2">
                <Label htmlFor="t-pickup">Pickup Location</Label>
                <Input
                  id="t-pickup"
                  value={newTrip.pickupLocation}
                  onChange={(e) => setNewTrip(f => ({ ...f, pickupLocation: e.target.value }))}
                  placeholder="New York, NY"
                />
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="t-delivery">Delivery Location</Label>
                <Input
                  id="t-delivery"
                  value={newTrip.deliveryLocation}
                  onChange={(e) => setNewTrip(f => ({ ...f, deliveryLocation: e.target.value }))}
                  placeholder="Boston, MA"
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setCreateOpen(false)}>Cancel</Button>
            <Button onClick={handleCreateTrip}>Create Trip</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Complete Trip Dialog */}
      <Dialog open={completeOpen} onOpenChange={setCompleteOpen}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Complete Trip</DialogTitle>
            <DialogDescription>
              Enter the final odometer reading to complete this trip.
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col gap-2 py-2">
            <Label htmlFor="final-odo">Final Odometer (km)</Label>
            <Input
              id="final-odo"
              type="number"
              value={finalOdometer}
              onChange={(e) => setFinalOdometer(e.target.value)}
              placeholder="Enter reading"
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setCompleteOpen(false)}>Cancel</Button>
            <Button onClick={handleComplete}>Mark Complete</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
