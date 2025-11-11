"use client"

import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

import { Timer, Flame, Wrench, Users, Clock, Activity } from "lucide-react"

import { AreaChart, Area } from "recharts"
import { ChartContainer } from "@/components/ui/chart"
import mockData from "../data/mock-Data"

export function SectionCards() {
  return (
    <div className="*:data-[slot=card]:from-primary/6 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card grid grid-cols-1 gap-4 px-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:shadow-xs lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-6">
      <Card className="@container/card">
        <CardHeader>
          <div className="flex items-center gap-2 text-muted-foreground">
            <Timer className="size-4 text-primary/80" aria-hidden="true" />
            <CardDescription>Queue Wait Time</CardDescription>
          </div>
          <CardTitle className="text-xl font-semibold tabular-nums @[150px]/card:text-3xl">
            3 m 12s
          </CardTitle>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          {/* <div className="line-clamp-1 flex gap-2 font-medium">
            Trending up this month <IconTrendingUp className="size-4" />
          </div>
          <div className="text-muted-foreground">
            Visitors for the last 6 months
          </div> */}
        </CardFooter>
      </Card>
      <Card className="@container/card">
        <CardHeader>
          <div className="flex items-center gap-2 text-muted-foreground">
            <Flame className="size-4 text-primary/80" aria-hidden="true" />
            <CardDescription>Cook Time</CardDescription>
          </div>
          <CardTitle className="text-xl font-semibold tabular-nums @[150px]/card:text-3xl">
            5m 17s
          </CardTitle>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          {/* <div className="line-clamp-1 flex gap-2 font-medium">
            Down 20% this period <IconTrendingDown className="size-4" />
          </div>
          <div className="text-muted-foreground">
            Acquisition needs attention
          </div> */}
        </CardFooter>
      </Card>
      <Card className="@container/card">
        <CardHeader>
          <div className="flex items-center gap-2 text-muted-foreground">
            <Wrench className="size-4 text-primary/80" aria-hidden="true" />
            <CardDescription>Assembly Time</CardDescription>
          </div>
          <CardTitle className="text-xl font-semibold tabular-nums @[150px]/card:text-3xl">
            2 Min 50s
          </CardTitle>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          {/* <div className="line-clamp-1 flex gap-2 font-medium">
            Strong user retention <IconTrendingUp className="size-4" />
          </div>
          <div className="text-muted-foreground">Engagement exceed targets</div> */}
        </CardFooter>
      </Card>
      <Card className="@container/card">
        <CardHeader>
          <div className="flex items-center gap-2 text-muted-foreground">
            <Users className="size-4 text-primary/80" aria-hidden="true" />
            <CardDescription>Total Customer Wait</CardDescription>
          </div>
          <CardTitle className="text-xl font-semibold tabular-nums @[150px]/card:text-3xl">
            11m 29s
          </CardTitle>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          {/* <div className="line-clamp-1 flex gap-2 font-medium">
            Steady performance increase <IconTrendingUp className="size-4" />
          </div>
          <div className="text-muted-foreground">Meets growth projections</div> */}
        </CardFooter>
      </Card>
      <Card className="@container/card">
        <CardHeader>
          <div className="flex items-center gap-2 text-muted-foreground">
            <Clock className="size-4 text-primary/80" aria-hidden="true" />
            <CardDescription>Avg Dwell After</CardDescription>
          </div>
          <CardTitle className="text-xl font-semibold tabular-nums @[150px]/card:text-3xl">
            0min 41s
          </CardTitle>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          {/* <div className="line-clamp-1 flex gap-2 font-medium">
            Steady performance increase <IconTrendingUp className="size-4" />
          </div>
          <div className="text-muted-foreground">Meets growth projections</div> */}
        </CardFooter>
      </Card>
      <Card className="@container/card relative overflow-hidden">
        {/* Background sparkline */}
        <ChartContainer
          id="orders-spark"
          className="pointer-events-none absolute inset-0 aspect-auto h-full [mask-image:linear-gradient(to_bottom,rgba(0,0,0,0.5),rgba(0,0,0,0.9))]"
          config={{ series: { color: "hsl(var(--primary))" } }}
        >
          <AreaChart data={mockData} margin={{ top: 18, right: 8, left: 8, bottom: 18 }}>
            <Area type="monotone" dataKey="orders_per_hour" stroke="var(--primary)" strokeWidth={2.5} strokeOpacity={0.95} fill="var(--primary)" fillOpacity={0.2} dot={false} />
          </AreaChart>
        </ChartContainer>

        <CardHeader className="relative">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Activity className="size-4 text-primary/80" aria-hidden="true" />
            <CardDescription>Orders per Hour</CardDescription>
          </div>
          <CardTitle className="text-xl font-semibold tabular-nums @[150px]/card:text-3xl">
            63
          </CardTitle>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          {/* <div className="line-clamp-1 flex gap-2 font-medium">
            Steady performance increase <IconTrendingUp className="size-4" />
          </div>
          <div className="text-muted-foreground">Meets growth projections</div> */}
        </CardFooter>
      </Card>
    </div>
  )
}
