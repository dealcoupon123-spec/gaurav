
import React, { useState } from 'react';
import { generateSignal } from './services/geminiService';
import { TradingSignal, UserInput, MarketType } from './types';
import SignalCard from './components/SignalCard';

const SYMBOL_PRESETS: Record<MarketType, string[]> = {
  Crypto: ['BTCUSDT', 'ETHUSDT', 'SOLUSDT'],
  Forex: ['EURUSD', 'GBPUSD', 'USDJPY'],
  Commodity: ['XAUUSD', 'XAGUSD', 'WTI'],
};

const App: React.FC = () => {
  const [input, setInput] = useState<UserInput>({
    marketType: 'Crypto',
    symbol: 'BTCUSDT',
    timeframe: '1H',
    capital: '10000',
    risk: '1',
    htfTrend: 'Bullish'
  });
  const [signals, setSignals] = useState<TradingSignal[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [clarification, setClarification] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setClarification(null);

    const result = await generateSignal(input);
    
    if (typeof result === 'string') {
      setClarification(result);
    } else {
      setSignals(prev => [result, ...prev]);
    }
    setIsLoading(false);
  };

  const handleMarketTypeChange = (type: MarketType) => {
    setInput({ 
      ...input, 
      marketType: type, 
      symbol: SYMBOL_PRESETS[type][0] 
    });
  };

  return (
    <div className="min-h-screen bg-[#020408] text-slate-100 selection:bg-indigo-500/30">
      {/* Dynamic Header */}
      <nav className="h-16 border-b border-slate-800/60 flex items-center px-6 md:px-12 justify-between bg-[#020408]/80 backdrop-blur-md sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center shadow-[0_0_15px_rgba(79,70,229,0.4)]">
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
            </svg>
          </div>
          <h1 className="text-xl font-black tracking-tighter uppercase italic">Quant<span className="text-indigo-500">AI</span></h1>
        </div>
        <div className="hidden md:flex items-center gap-6">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_#10b981]"></span>
            <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">SaaS Node Active</span>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 p-6 md:p-12">
        {/* Left Panel: Configuration */}
        <aside className="lg:col-span-4 space-y-6">
          <div className="bg-slate-900/20 border border-slate-800/60 p-6 rounded-3xl backdrop-blur-sm sticky top-24">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-xs font-black uppercase tracking-[0.2em] text-slate-500">Parameters</h2>
              <svg className="w-4 h-4 text-slate-700" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"/></svg>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Market Type Toggles */}
              <div>
                <label className="text-[10px] font-bold text-slate-500 uppercase mb-3 block tracking-widest">Market Cluster</label>
                <div className="p-1 bg-slate-950 border border-slate-800 rounded-xl flex gap-1">
                  {(['Crypto', 'Forex', 'Commodity'] as MarketType[]).map((type) => (
                    <button
                      key={type}
                      type="button"
                      onClick={() => handleMarketTypeChange(type)}
                      className={`flex-1 py-2 text-[10px] font-black uppercase rounded-lg transition-all ${
                        input.marketType === type 
                        ? 'bg-indigo-600 text-white shadow-lg' 
                        : 'text-slate-500 hover:text-slate-300'
                      }`}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </div>

              {/* Symbol & Presets */}
              <div className="space-y-3">
                <label className="text-[10px] font-bold text-slate-500 uppercase block tracking-widest">Asset Symbol</label>
                <div className="relative group">
                  <input
                    type="text"
                    value={input.symbol}
                    onChange={(e) => setInput({ ...input, symbol: e.target.value.toUpperCase() })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-slate-100 focus:border-indigo-500 outline-none transition-all uppercase mono text-sm group-hover:border-slate-700"
                    placeholder="Enter ticker..."
                    required
                  />
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-700 pointer-events-none">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2">
                  {SYMBOL_PRESETS[input.marketType].map(sym => (
                    <button
                      key={sym}
                      type="button"
                      onClick={() => setInput({ ...input, symbol: sym })}
                      className={`px-3 py-1.5 rounded-lg border text-[10px] font-bold mono transition-all ${
                        input.symbol === sym 
                        ? 'bg-indigo-500/10 border-indigo-500/50 text-indigo-400' 
                        : 'bg-transparent border-slate-800 text-slate-600 hover:border-slate-700 hover:text-slate-400'
                      }`}
                    >
                      {sym}
                    </button>
                  ))}
                </div>
              </div>

              {/* Timeframe & Bias */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Timeframe</label>
                  <select
                    value={input.timeframe}
                    onChange={(e) => setInput({ ...input, timeframe: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-3 text-slate-200 text-xs font-bold outline-none focus:border-indigo-500 appearance-none"
                  >
                    <option value="15M">15 MIN</option>
                    <option value="1H">1 HOUR</option>
                    <option value="4H">4 HOUR</option>
                    <option value="1D">1 DAY</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">HTF Bias (Opt)</label>
                  <select
                    value={input.htfTrend}
                    onChange={(e) => setInput({ ...input, htfTrend: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-3 text-slate-200 text-xs font-bold outline-none focus:border-indigo-500 appearance-none"
                  >
                    <option value="Bullish">Bullish</option>
                    <option value="Bearish">Bearish</option>
                    <option value="Neutral">Neutral / Range</option>
                    <option value="">No HTF Filter</option>
                  </select>
                </div>
              </div>

              {/* Risk & Capital */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Risk %</label>
                  <input
                    type="number"
                    value={input.risk}
                    onChange={(e) => setInput({ ...input, risk: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-slate-100 outline-none focus:border-indigo-500 mono text-xs font-bold"
                    step="0.1"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Portfolio ($)</label>
                  <input
                    type="number"
                    value={input.capital}
                    onChange={(e) => setInput({ ...input, capital: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-slate-100 outline-none focus:border-indigo-500 mono text-xs font-bold"
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className={`w-full py-4 rounded-xl font-black uppercase tracking-[0.2em] text-xs transition-all flex items-center justify-center gap-3 relative overflow-hidden group ${
                  isLoading 
                  ? 'bg-slate-800 text-slate-600 cursor-not-allowed' 
                  : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-[0_10px_30px_-10px_rgba(79,70,229,0.5)] active:scale-[0.98]'
                }`}
              >
                <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                {isLoading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-slate-600 border-t-white rounded-full animate-spin"></div>
                    Curating Setups...
                  </>
                ) : 'Generate SaaS Setup'}
              </button>
            </form>
          </div>
        </aside>

        {/* Right Panel: Monitor */}
        <section className="lg:col-span-8 space-y-6">
          <div className="flex items-center justify-between px-2">
            <h2 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-600">Signal Intelligence Feed</h2>
            <div className="flex gap-4">
               <button 
                onClick={() => setSignals([])}
                className="text-[10px] font-bold text-slate-700 hover:text-rose-500 transition-colors uppercase tracking-widest flex items-center gap-2"
              >
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>
                Clear Intelligence
              </button>
            </div>
          </div>

          {clarification && (
            <div className="bg-indigo-500/5 border border-indigo-500/20 p-6 rounded-3xl flex items-start gap-4 animate-in fade-in slide-in-from-top-4 duration-500 backdrop-blur-sm">
              <div className="bg-indigo-600/20 p-2.5 rounded-xl border border-indigo-500/30">
                <svg className="w-5 h-5 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
              </div>
              <div className="flex-1">
                <h3 className="text-indigo-400 font-black text-[10px] uppercase tracking-widest mb-2">Quant Analyst Clarification</h3>
                <p className="text-slate-200 text-sm leading-relaxed font-medium">{clarification}</p>
              </div>
            </div>
          )}

          {signals.length === 0 && !isLoading && !clarification && (
            <div className="h-[500px] border border-slate-800/40 border-dashed rounded-[2rem] flex flex-col items-center justify-center bg-slate-900/5 group">
              <div className="w-24 h-24 border border-slate-800/60 rounded-full flex items-center justify-center mb-8 relative">
                 <div className="absolute inset-0 rounded-full bg-indigo-500/5 blur-xl group-hover:bg-indigo-500/10 transition-colors"></div>
                <svg className="w-10 h-10 text-slate-800 group-hover:text-slate-700 transition-colors relative" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z"/><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z"/></svg>
              </div>
              <p className="text-slate-600 font-black uppercase tracking-[0.25em] text-[10px] text-center px-12 leading-loose max-w-sm">
                Idle Intelligence: Trigger the SaaS engine to filter high-probability market setups
              </p>
            </div>
          )}

          <div className="space-y-8 pb-12">
            {signals.map((sig, i) => (
              <SignalCard key={i} signal={sig} userInput={input} />
            ))}
          </div>
        </section>
      </main>

      <footer className="w-full max-w-7xl mx-auto px-6 md:px-12 py-16 border-t border-slate-800/40 grid grid-cols-1 md:grid-cols-2 gap-12 text-slate-600">
        <div className="space-y-4">
          <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">SaaS Transparency Disclosure</p>
          <p className="text-[10px] leading-relaxed uppercase tracking-wider font-medium opacity-60">
            QuantAI filters high-quality setups using explainable logic. We avoid frequent noise to prioritize structural integrity. 
            Automated signals are for research purposes and do not constitute financial advice. No specific win-rate is promised.
          </p>
        </div>
        <div className="md:text-right flex flex-col justify-end">
           <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-3">Node Connectivity</p>
           <div className="flex md:justify-end gap-6">
              <div className="text-left md:text-right">
                <p className="text-[9px] font-bold text-emerald-500/80 uppercase mono">Intelligence Stream: STABLE</p>
                <p className="text-[9px] font-bold text-slate-600 uppercase mono">Sync: 1ms</p>
              </div>
              <div className="text-left md:text-right">
                <p className="text-[9px] font-bold text-indigo-500/80 uppercase mono">Tier: Enterprise SaaS</p>
                <p className="text-[9px] font-bold text-slate-600 uppercase mono">Filter Rank: High-RR</p>
              </div>
           </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
