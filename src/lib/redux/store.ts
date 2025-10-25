import { configureStore, createSlice, PayloadAction, combineReducers } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage'; // defaults to localStorage for web
import type { Trade } from '@/lib/types';

// Initial trades slice
const initialTrades: Trade[] = [
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
    pair: 'ETH/USDT',
    type: 'Sell',
    entryPrice: 2400.50,
    stopLoss: 2450,
    takeProfit: 2300,
    lotSize: 0.01,
    status: 'Closed',
    pnl: -50.50,
    reasoning: 'Testing support level.',
  },
   {
    id: '3',
    pair: 'SOL/USDT',
    type: 'Buy',
    entryPrice: 102.10,
    stopLoss: 98,
    takeProfit: 110,
    lotSize: 0.2,
    status: 'Closed',
    pnl: 15.80,
    reasoning: 'Following strong uptrend.',
  },
  {
    id: '4',
    pair: 'DOGE/USDT',
    type: 'Sell',
    entryPrice: 0.1580,
    stopLoss: 0.1650,
    takeProfit: 0.1500,
    lotSize: 100,
    status: 'Closed',
    pnl: 8,
    reasoning: 'Rejection from key resistance.',
  },
  {
    id: '5',
    pair: 'BNB/USDT',
    type: 'Buy',
    entryPrice: 305.5,
    stopLoss: 300,
    takeProfit: 315,
    lotSize: 0.1,
    status: 'Closed',
    pnl: 9.5,
    reasoning: 'Momentum shift on 1H chart.',
  },
  {
    id: '6',
    pair: 'XRP/USDT',
    type: 'Sell',
    entryPrice: 0.6200,
    stopLoss: 0.6300,
    takeProfit: 0.6000,
    lotSize: 50,
    status: 'Closed',
    pnl: -50,
    reasoning: 'Failed to break resistance.',
  },
];

interface TradesState {
  trades: Trade[];
}

const initialState: TradesState = {
  trades: initialTrades,
};

const tradesSlice = createSlice({
  name: 'trades',
  initialState,
  reducers: {
    addTrade: (state, action: PayloadAction<Trade>) => {
      state.trades.unshift(action.payload);
    },
    closeTrade: (state, action: PayloadAction<{ tradeId: string; pnl: number }>) => {
      const { tradeId, pnl } = action.payload;
      const trade = state.trades.find((t) => t.id === tradeId);
      if (trade) {
        trade.status = 'Closed';
        trade.pnl = pnl;
      }
    },
  },
});

export const { addTrade, closeTrade } = tradesSlice.actions;

// Redux Persist config
const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['trades'], // only trades will be persisted
};

const rootReducer = combineReducers({
  trades: tradesSlice.reducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignore these action types
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
        // Ignore these field paths in all actions
        ignoredActionPaths: ['register', 'rehydrate'],
        // Ignore these paths in the state
        ignoredPaths: ['register', 'rehydrate'],
      },
    }),
});

export const persistor = persistStore(store);
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
