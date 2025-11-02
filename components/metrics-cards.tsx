import { IconTrendingDown, IconTrendingUp } from "@tabler/icons-react"

import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardAction,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

export function MetricsCards() {
  return (
    <div className="*:data-[slot=card]:from-primary/6 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card grid grid-cols-1 gap-5 px-5 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:shadow-xs lg:px-6 @md/main:grid-cols-2 @lg/main:grid-cols-4">
      {/* Column 1 */}
      <div className="flex flex-col gap-5">
        <Card className="@container/card h-72">
          <CardHeader>
            <CardDescription>Queue Wait Time</CardDescription>
            <CardTitle>Queue wait time graph</CardTitle>
          </CardHeader>
          <div className="flex-1 flex items-center justify-center text-muted-foreground">
            {/* Placeholder for graph */}
            <div className="w-full h-40 rounded bg-muted/10 border border-dashed border-muted/30 flex items-center justify-center">
              Queue wait time graph placeholder
            </div>
          </div>
        </Card>
        <Card className="@container/card h-74">
          <CardHeader>
            <CardDescription>Traffic Heatmap</CardDescription>
            <CardTitle>Traffic heatmap</CardTitle>
          </CardHeader>
          <div className="flex-1 flex items-center justify-center text-muted-foreground">
            <div className="w-full h-40 rounded bg-muted/10 border border-dashed border-muted/30 flex items-center justify-center">
              Traffic heatmap placeholder
            </div>
          </div>
        </Card>
      </div>

      {/* Column 2 */}
      <div className="flex flex-col gap-5">
        <Card className="@container/card h-47">
          <CardHeader>
            <CardDescription>Cook Time Trend</CardDescription>
            <CardTitle>Cook Time Trend</CardTitle>
          </CardHeader>
          <div className="flex-1 flex items-center justify-center text-muted-foreground">
            <div className="w-full h-20 rounded bg-muted/10 border border-dashed border-muted/30 flex items-center justify-center">
              Cook time trend graph placeholder
            </div>
          </div>
        </Card>
        <Card className="@container/card h-47">
          <CardHeader>
            <CardDescription>Abandon Rate</CardDescription>
            <CardTitle>Abandon Rate Over Time</CardTitle>
          </CardHeader>
          <div className="flex-1 flex items-center justify-center text-muted-foreground">
            <div className="w-full h-20 rounded bg-muted/10 border border-dashed border-muted/30 flex items-center justify-center">
              Abandon rate chart placeholder
            </div>
          </div>
        </Card>
        <Card className="@container/card h-47">
          <CardHeader>
            <CardDescription>Order Count vs POS</CardDescription>
            <CardTitle>Order Count vs POS Orders</CardTitle>
          </CardHeader>
          <div className="flex-1 flex items-center justify-center text-muted-foreground">
            <div className="w-full h-20 rounded bg-muted/10 border border-dashed border-muted/30 flex items-center justify-center">
              Sandwich count vs POS orders chart placeholder
            </div>
          </div>
        </Card>
      </div>

      {/* Column 3 */}
      <div className="flex flex-col gap-5">
        <Card className="@container/card h-100">
          <CardHeader>
            <CardDescription>Media</CardDescription>
            <CardTitle>Videos</CardTitle>
          </CardHeader>
          <div className="flex flex-col gap-3 p-3">
            <div className="w-full h-32 rounded bg-muted/10 border border-dashed border-muted/30 flex items-center justify-center">
              Video placeholder 1
            </div>
            <div className="w-full h-32 rounded bg-muted/10 border border-dashed border-muted/30 flex items-center justify-center">
              Video placeholder 2
            </div>
          </div>
        </Card>
        <Card className="@container/card h-45">
          <CardHeader>
            <CardDescription>Rush Hour Forecast</CardDescription>
            <CardTitle>Rush hour forecast</CardTitle>
          </CardHeader>
          <div className="flex-1 flex items-center justify-center text-muted-foreground">
            <div className="w-full h-20 rounded bg-muted/10 border border-dashed border-muted/30 flex items-center justify-center">
              Rush hour forecast graph placeholder
            </div>
          </div>
        </Card>
      </div>

      {/* Column 4 */}
      <div className="flex flex-col gap-5">
        <Card className="@container/card h-full min-h-[240px]">
          <CardHeader>
            <CardDescription>Suggestions & Alerts</CardDescription>
            <CardTitle>Suggestions</CardTitle>
          </CardHeader>
          <div className="flex-1 p-4 text-muted-foreground">
            {/* Empty box for suggestions and alerts */}
            <div className="w-full h-full rounded bg-muted/5 border border-dashed border-muted/20 flex items-center justify-center">
              No suggestions yet
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}
