"use client"
import { AreaChart, Area, CartesianGrid, XAxis, YAxis, Tooltip } from "recharts"
import { ChartContainer, ChartTooltipContent } from "@/components/ui/chart"
import mockData from "../data/mock-Data"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

export function MetricsCards() {
  return (
  <div className="bento-box grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 auto-rows-[minmax(160px,auto)] gap-4 px-4 py-6 rounded-3xl">
      {/* 1. Queue Wait Time */}
  <Card className="@container/card flex flex-col overflow-hidden">
        <CardHeader className="pb-2 pt-4 px-6">
          <CardDescription>Queue Wait Time</CardDescription>
          <CardTitle>Queue wait time graph</CardTitle>
        </CardHeader>
        <ChartContainer
          id="queue-wait"
          className="relative w-full flex-1 min-h-[90px] px-2"
          config={{ series: { color: "var(--primary)" } }}
        >
          {/* Queue wait time in minutes, Y axis shows 2min, 5min, 12min markers */}
          <AreaChart data={mockData} margin={{ top: 0, right: 10, left: -30, bottom: 20 }}>
            <XAxis
              dataKey="id"
              type="number"
              domain={[1, 24]}
              ticks={[1, 4, 8, 12, 16, 20, 24]}
              tickFormatter={(v) => `${v}h`}
              axisLine={{ stroke: 'var(--primary)', opacity: 0.2 }}
              tickLine={false}
              allowDataOverflow={true}
            />
            <YAxis
              domain={[0, 720]}
              ticks={[120, 300, 720]}
              width={60}
              tickFormatter={(v) => {
                const mins = Math.round(v / 60)
                return `${mins}m`
              }}
              stroke="var(--primary)"
              fontSize={12}
              tickLine={false}
              axisLine={{ stroke: 'var(--primary)', opacity: 0.2 }}
              tick={{ fontWeight: 600 }}
            />
            {/* reference lines */}
            <CartesianGrid horizontal vertical={false} strokeDasharray="3 3" stroke="var(--primary)" opacity={0.1} y={120} />
            <CartesianGrid horizontal vertical={false} strokeDasharray="3 3" stroke="var(--primary)" opacity={0.1} y={300} />
            <CartesianGrid horizontal vertical={false} strokeDasharray="3 3" stroke="var(--primary)" opacity={0.1} y={720} />
            <Tooltip
              content={
                <ChartTooltipContent
                  className="!bg-black/90 !text-white border-0 z-50 shadow-lg backdrop-blur-sm [&_.text-muted-foreground]:!text-white [&_.text-foreground]:!text-white"
                  style={{ backgroundColor: 'rgba(0,0,0,0.9)', color: '#fff' }}
                  formatter={(value: any) => `${value}m`}
                  labelFormatter={(value: any, payload: any) => {
                    const item = Array.isArray(payload) && payload.length ? payload[0] : null
                    const key = item?.dataKey || item?.name || "value"
                    return String(key)
                  }}
                />
              }
            />
            <Area type="monotone" dataKey="average_customer_wait" stroke="var(--primary)" strokeOpacity={0.95} fill="var(--primary)" fillOpacity={0.2} strokeWidth={2.5} dot={false} />
          </AreaChart>
        </ChartContainer>
      </Card>

      {/* 2. Cook Time Trend */}
  <Card className="@container/card flex flex-col overflow-hidden">
        <CardHeader className="pb-2 pt-4 px-6">
          <CardDescription>Cook Time Trend</CardDescription>
          <CardTitle>Cook Time Trend</CardTitle>
        </CardHeader>
        <ChartContainer
          id="cook-time"
          className="relative w-full flex-1 min-h-[90px] px-2"
          config={{ series: { color: "var(--primary)" } }}
        >
          <AreaChart data={mockData} margin={{ top: 0, right: 0, left: 0, bottom: 12 }}>
            <XAxis dataKey="id" type="number" tickFormatter={(v) => String(v)} axisLine={{ stroke: 'var(--primary)', opacity: 0.2 }} tickLine={false} />
            <YAxis
              domain={[0, 600]}
              ticks={[120, 240, 360, 480, 600]}
              width={40}
              tickFormatter={(v) => `${Math.round(v / 60)}m`}
              stroke="var(--primary)"
              fontSize={11}
              tickLine={false}
              axisLine={{ stroke: 'var(--primary)', opacity: 0.2 }}
              tick={{ fontWeight: 600 }}
            />
            <Tooltip
              content={
                <ChartTooltipContent
                  className="bg-black text-white border-0 opacity-100"
                  style={{ backgroundColor: '#000', color: '#fff' }}
                  formatter={(value: any) => String(value)}
                  labelFormatter={(value: any, payload: any) => {
                    const item = Array.isArray(payload) && payload.length ? payload[0] : null
                    const key = item?.dataKey || item?.name || "value"
                    return String(key)
                  }}
                />
              }
            />
            <Area type="monotone" dataKey="cook_time" stroke="var(--primary)" strokeOpacity={0.95} fill="var(--primary)" fillOpacity={0.2} strokeWidth={2.5} dot={false} />
          </AreaChart>
        </ChartContainer>
      </Card>

      {/* 3. Suggestions */}
  <Card className="@container/card flex flex-col overflow-hidden">
        <CardHeader className="pb-2 pt-4 px-6">
          <CardDescription>Suggestions & Alerts</CardDescription>
          <CardTitle>Suggestions</CardTitle>
        </CardHeader>
        <CardContent className="relative z-10 flex-1 text-muted-foreground">
          <div className="w-full h-full min-h-[90px] rounded bg-muted/5 border border-dashed border-muted/20 flex items-center justify-center">
            No suggestions yet
          </div>
        </CardContent>
      </Card>

      {/* 4. Rush Hour Forecast */}
  <Card className="@container/card flex flex-col overflow-hidden">
        <CardHeader className="pb-2 pt-4 px-6">
          <CardDescription>Rush Hour Forecast</CardDescription>
          <CardTitle>Rush hour forecast</CardTitle>
        </CardHeader>
        <ChartContainer
          id="rush-hour"
          className="relative w-full flex-1 min-h-[90px] px-2"
          config={{ series: { color: "var(--primary)" } }}
        >
          <AreaChart data={mockData} margin={{ top: 0, right: 0, left: 0, bottom: 12 }}>
            <XAxis dataKey="id" type="number" tickFormatter={(v) => String(v)} axisLine={{ stroke: 'var(--primary)', opacity: 0.2 }} tickLine={false} />
            <YAxis
              domain={[9, 17]}
              ticks={[9, 11, 13, 15, 17]}
              width={40}
              tickFormatter={(v) => `${v}:00`}
              stroke="var(--primary)"
              fontSize={11}
              tickLine={false}
              axisLine={{ stroke: 'var(--primary)', opacity: 0.2 }}
              tick={{ fontWeight: 600 }}
            />
            <Tooltip
              content={
                <ChartTooltipContent
                  className="bg-black text-white border-0 opacity-100"
                  style={{ backgroundColor: '#000', color: '#fff' }}
                  formatter={(value: any) => String(value)}
                  labelFormatter={(value: any, payload: any) => {
                    const item = Array.isArray(payload) && payload.length ? payload[0] : null
                    const key = item?.dataKey || item?.name || "value"
                    return String(key)
                  }}
                />
              }
            />
            <Area type="monotone" dataKey="orders_per_hour" stroke="var(--primary)" strokeOpacity={0.95} fill="var(--primary)" fillOpacity={0.2} strokeWidth={2.5} dot={false} />
          </AreaChart>
        </ChartContainer>
      </Card>

      {/* 5. Cameras (like Pickup Zone / Front Counter) */}
  <Card className="@container/card flex flex-col overflow-hidden">
        <CardHeader>
          <CardDescription>Cameras</CardDescription>
          <CardTitle>Pickup & Front</CardTitle>
        </CardHeader>
        <CardContent className="relative z-10 flex flex-col gap-3">
          <div className="w-full h-20 rounded bg-muted/10 border border-dashed border-muted/30 flex items-center justify-center">Pickup Zone</div>
          <div className="w-full h-20 rounded bg-muted/10 border border-dashed border-muted/30 flex items-center justify-center">Front Counter</div>
        </CardContent>
      </Card>

      

      {/* 5. Traffic Heatmap */}
  <Card className="@container/card flex flex-col overflow-hidden">
        <CardHeader>
          <CardDescription>Traffic Heatmap</CardDescription>
          <CardTitle>Traffic heatmap</CardTitle>
        </CardHeader>
        <CardContent className="relative z-10 flex-1 flex items-center justify-center text-muted-foreground">
          <div className="w-full h-20 rounded bg-muted/10 border border-dashed border-muted/30 flex items-center justify-center">
            Traffic heatmap placeholder
          </div>
        </CardContent>
      </Card>

      {/* 6. Abandon Rate */}
  <Card className="@container/card flex flex-col overflow-hidden">
        <CardHeader className="pb-2 pt-4 px-6">
          <CardDescription>Abandon Rate</CardDescription>
          <CardTitle>Abandon Rate Over Time</CardTitle>
        </CardHeader>
        <ChartContainer
          id="abandon-rate"
          className="relative w-full flex-1 min-h-[90px] px-2"
          config={{ series: { color: "var(--primary)" } }}
        >
          <AreaChart data={mockData} margin={{ top: 0, right: 0, left: 0, bottom: 12 }}>
            <XAxis dataKey="id" type="number" tickFormatter={(v) => `${v}h`} axisLine={{ stroke: 'var(--primary)', opacity: 0.2 }} tickLine={false} />
            <YAxis
              domain={[0, 100]}
              ticks={[0, 25, 50, 75, 100]}
              width={40}
              tickFormatter={(v) => `${v}%`}
              stroke="var(--primary)"
              fontSize={11}
              tickLine={false}
              axisLine={{ stroke: 'var(--primary)', opacity: 0.2 }}
              tick={{ fontWeight: 600 }}
            />
            <Tooltip
              content={
                <ChartTooltipContent
                  className="bg-black text-white border-0 opacity-100"
                  style={{ backgroundColor: '#000', color: '#fff' }}
                  formatter={(value: any) => String(value)}
                  labelFormatter={(value: any, payload: any) => {
                    const item = Array.isArray(payload) && payload.length ? payload[0] : null
                    const key = item?.dataKey || item?.name || "value"
                    return String(key)
                  }}
                />
              }
            />
            <Area type="monotone" dataKey="abandon_rate" stroke="var(--primary)" strokeOpacity={0.95} fill="var(--primary)" fillOpacity={0.2} strokeWidth={2.5} dot={false} />
          </AreaChart>
        </ChartContainer>
      </Card>

      {/* 7. Sandwich Count vs POS */}
  <Card className="@container/card flex flex-col overflow-hidden">
        <CardHeader>
          <CardDescription>Order Count vs POS</CardDescription>
          <CardTitle>Order Count vs POS Orders</CardTitle>
        </CardHeader>
        <CardContent className="relative z-10 flex-1 flex items-center justify-center text-muted-foreground">
          <div className="w-full h-16 rounded bg-muted/10 border border-dashed border-muted/30 flex items-center justify-center">
            Sandwich count vs POS orders chart placeholder
          </div>
        </CardContent>
      </Card>

      
    </div>
  )
}