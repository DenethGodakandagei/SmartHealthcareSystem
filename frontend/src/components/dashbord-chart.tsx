"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"

const data = [
  { date: "Oct 1", admissions: 45, discharges: 38 },
  { date: "Oct 2", admissions: 52, discharges: 42 },
  { date: "Oct 3", admissions: 48, discharges: 45 },
  { date: "Oct 4", admissions: 61, discharges: 50 },
  { date: "Oct 5", admissions: 55, discharges: 48 },
  { date: "Oct 6", admissions: 58, discharges: 52 },
  { date: "Oct 7", admissions: 62, discharges: 55 },
]

export function DashboardChart() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Patient Flow Trends</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={data}>
            <XAxis
              dataKey="date"
              stroke="hsl(var(--muted-foreground))"
              fontSize={12}
              tickLine={false}
              axisLine={false}
            />
            <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
            <Tooltip
              contentStyle={{
                backgroundColor: "hsl(var(--card))",
                border: "1px solid hsl(var(--border))",
                borderRadius: "var(--radius)",
              }}
            />
            <Line type="monotone" dataKey="admissions" stroke="hsl(var(--chart-1))" strokeWidth={2} dot={false} />
            <Line type="monotone" dataKey="discharges" stroke="hsl(var(--chart-2))" strokeWidth={2} dot={false} />
          </LineChart>
        </ResponsiveContainer>
        <div className="mt-4 flex items-center justify-center gap-6">
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 rounded-full bg-chart-1" />
            <span className="text-sm text-muted-foreground">Admissions</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 rounded-full bg-chart-2" />
            <span className="text-sm text-muted-foreground">Discharges</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
