"use client"

import { useState } from "react"
import { Plus, Search, ShieldAlert, Award } from "lucide-react"
import { useFleet } from "@/lib/fleet-context"
import { type Driver, type DriverStatus } from "@/lib/data"
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
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious,
} from "@/components/ui/pagination"
import { Progress } from "@/components/ui/progress"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { toast } from "sonner"

const ITEMS_PER_PAGE = 8

const emptyDriver: Omit<Driver, "id"> = {
  name: "",
  licenseCategory: "CDL-A",
  licenseExpiry: "2027-01-01",
  status: "Available",
  phone: "",
  totalTrips: 0,
  completionRate: 100,
  safetyScore: 100,
}

export function DriverManagement() {
  const { drivers, addDriver, updateDriver, deleteDriver } = useFleet()
  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [page, setPage] = useState(1)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingDriver, setEditingDriver] = useState<Driver | null>(null)
  const [form, setForm] = useState<Omit<Driver, "id">>(emptyDriver)

  const filtered = drivers.filter((d) => {
    const matchesSearch =
      d.name.toLowerCase().includes(search.toLowerCase()) ||
      d.phone.includes(search)
    const matchesStatus = statusFilter === "all" || d.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE)
  const paginated = filtered.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE)

  const isLicenseExpired = (expiry: string) => new Date(expiry) < new Date()

  function openCreate() {
    setEditingDriver(null)
    setForm(emptyDriver)
    setDialogOpen(true)
  }

  function openEdit(driver: Driver) {
    setEditingDriver(driver)
    const { id: _id, ...rest } = driver
    setForm(rest)
    setDialogOpen(true)
  }

  function handleSave() {
    if (!form.name || !form.phone) {
      toast.error("Please fill in all required fields")
      return
    }
    if (editingDriver) {
      updateDriver(editingDriver.id, form)
      toast.success(`${form.name} updated successfully`)
    } else {
      addDriver(form)
      toast.success(`${form.name} added to roster`)
    }
    setDialogOpen(false)
  }

  function handleDelete(driver: Driver) {
    deleteDriver(driver.id)
    toast.success(`${driver.name} removed from roster`)
  }

  function getSafetyColor(score: number) {
    if (score >= 90) return "text-emerald-600 dark:text-emerald-400"
    if (score >= 75) return "text-amber-600 dark:text-amber-400"
    return "text-red-600 dark:text-red-400"
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-balance">Driver Management</h1>
          <p className="text-muted-foreground mt-1">
            Manage {drivers.length} drivers across the fleet
          </p>
        </div>
        <Button onClick={openCreate}>
          <Plus className="mr-2 size-4" />
          Add Driver
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 sm:grid-cols-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">{drivers.filter(d => d.status === "Available").length}</div>
            <p className="text-sm text-muted-foreground">Available</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">{drivers.filter(d => d.status === "On Duty").length}</div>
            <p className="text-sm text-muted-foreground">On Duty</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2">
              <div className="text-2xl font-bold">
                {drivers.filter(d => isLicenseExpired(d.licenseExpiry)).length}
              </div>
              {drivers.filter(d => isLicenseExpired(d.licenseExpiry)).length > 0 && (
                <ShieldAlert className="size-5 text-red-500" />
              )}
            </div>
            <p className="text-sm text-muted-foreground">Expired Licenses</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2">
              <div className="text-2xl font-bold">
                {Math.round(drivers.reduce((sum, d) => sum + d.safetyScore, 0) / drivers.length)}
              </div>
              <Award className="size-5 text-primary" />
            </div>
            <p className="text-sm text-muted-foreground">Avg Safety Score</p>
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
                placeholder="Search drivers..."
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
                <SelectItem value="Available">Available</SelectItem>
                <SelectItem value="On Duty">On Duty</SelectItem>
                <SelectItem value="Off Duty">Off Duty</SelectItem>
                <SelectItem value="Suspended">Suspended</SelectItem>
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
                <TableHead>Driver</TableHead>
                <TableHead>License</TableHead>
                <TableHead>Expiry</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead className="text-right">Trips</TableHead>
                <TableHead>Completion</TableHead>
                <TableHead>Safety</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginated.map((driver) => (
                <TableRow key={driver.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar className="size-8">
                        <AvatarFallback className="bg-primary/10 text-primary text-xs">
                          {driver.name.split(" ").map(n => n[0]).join("")}
                        </AvatarFallback>
                      </Avatar>
                      <span className="font-medium">{driver.name}</span>
                    </div>
                  </TableCell>
                  <TableCell className="font-mono text-sm">{driver.licenseCategory}</TableCell>
                  <TableCell>
                    <span className={isLicenseExpired(driver.licenseExpiry)
                      ? "text-red-600 dark:text-red-400 font-medium"
                      : "text-muted-foreground"
                    }>
                      {new Date(driver.licenseExpiry).toLocaleDateString()}
                    </span>
                  </TableCell>
                  <TableCell className="text-muted-foreground">{driver.phone}</TableCell>
                  <TableCell className="text-right font-mono text-sm">{driver.totalTrips}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Progress value={driver.completionRate} className="h-2 w-16" />
                      <span className="text-xs text-muted-foreground">{driver.completionRate}%</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className={`font-semibold text-sm ${getSafetyColor(driver.safetyScore)}`}>
                      {driver.safetyScore}
                    </span>
                  </TableCell>
                  <TableCell>
                    <StatusBadge status={driver.status} />
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">Actions</Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => openEdit(driver)}>
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          className="text-destructive"
                          onClick={() => handleDelete(driver)}
                        >
                          Remove
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
              {paginated.length === 0 && (
                <TableRow>
                  <TableCell colSpan={9} className="text-center text-muted-foreground py-8">
                    No drivers found
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

      {/* Create / Edit Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>
              {editingDriver ? "Edit Driver" : "Add New Driver"}
            </DialogTitle>
            <DialogDescription>
              {editingDriver
                ? "Update the driver details below."
                : "Fill in the details to add a new driver."}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-2">
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-2">
                <Label htmlFor="d-name">Full Name</Label>
                <Input
                  id="d-name"
                  value={form.name}
                  onChange={(e) => setForm(f => ({ ...f, name: e.target.value }))}
                  placeholder="John Smith"
                />
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="d-phone">Phone</Label>
                <Input
                  id="d-phone"
                  value={form.phone}
                  onChange={(e) => setForm(f => ({ ...f, phone: e.target.value }))}
                  placeholder="+1-555-0100"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-2">
                <Label>License Category</Label>
                <Select
                  value={form.licenseCategory}
                  onValueChange={(v) => setForm(f => ({ ...f, licenseCategory: v }))}
                >
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="CDL-A">CDL-A</SelectItem>
                    <SelectItem value="CDL-B">CDL-B</SelectItem>
                    <SelectItem value="Class C">Class C</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="d-expiry">License Expiry</Label>
                <Input
                  id="d-expiry"
                  type="date"
                  value={form.licenseExpiry}
                  onChange={(e) => setForm(f => ({ ...f, licenseExpiry: e.target.value }))}
                />
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <Label>Status</Label>
              <Select
                value={form.status}
                onValueChange={(v) => setForm(f => ({ ...f, status: v as DriverStatus }))}
              >
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="Available">Available</SelectItem>
                  <SelectItem value="On Duty">On Duty</SelectItem>
                  <SelectItem value="Off Duty">Off Duty</SelectItem>
                  <SelectItem value="Suspended">Suspended</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSave}>
              {editingDriver ? "Save Changes" : "Add Driver"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
