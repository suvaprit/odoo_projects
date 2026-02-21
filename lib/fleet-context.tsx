"use client"

import React, { createContext, useContext, useState, useCallback } from "react"
import {
  type Vehicle,
  type Driver,
  type Trip,
  type MaintenanceLog,
  type FuelLog,
  type Expense,
  type TripStatus,
  initialVehicles,
  initialDrivers,
  initialTrips,
  initialMaintenanceLogs,
  initialFuelLogs,
  initialExpenses,
  generateId,
} from "@/lib/data"

interface FleetContextType {
  vehicles: Vehicle[]
  drivers: Driver[]
  trips: Trip[]
  maintenanceLogs: MaintenanceLog[]
  fuelLogs: FuelLog[]
  expenses: Expense[]

  // Vehicle CRUD
  addVehicle: (vehicle: Omit<Vehicle, "id">) => void
  updateVehicle: (id: string, updates: Partial<Vehicle>) => void
  deleteVehicle: (id: string) => void

  // Driver CRUD
  addDriver: (driver: Omit<Driver, "id">) => void
  updateDriver: (id: string, updates: Partial<Driver>) => void
  deleteDriver: (id: string) => void

  // Trip CRUD
  addTrip: (trip: Omit<Trip, "id">) => string | null
  updateTripStatus: (id: string, status: TripStatus, finalOdometer?: number) => void
  deleteTrip: (id: string) => void

  // Maintenance
  addMaintenanceLog: (log: Omit<MaintenanceLog, "id">) => void
  completeMaintenanceLog: (id: string) => void

  // Fuel
  addFuelLog: (log: Omit<FuelLog, "id">) => void

  // Expenses
  addExpense: (expense: Omit<Expense, "id">) => void
}

const FleetContext = createContext<FleetContextType | null>(null)

export function useFleet() {
  const context = useContext(FleetContext)
  if (!context) throw new Error("useFleet must be used within FleetProvider")
  return context
}

export function FleetProvider({ children }: { children: React.ReactNode }) {
  const [vehicles, setVehicles] = useState<Vehicle[]>(initialVehicles)
  const [drivers, setDrivers] = useState<Driver[]>(initialDrivers)
  const [trips, setTrips] = useState<Trip[]>(initialTrips)
  const [maintenanceLogs, setMaintenanceLogs] = useState<MaintenanceLog[]>(initialMaintenanceLogs)
  const [fuelLogs, setFuelLogs] = useState<FuelLog[]>(initialFuelLogs)
  const [expenses, setExpenses] = useState<Expense[]>(initialExpenses)

  // Vehicle CRUD
  const addVehicle = useCallback((vehicle: Omit<Vehicle, "id">) => {
    setVehicles(prev => [...prev, { ...vehicle, id: `v${generateId()}` }])
  }, [])

  const updateVehicle = useCallback((id: string, updates: Partial<Vehicle>) => {
    setVehicles(prev => prev.map(v => v.id === id ? { ...v, ...updates } : v))
  }, [])

  const deleteVehicle = useCallback((id: string) => {
    setVehicles(prev => prev.filter(v => v.id !== id))
  }, [])

  // Driver CRUD
  const addDriver = useCallback((driver: Omit<Driver, "id">) => {
    setDrivers(prev => [...prev, { ...driver, id: `d${generateId()}` }])
  }, [])

  const updateDriver = useCallback((id: string, updates: Partial<Driver>) => {
    setDrivers(prev => prev.map(d => d.id === id ? { ...d, ...updates } : d))
  }, [])

  const deleteDriver = useCallback((id: string) => {
    setDrivers(prev => prev.filter(d => d.id !== id))
  }, [])

  // Trip CRUD with validation
  const addTrip = useCallback((trip: Omit<Trip, "id">): string | null => {
    const vehicle = vehicles.find(v => v.id === trip.vehicleId)
    const driver = drivers.find(d => d.id === trip.driverId)

    if (!vehicle || !driver) return "Vehicle or driver not found"
    if (vehicle.status !== "Available") return "Vehicle is not available"
    if (driver.status !== "Available") return "Driver is not available"
    if (new Date(driver.licenseExpiry) < new Date()) return "Driver license has expired"
    if (trip.cargoWeight > vehicle.capacity) return `Cargo (${trip.cargoWeight}kg) exceeds vehicle capacity (${vehicle.capacity}kg)`

    setTrips(prev => [...prev, { ...trip, id: `t${generateId()}` }])
    return null
  }, [vehicles, drivers])

  // Trip status lifecycle
  const updateTripStatus = useCallback((id: string, status: TripStatus, finalOdometer?: number) => {
    setTrips(prev => prev.map(t => {
      if (t.id !== id) return t
      const updated = { ...t, status }
      if (status === "Dispatched") {
        updated.dispatchedAt = new Date().toISOString()
        // Vehicle -> On Trip, Driver -> On Duty
        setVehicles(vPrev => vPrev.map(v => v.id === t.vehicleId ? { ...v, status: "On Trip" } : v))
        setDrivers(dPrev => dPrev.map(d => d.id === t.driverId ? { ...d, status: "On Duty" } : d))
      }
      if (status === "Completed") {
        updated.completedAt = new Date().toISOString()
        if (finalOdometer) updated.finalOdometer = finalOdometer
        // Vehicle -> Available, Driver -> Available
        setVehicles(vPrev => vPrev.map(v => v.id === t.vehicleId ? { ...v, status: "Available", odometer: finalOdometer || v.odometer } : v))
        setDrivers(dPrev => dPrev.map(d => d.id === t.driverId ? { ...d, status: "Available", totalTrips: d.totalTrips + 1 } : d))
      }
      if (status === "Cancelled") {
        // Free up vehicle and driver if was dispatched
        if (t.status === "Dispatched") {
          setVehicles(vPrev => vPrev.map(v => v.id === t.vehicleId ? { ...v, status: "Available" } : v))
          setDrivers(dPrev => dPrev.map(d => d.id === t.driverId ? { ...d, status: "Available" } : d))
        }
      }
      return updated
    }))
  }, [])

  const deleteTrip = useCallback((id: string) => {
    setTrips(prev => prev.filter(t => t.id !== id))
  }, [])

  // Maintenance
  const addMaintenanceLog = useCallback((log: Omit<MaintenanceLog, "id">) => {
    setMaintenanceLogs(prev => [...prev, { ...log, id: `m${generateId()}` }])
    if (!log.completed) {
      setVehicles(prev => prev.map(v => v.id === log.vehicleId ? { ...v, status: "In Shop" } : v))
    }
  }, [])

  const completeMaintenanceLog = useCallback((id: string) => {
    setMaintenanceLogs(prev => prev.map(m => {
      if (m.id !== id) return m
      setVehicles(vPrev => vPrev.map(v => v.id === m.vehicleId ? { ...v, status: "Available" } : v))
      return { ...m, completed: true }
    }))
  }, [])

  // Fuel
  const addFuelLog = useCallback((log: Omit<FuelLog, "id">) => {
    setFuelLogs(prev => [...prev, { ...log, id: `f${generateId()}` }])
  }, [])

  // Expenses
  const addExpense = useCallback((expense: Omit<Expense, "id">) => {
    setExpenses(prev => [...prev, { ...expense, id: `e${generateId()}` }])
  }, [])

  return (
    <FleetContext.Provider
      value={{
        vehicles,
        drivers,
        trips,
        maintenanceLogs,
        fuelLogs,
        expenses,
        addVehicle,
        updateVehicle,
        deleteVehicle,
        addDriver,
        updateDriver,
        deleteDriver,
        addTrip,
        updateTripStatus,
        deleteTrip,
        addMaintenanceLog,
        completeMaintenanceLog,
        addFuelLog,
        addExpense,
      }}
    >
      {children}
    </FleetContext.Provider>
  )
}
