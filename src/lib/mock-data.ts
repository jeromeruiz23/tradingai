import type { Trade } from "./types";

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
