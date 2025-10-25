"use client";

import * as React from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";

const availablePairs = ["BTCUSDT", "ETHUSDT", "SOLUSDT", "DOGEUSDT"];

export interface TradeChartHandle {
  takeScreenshot: () => Promise<string | undefined>;
}

export const TradeChart = React.forwardRef<
  TradeChartHandle,
  {
    selectedPair: string;
    onPairChange: (pair: string) => void;
  }
>(({ selectedPair, onPairChange }, ref) => {
  const container = React.useRef<HTMLDivElement>(null);
  const widgetRef = React.useRef<any>(null);

  React.useEffect(() => {
    if (container.current && !widgetRef.current && (window as any).TradingView) {
      const widget = new (window as any).TradingView.widget({
        autosize: true,
        symbol: `BINANCE:${selectedPair.replace("/", "")}PERP`,
        interval: "15",
        timezone: "Etc/UTC",
        theme: "dark",
        style: "1",
        locale: "en",
        enable_publishing: false,
        hide_side_toolbar: false,
        allow_symbol_change: true,
        container_id: "tradingview-chart-container",
      });
      widgetRef.current = widget;
    }
  }, []); // Run only once on mount

  React.useEffect(() => {
    if (widgetRef.current && widgetRef.current.chart) {
      widgetRef.current.chart().setSymbol(`BINANCE:${selectedPair.replace('/', '')}PERP`, () => {});
    }
  }, [selectedPair]);

  React.useImperativeHandle(ref, () => ({
    async takeScreenshot() {
      if (widgetRef.current) {
        try {
          const canvas = await widgetRef.current.takeScreenshot();
          return canvas.toDataURL("image/png");
        } catch (error) {
          console.error("Error taking screenshot:", error);
          return undefined;
        }
      }
      return undefined;
    },
  }));

  const handlePairChange = (pair: string) => {
    onPairChange(pair.replace('USDT', '/USDT'));
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Market: {selectedPair} (Perpetual)</CardTitle>
            <CardDescription>
              Visualizing real-time market trends for perpetual futures.
            </CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <Select value={selectedPair.replace('/', '')} onValueChange={handlePairChange}>
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="Select Pair" />
              </SelectTrigger>
              <SelectContent>
                {availablePairs.map((pair) => (
                  <SelectItem key={pair} value={pair}>
                    {pair.replace('USDT', '/USDT')}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button variant="outline" size="sm">
              15m
            </Button>
            <Button variant="secondary" size="sm">
              1H
            </Button>
            <Button variant="outline" size="sm">
              4H
            </Button>
            <Button variant="outline" size="sm">
              1D
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="h-[400px] w-full p-0">
        <div
          id="tradingview-chart-container"
          ref={container}
          className="h-full w-full"
        />
      </CardContent>
    </Card>
  );
});

TradeChart.displayName = "TradeChart";
