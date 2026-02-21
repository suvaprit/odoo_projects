// FleetOps Data Types and Mock Data

export type UserRole = "fleet_manager" | "dispatcher" | "safety_officer" | "financial_analyst"

export interface User {
  id: string
  name: string
  email: string
  role: UserRole
  avatar?: string
}

export type VehicleStatus = "Available" | "On Trip" | "In Shop" | "Retired"

export interface Vehicle {
  id: string
  name: string
  model: string
  licensePlate: string
  capacity: number
  odometer: number
  status: VehicleStatus
  type: "Truck" | "Van" | "Sedan" | "SUV"
  region: string
  fuelType: "Diesel" | "Gasoline" | "Electric" | "Hybrid"
  year: number
}

export type DriverStatus = "Available" | "On Duty" | "Off Duty" | "Suspended"

export interface Driver {
  id: string
  name: string
  licenseCategory: string
  licenseExpiry: string
  status: DriverStatus
  phone: string
  totalTrips: number
  completionRate: number
  safetyScore: number
  avatar?: string
}

export type TripStatus = "Draft" | "Dispatched" | "Completed" | "Cancelled"

export interface Trip {
  id: string
  vehicleId: string
  driverId: string
  cargoWeight: number
  pickupLocation: string
  deliveryLocation: string
  status: TripStatus
  createdAt: string
  dispatchedAt?: string
  completedAt?: string
  finalOdometer?: number
  distance?: number
}

export type MaintenanceType = "Oil Change" | "Tire Rotation" | "Brake Service" | "Engine Repair" | "Transmission" | "General Inspection" | "Body Work"

export interface MaintenanceLog {
  id: string
  vehicleId: string
  type: MaintenanceType
  cost: number
  date: string
  description: string
  completed: boolean
}

export interface FuelLog {
  id: string
  vehicleId: string
  liters: number
  cost: number
  date: string
  odometerAtFill: number
}

export interface Expense {
  id: string
  vehicleId: string
  category: string
  amount: number
  date: string
  description: string
}

// --- Mock Data ---

export const currentUser: User = {
  id: "u1",
  name: "Sarah Chen",
  email: "sarah@fleetops.com",
  role: "fleet_manager",
}

export const initialVehicles: Vehicle[] = [
  { id: "v1", name: "Atlas Heavy", model: "Volvo FH16", licensePlate: "FL-1001", capacity: 25000, odometer: 134500, status: "Available", type: "Truck", region: "Northeast", fuelType: "Diesel", year: 2022 },
  { id: "v2", name: "Swift Runner", model: "Mercedes Sprinter", licensePlate: "FL-1002", capacity: 3500, odometer: 87200, status: "On Trip", type: "Van", region: "Southeast", fuelType: "Diesel", year: 2023 },
  { id: "v3", name: "City Glider", model: "Toyota Camry", licensePlate: "FL-1003", capacity: 500, odometer: 45600, status: "Available", type: "Sedan", region: "Midwest", fuelType: "Hybrid", year: 2024 },
  { id: "v4", name: "Titan Hauler", model: "Kenworth T680", licensePlate: "FL-1004", capacity: 30000, odometer: 210300, status: "In Shop", type: "Truck", region: "West", fuelType: "Diesel", year: 2021 },
  { id: "v5", name: "Urban Scout", model: "Ford Transit", licensePlate: "FL-1005", capacity: 4000, odometer: 62100, status: "Available", type: "Van", region: "Northeast", fuelType: "Gasoline", year: 2023 },
  { id: "v6", name: "Eco Cruiser", model: "Tesla Model Y", licensePlate: "FL-1006", capacity: 800, odometer: 22300, status: "Available", type: "SUV", region: "West", fuelType: "Electric", year: 2024 },
  { id: "v7", name: "Road King", model: "Peterbilt 579", licensePlate: "FL-1007", capacity: 28000, odometer: 185000, status: "On Trip", type: "Truck", region: "Southeast", fuelType: "Diesel", year: 2022 },
  { id: "v8", name: "Metro Express", model: "RAM ProMaster", licensePlate: "FL-1008", capacity: 4500, odometer: 93400, status: "Retired", type: "Van", region: "Midwest", fuelType: "Gasoline", year: 2019 },
  { id: "v9", name: "Pathfinder", model: "Chevrolet Suburban", licensePlate: "FL-1009", capacity: 1000, odometer: 56700, status: "Available", type: "SUV", region: "Northeast", fuelType: "Gasoline", year: 2023 },
  { id: "v10", name: "Horizon Freight", model: "Freightliner Cascadia", licensePlate: "FL-1010", capacity: 32000, odometer: 245800, status: "Available", type: "Truck", region: "West", fuelType: "Diesel", year: 2021 },
  { id: "v11", name: "Nimble Dash", model: "Ford E-Transit", licensePlate: "FL-1011", capacity: 3800, odometer: 18900, status: "Available", type: "Van", region: "Southeast", fuelType: "Electric", year: 2024 },
  { id: "v12", name: "Granite Force", model: "Mack Anthem", licensePlate: "FL-1012", capacity: 27000, odometer: 178500, status: "On Trip", type: "Truck", region: "Midwest", fuelType: "Diesel", year: 2022 },
]

export const initialDrivers: Driver[] = [
  { id: "d1", name: "Marcus Johnson", licenseCategory: "CDL-A", licenseExpiry: "2027-03-15", status: "Available", phone: "+1-555-0101", totalTrips: 342, completionRate: 97.4, safetyScore: 94 },
  { id: "d2", name: "Elena Rodriguez", licenseCategory: "CDL-B", licenseExpiry: "2026-11-20", status: "On Duty", phone: "+1-555-0102", totalTrips: 218, completionRate: 99.1, safetyScore: 98 },
  { id: "d3", name: "James O'Brien", licenseCategory: "CDL-A", licenseExpiry: "2025-06-01", status: "Available", phone: "+1-555-0103", totalTrips: 456, completionRate: 95.8, safetyScore: 88 },
  { id: "d4", name: "Aisha Patel", licenseCategory: "Class C", licenseExpiry: "2027-09-10", status: "Available", phone: "+1-555-0104", totalTrips: 127, completionRate: 100, safetyScore: 96 },
  { id: "d5", name: "Robert Kim", licenseCategory: "CDL-A", licenseExpiry: "2024-12-31", status: "Suspended", phone: "+1-555-0105", totalTrips: 389, completionRate: 92.3, safetyScore: 72 },
  { id: "d6", name: "Fatima Hassan", licenseCategory: "CDL-B", licenseExpiry: "2026-08-05", status: "On Duty", phone: "+1-555-0106", totalTrips: 198, completionRate: 98.5, safetyScore: 95 },
  { id: "d7", name: "David Thompson", licenseCategory: "CDL-A", licenseExpiry: "2027-01-22", status: "Available", phone: "+1-555-0107", totalTrips: 521, completionRate: 96.2, safetyScore: 91 },
  { id: "d8", name: "Maria Santos", licenseCategory: "Class C", licenseExpiry: "2026-05-18", status: "Off Duty", phone: "+1-555-0108", totalTrips: 89, completionRate: 98.9, safetyScore: 97 },
]

export const initialTrips: Trip[] = [
  { id: "t1", vehicleId: "v2", driverId: "d2", cargoWeight: 2800, pickupLocation: "Atlanta, GA", deliveryLocation: "Miami, FL", status: "Dispatched", createdAt: "2026-02-18T08:00:00Z", dispatchedAt: "2026-02-18T09:30:00Z" },
  { id: "t2", vehicleId: "v7", driverId: "d6", cargoWeight: 22000, pickupLocation: "Charlotte, NC", deliveryLocation: "Nashville, TN", status: "Dispatched", createdAt: "2026-02-17T14:00:00Z", dispatchedAt: "2026-02-17T16:00:00Z" },
  { id: "t3", vehicleId: "v12", driverId: "d1", cargoWeight: 18500, pickupLocation: "Chicago, IL", deliveryLocation: "Detroit, MI", status: "Dispatched", createdAt: "2026-02-19T06:00:00Z", dispatchedAt: "2026-02-19T07:00:00Z" },
  { id: "t4", vehicleId: "v1", driverId: "d3", cargoWeight: 20000, pickupLocation: "Boston, MA", deliveryLocation: "Philadelphia, PA", status: "Completed", createdAt: "2026-02-10T10:00:00Z", dispatchedAt: "2026-02-10T12:00:00Z", completedAt: "2026-02-11T18:00:00Z", finalOdometer: 135100, distance: 500 },
  { id: "t5", vehicleId: "v5", driverId: "d7", cargoWeight: 3200, pickupLocation: "New York, NY", deliveryLocation: "Hartford, CT", status: "Completed", createdAt: "2026-02-12T09:00:00Z", dispatchedAt: "2026-02-12T10:00:00Z", completedAt: "2026-02-12T16:00:00Z", finalOdometer: 62600, distance: 180 },
  { id: "t6", vehicleId: "v3", driverId: "d4", cargoWeight: 400, pickupLocation: "Columbus, OH", deliveryLocation: "Indianapolis, IN", status: "Draft", createdAt: "2026-02-20T11:00:00Z" },
  { id: "t7", vehicleId: "v6", driverId: "d8", cargoWeight: 600, pickupLocation: "San Francisco, CA", deliveryLocation: "Los Angeles, CA", status: "Cancelled", createdAt: "2026-02-15T13:00:00Z" },
]

export const initialMaintenanceLogs: MaintenanceLog[] = [
  { id: "m1", vehicleId: "v4", type: "Engine Repair", cost: 4500, date: "2026-02-15", description: "Major engine overhaul - turbo replacement", completed: false },
  { id: "m2", vehicleId: "v1", type: "Oil Change", cost: 280, date: "2026-02-05", description: "Routine oil and filter change", completed: true },
  { id: "m3", vehicleId: "v7", type: "Tire Rotation", cost: 350, date: "2026-01-28", description: "Full tire rotation and alignment", completed: true },
  { id: "m4", vehicleId: "v10", type: "Brake Service", cost: 1200, date: "2026-02-10", description: "Brake pads and rotor replacement", completed: true },
  { id: "m5", vehicleId: "v2", type: "General Inspection", cost: 150, date: "2026-02-01", description: "Quarterly general inspection", completed: true },
  { id: "m6", vehicleId: "v8", type: "Transmission", cost: 6800, date: "2026-01-15", description: "Transmission rebuild", completed: true },
]

export const initialFuelLogs: FuelLog[] = [
  { id: "f1", vehicleId: "v1", liters: 320, cost: 480, date: "2026-02-18", odometerAtFill: 134500 },
  { id: "f2", vehicleId: "v2", liters: 85, cost: 127.50, date: "2026-02-17", odometerAtFill: 87200 },
  { id: "f3", vehicleId: "v7", liters: 350, cost: 525, date: "2026-02-16", odometerAtFill: 185000 },
  { id: "f4", vehicleId: "v5", liters: 95, cost: 152, date: "2026-02-14", odometerAtFill: 62100 },
  { id: "f5", vehicleId: "v10", liters: 380, cost: 570, date: "2026-02-12", odometerAtFill: 245800 },
  { id: "f6", vehicleId: "v12", liters: 340, cost: 510, date: "2026-02-11", odometerAtFill: 178500 },
  { id: "f7", vehicleId: "v4", liters: 310, cost: 465, date: "2026-02-08", odometerAtFill: 210300 },
  { id: "f8", vehicleId: "v9", liters: 75, cost: 120, date: "2026-02-06", odometerAtFill: 56700 },
  { id: "f9", vehicleId: "v1", liters: 315, cost: 472.50, date: "2026-02-02", odometerAtFill: 134000 },
  { id: "f10", vehicleId: "v3", liters: 45, cost: 72, date: "2026-02-01", odometerAtFill: 45600 },
  { id: "f11", vehicleId: "v7", liters: 345, cost: 517.50, date: "2026-01-30", odometerAtFill: 184500 },
  { id: "f12", vehicleId: "v2", liters: 80, cost: 120, date: "2026-01-28", odometerAtFill: 86800 },
]

export const initialExpenses: Expense[] = [
  { id: "e1", vehicleId: "v1", category: "Tolls", amount: 85, date: "2026-02-18", description: "Northeast corridor tolls" },
  { id: "e2", vehicleId: "v2", category: "Parking", amount: 45, date: "2026-02-17", description: "Overnight parking - Miami depot" },
  { id: "e3", vehicleId: "v4", category: "Towing", amount: 350, date: "2026-02-15", description: "Emergency tow to service center" },
  { id: "e4", vehicleId: "v7", category: "Tolls", amount: 120, date: "2026-02-16", description: "Interstate tolls" },
  { id: "e5", vehicleId: "v5", category: "Insurance", amount: 450, date: "2026-02-01", description: "Monthly insurance premium" },
  { id: "e6", vehicleId: "v10", category: "Registration", amount: 280, date: "2026-01-15", description: "Annual registration renewal" },
]

// Utility: generate unique ID
export function generateId(): string {
  return Math.random().toString(36).substring(2, 9)
}

// Chart data helpers
export function getMonthlyFuelData(fuelLogs: FuelLog[]) {
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
  const data = months.map((month, i) => {
    const monthLogs = fuelLogs.filter(l => {
      const d = new Date(l.date)
      return d.getMonth() === i
    })
    return {
      month,
      cost: monthLogs.reduce((sum, l) => sum + l.cost, 0),
      liters: monthLogs.reduce((sum, l) => sum + l.liters, 0),
    }
  })
  return data
}

export function getVehicleStatusCounts(vehicles: Vehicle[]) {
  return [
    { status: "Available", count: vehicles.filter(v => v.status === "Available").length, fill: "var(--color-chart-2)" },
    { status: "On Trip", count: vehicles.filter(v => v.status === "On Trip").length, fill: "var(--color-chart-1)" },
    { status: "In Shop", count: vehicles.filter(v => v.status === "In Shop").length, fill: "var(--color-chart-5)" },
    { status: "Retired", count: vehicles.filter(v => v.status === "Retired").length, fill: "var(--color-chart-4)" },
  ]
}

export function getTripStatusCounts(trips: Trip[]) {
  return [
    { status: "Draft", count: trips.filter(t => t.status === "Draft").length },
    { status: "Dispatched", count: trips.filter(t => t.status === "Dispatched").length },
    { status: "Completed", count: trips.filter(t => t.status === "Completed").length },
    { status: "Cancelled", count: trips.filter(t => t.status === "Cancelled").length },
  ]
}
