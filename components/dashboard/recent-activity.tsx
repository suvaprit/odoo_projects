"use client"

import { useFleet } from "@/lib/fleet-context"
import { StatusBadge } from "@/components/status-badge"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

export function RecentActivity() {
  const { trips, vehicles, drivers } = useFleet()

  const recentTrips = [...trips]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5)

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Recent Trips</CardTitle>
        <CardDescription>Latest trip activity across the fleet</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Vehicle</TableHead>
              <TableHead>Driver</TableHead>
              <TableHead>Route</TableHead>
              <TableHead>Cargo</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {recentTrips.map((trip) => {
              const vehicle = vehicles.find(v => v.id === trip.vehicleId)
              const driver = drivers.find(d => d.id === trip.driverId)
              return (
                <TableRow key={trip.id}>
                  <TableCell className="font-medium">{vehicle?.name || "Unknown"}</TableCell>
                  <TableCell>{driver?.name || "Unknown"}</TableCell>
                  <TableCell className="text-muted-foreground">
                    {trip.pickupLocation} &rarr; {trip.deliveryLocation}
                  </TableCell>
                  <TableCell className="font-mono text-sm">
                    {(trip.cargoWeight / 1000).toFixed(1)}t
                  </TableCell>
                  <TableCell>
                    <StatusBadge status={trip.status} />
                  </TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
