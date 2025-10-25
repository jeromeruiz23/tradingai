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
import { cn } from "@/lib/utils";

const availablePairs = [
  "BTCUSDT", "ETHUSDT", "SOLUSDT", "DOGEUSDT", "BNBUSDT", "XRPUSDT", 
  "ADAUSDT", "LINKUSDT", "MATICUSDT", "AVAXUSDT", "DOTUSDT", "SHIBUSDT", 
  "TRXUSDT", "LTCUSDT", "BCHUSDT", "UNIUSDT", "AAVEUSDT", "FTMUSDT", 
  "ATOMUSDT", "NEARUSDT", "ALGOUSDT", "XLMUSDT", "VETUSDT", "FILUSDT"
];
const timeframes = [
  { value: "15", label: "15m" },
  { value: "60", label: "1H" },
  { value: "240", label: "4H" },
  { value: "D", label: "1D" },
];

export const TradeChart = React.memo(
  ({
    selectedPair,
    onPairChange,
  }: {
    selectedPair: string;
    onPairChange: (pair: string) => void;
  }) => {
    const container = React.useRef<HTMLDivElement>(null);
    const widgetRef = React.useRef<any>(null);
    const [selectedTimeframe, setSelectedTimeframe] = React.useState("15");
    const [isChartReady, setChartReady] = React.useState(false);

    React.useEffect(() => {
      const createWidget = () => {
        if (
          container.current &&
          (window as any).TradingView &&
          (window as any).Datafeeds &&
          !widgetRef.current
        ) {
          const widget = new (window as any).TradingView.widget({
            autosize: true,
            symbol: `BINANCE:${selectedPair.replace("/", "")}PERP`,
            interval: selectedTimeframe,
            timezone: "Etc/UTC",
            theme: "dark",
            style: "1",
            locale: "en",
            enable_publishing: false,
            hide_side_toolbar: false,
            allow_symbol_change: true,
            container_id: "tradingview-chart-container",
            disabled_features: ["use_localstorage_for_settings", "widget_logo_sent_to_server", "symbol_search_hot_key", "telemetry"],
            studies: [
              "RSI@tv-basicstudies",
              "MACD@tv-basicstudies",
            ],
            datafeed: new (window as any).Datafeeds.UDFCompatibleDatafeed(
              "https://demo_feed.tradingview.com", 
              {
                supported_resolutions: ["1", "5", "15", "30", "60", "240", "D", "W", "M"]
              }
            ),
          });

          widget.onChartReady(() => {
            widgetRef.current = widget;
            setChartReady(true);
          });
        }
      }

      if (!(window as any).TradingView) {
        const tvScript = document.createElement('script');
        tvScript.src = 'https://s3.tradingview.com/tv.js';
        tvScript.async = true;
        document.body.appendChild(tvScript);

        tvScript.onload = () => {
            const datafeedScript = document.createElement('script');
            datafeedScript.src = 'https://s3.tradingview.com/datafeeds/udf/dist/bundle.js';
            datafeedScript.async = true;
            document.body.appendChild(datafeedScript);
            
            datafeedScript.onload = createWidget;
        };

        return () => {
          if (widgetRef.current) {
            widgetRef.current.remove();
            widgetRef.current = null;
          }
          // Note: Intentionally not removing scripts to avoid re-adding them on fast navigations
        };
      } else {
        createWidget();
      }
      
    }, []);
    
    React.useEffect(() => {
      if (isChartReady && widgetRef.current) {
         widgetRef.current.chart().setSymbol(`BINANCE:${selectedPair.replace('/', '')}PERP`, () => {});
      }
    }, [selectedPair, isChartReady]);

     React.useEffect(() => {
      if (isChartReady && widgetRef.current) {
        widgetRef.current.chart().setResolution(selectedTimeframe, () => {});
      }
    }, [selectedTimeframe, isChartReady]);

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
               {timeframes.map((tf) => (
                <Button
                  key={tf.value}
                  variant={selectedTimeframe === tf.value ? "secondary" : "outline"}
                  size="sm"
                  onClick={() => setSelectedTimeframe(tf.value)}
                  className={cn(selectedTimeframe === tf.value && "text-foreground")}
                >
                  {tf.label}
                </Button>
              ))}
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
  }
);

TradeChart.displayName = "TradeChart";
