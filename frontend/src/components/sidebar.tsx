"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Activity, FileText, BarChart3 } from "lucide-react"
import { cn } from "@/lib/utils"

const navigation = [
  {
    name: "Dashboard",
    href: "/",
    icon: Activity,
  },
  {
    name: "Generate Reports",
    href: "/generate",
    icon: FileText,
  },
  {
    name: "View Report",
    href: "/report",
    icon: BarChart3,
  },
]

export function Sidebar() {
  const pathname = usePathname()

  return (
    <div className="flex h-screen w-64 flex-col border-r border-border bg-sidebar">
      <div className="flex h-16 items-center border-b border-sidebar-border px-6">
        <h1 className="text-lg font-semibold text-sidebar-foreground">Smart Healthcare</h1>
      </div>
      <nav className="flex-1 space-y-1 px-3 py-4">
        <div className="mb-4">
          <p className="px-3 text-xs font-medium text-muted-foreground uppercase tracking-wider">Reports</p>
        </div>
        {navigation.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                isActive
                  ? "bg-sidebar-accent text-sidebar-accent-foreground"
                  : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
              )}
            >
              <item.icon className="h-5 w-5" />
              {item.name}
            </Link>
          )
        })}
      </nav>
      <div className="border-t border-sidebar-border p-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground">
            HM
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium text-sidebar-foreground">Healthcare Manager</p>
            <p className="text-xs text-muted-foreground">manager@hospital.com</p>
          </div>
        </div>
      </div>
    </div>
  )
}
