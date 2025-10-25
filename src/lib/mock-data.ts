import type { Trade } from "./types";

// Generate more realistic-looking chart data
const generateChartData = () => {
  const data = [];
  let price = 45000;
  const startTime = new Date();
  startTime.setHours(startTime.getHours() - 50);

  for (let i = 0; i < 50; i++) {
    const newPrice =
      price +
      Math.sin(i / 5) * 500 + // A sine wave for the general trend
      (Math.random() - 0.5) * 300; // Some noise

    const time = new Date(startTime.getTime() + i * 12 * 60 * 1000); // 12-minute intervals

    data.push({
      time: time.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
      price: parseFloat(newPrice.toFixed(2)),
    });
    price = newPrice;
  }
  return data;
};

export const chartData = generateChartData();


export const initialTrades: Trade[] = [
  {
    id: '1',
    pair: 'BTC/USDT',
    type: 'Buy',
    entryPrice: 44850.25,
    stopLoss: 44500,
    takeProfit: 45500,
    lotSize: 0.0005,
    status: 'Closed',
    pnl: 25.50,
    reasoning: 'Breakout above local resistance.',
  },
  {
    id: '2',
    pair: 'BTC/USDT',
    type: 'Sell',
    entryPrice: 45100.75,
    stopLoss: 45400,
    takeProfit: 44000,
    lotSize: 0.0006,
    status: 'Closed',
    pnl: -18.75,
    reasoning: 'Rejection from moving average.',
  },
];

export const mockBinanceData = (ticker: string) => JSON.stringify({
    "ticker": ticker,
    "price": "45050.50",
    "volume": "10000.5",
    "high_24h": "46000.00",
    "low_24h": "44000.00",
    "indicators": {
        "RSI": "45.5",
        "MACD": "-25.3",
        "MovingAverage_50": "45200.00"
    }
});

const chartSvg = `
<svg width="400" height="200" viewBox="0 0 400 200" xmlns="http://www.w3.org/2000/svg" style="background-color: #212121; border-radius: 8px;">
  <defs>
    <linearGradient id="gradient" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" style="stop-color: hsl(122 39% 49% / 0.2);" />
      <stop offset="100%" style="stop-color: hsl(122 39% 49% / 0);" />
    </linearGradient>
  </defs>
  <g transform="translate(0, 180) scale(1, -1)">
    <polyline fill="url(#gradient)" stroke="hsl(122 39% 49%)" stroke-width="2" points="
      0,60 20,65 40,55 60,70 80,80 100,75 120,90 140,100 160,95 180,110 200,120 220,115 240,130 260,125 280,140 300,135 320,150 340,145 360,160 380,155 400,170
    "/>
  </g>
</svg>
`;

export const DUMMY_CHART_IMAGE_DATA_URI = `data:image/svg+xml;base64,${Buffer.from(chartSvg).toString('base64')}`;
