import { cn } from "@/lib/utils"

const statusColors: Record<string, string> = {
  // Vehicle statuses
  Available: "bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border-emerald-500/20",
  "On Trip": "bg-sky-500/15 text-sky-700 dark:text-sky-400 border-sky-500/20",
  "In Shop": "bg-amber-500/15 text-amber-700 dark:text-amber-400 border-amber-500/20",
  Retired: "bg-zinc-500/15 text-zinc-600 dark:text-zinc-400 border-zinc-500/20",
  // Driver statuses
  "On Duty": "bg-sky-500/15 text-sky-700 dark:text-sky-400 border-sky-500/20",
  "Off Duty": "bg-zinc-500/15 text-zinc-600 dark:text-zinc-400 border-zinc-500/20",
  Suspended: "bg-red-500/15 text-red-700 dark:text-red-400 border-red-500/20",
  // Trip statuses
  Draft: "bg-zinc-500/15 text-zinc-600 dark:text-zinc-400 border-zinc-500/20",
  Dispatched: "bg-sky-500/15 text-sky-700 dark:text-sky-400 border-sky-500/20",
  Completed: "bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border-emerald-500/20",
  Cancelled: "bg-red-500/15 text-red-700 dark:text-red-400 border-red-500/20",
}

interface StatusBadgeProps {
  status: string
  className?: string
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium",
        statusColors[status] || "bg-secondary text-secondary-foreground border-border",
        className
      )}
    >
      {status}
    </span>
  )
}
