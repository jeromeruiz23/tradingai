import type { Trade } from "./types";

// This file is no longer used for chart data, but we'll keep the structure
// in case we need to revert or for other parts of the app.
export const chartData = [];


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

const getBasePrice = (ticker: string) => {
  switch (ticker) {
    case 'BTCUSDT':
      return 68000;
    case 'ETHUSDT':
      return 3500;
    case 'SOLUSDT':
      return 150;
    case 'DOGEUSDT':
      return 0.15;
    default:
      return 50000;
  }
}

export const mockBinanceData = (ticker: string) => {
    const basePrice = getBasePrice(ticker);
    // Simulate a price fluctuation of +/- 1%
    const price = basePrice * (1 + (Math.random() - 0.5) * 0.02);

    return JSON.stringify({
    "ticker": ticker,
    "price": price.toFixed(ticker === 'DOGEUSDT' ? 4 : 2),
    "volume": (Math.random() * 10000 + 5000).toFixed(1),
    "high_24h": (basePrice * 1.05).toFixed(2),
    "low_24h": (basePrice * 0.95).toFixed(2),
    "indicators": {
        "RSI": (Math.random() * (70 - 30) + 30).toFixed(1),
        "MACD": (Math.random() * 100 - 50).toFixed(1),
        "MovingAverage_50": (basePrice * (1 + (Math.random() - 0.5) * 0.01)).toFixed(2)
    }
})};
