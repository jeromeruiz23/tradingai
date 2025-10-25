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
