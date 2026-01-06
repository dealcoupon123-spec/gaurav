
export type MarketType = 'Forex' | 'Crypto' | 'Commodity';

export interface TradingSignal {
  direction: 'buy' | 'sell' | 'no-trade';
  entry_zone: string;
  stoploss: string;
  targets: string[];
  position_size_hint: string;
  rr_ratio: string;
  reason: string;
  warnings: string;
  timestamp: string;
  symbol: string;
}

export interface UserInput {
  marketType: MarketType;
  symbol: string;
  timeframe: string;
  capital: string;
  risk: string;
  htfTrend?: string;
}
