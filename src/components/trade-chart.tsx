"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import { Button } from "@/components/ui/button";
import { chartData } from "@/lib/mock-data";
import { Line, LineChart, CartesianGrid, XAxis, YAxis } from "recharts";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const chartConfig = {
  price: {
    label: "Price",
    color: "hsl(var(--accent))",
  },
} satisfies ChartConfig;

const availablePairs = ["BTC/USDT", "ETH/USDT", "SOL/USDT", "DOGE/USDT"];

export function TradeChart({ selectedPair, onPairChange }: { selectedPair: string; onPairChange: (pair: string) => void; }) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Market: {selectedPair}</CardTitle>
            <CardDescription>
              Visualizing real-time market trends
            </CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <Select value={selectedPair} onValueChange={onPairChange}>
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="Select Pair" />
              </SelectTrigger>
              <SelectContent>
                {availablePairs.map((pair) => (
                  <SelectItem key={pair} value={pair}>
                    {pair}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button variant="outline" size="sm">15m</Button>
            <Button variant="secondary" size="sm">1H</Button>
            <Button variant="outline" size="sm">4H</Button>
            <Button variant="outline" size="sm">1D</Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[250px] w-full">
          <LineChart
            accessibilityLayer
            data={chartData}
            margin={{
              top: 5,
              right: 10,
              left: 10,
              bottom: 0,
            }}
          >
            <CartesianGrid vertical={false} strokeDasharray="3 3" />
            <XAxis
              dataKey="time"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value) => value.slice(0, 5)}
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              domain={["dataMin - 100", "dataMax + 100"]}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent indicator="dot" />}
            />
            <Line
              dataKey="price"
              type="natural"
              stroke="var(--color-price)"
              strokeWidth={2}
              dot={false}
            />
          </LineChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
