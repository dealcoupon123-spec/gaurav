
import React from 'react';
import { TradingSignal } from '../types';

interface SignalCardProps {
  signal: TradingSignal;
  userInput: { capital: string; risk: string; marketType: string };
}

const SignalCard: React.FC<SignalCardProps> = ({ signal, userInput }) => {
  const isNoTrade = signal.direction === 'no-trade';

  const statusThemes = {
    buy: {
      bg: 'bg-emerald-500/5',
      border: 'border-emerald-500/30',
      badge: 'bg-emerald-500 text-emerald-950',
      text: 'text-emerald-400',
      accent: 'emerald'
    },
    sell: {
      bg: 'bg-rose-500/5',
      border: 'border-rose-500/30',
      badge: 'bg-rose-500 text-rose-50',
      text: 'text-rose-400',
      accent: 'rose'
    },
    'no-trade': {
      bg: 'bg-slate-500/5',
      border: 'border-slate-800',
      badge: 'bg-slate-700 text-slate-300',
      text: 'text-slate-400',
      accent: 'slate'
    }
  };

  const theme = statusThemes[signal.direction as keyof typeof statusThemes] || statusThemes['no-trade'];

  return (
    <div className={`p-8 rounded-[2rem] border ${theme.border} ${theme.bg} transition-all duration-500 hover:shadow-2xl hover:shadow-${theme.accent}-500/10 animate-in fade-in zoom-in-95 duration-700 backdrop-blur-xl group`}>
      {/* Header Bar */}
      <div className="flex justify-between items-start mb-8">
        <div className="flex items-center gap-5">
          <div className={`px-5 py-2 rounded-xl font-black uppercase tracking-[0.15em] text-xs shadow-lg ${theme.badge}`}>
            {signal.direction}
          </div>
          <div>
            <h3 className="text-3xl font-bold uppercase mono text-white leading-none tracking-tighter">{signal.symbol}</h3>
            <div className="flex items-center gap-2 mt-2">
              <span className="w-1.5 h-1.5 rounded-full bg-slate-700"></span>
              <p className="text-slate-500 text-[10px] font-mono uppercase tracking-[0.2em]">{signal.timestamp}</p>
            </div>
          </div>
        </div>
        {!isNoTrade && (
          <div className="text-right">
            <span className="text-[10px] text-slate-500 uppercase block font-black leading-none mb-2 tracking-widest">Risk Ratio</span>
            <div className="bg-slate-950 border border-slate-800 px-4 py-2 rounded-xl">
               <span className={`text-xl font-bold leading-none mono ${theme.text}`}>{signal.rr_ratio}</span>
            </div>
          </div>
        )}
      </div>

      {!isNoTrade ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-8">
          {/* Main Execution Zone */}
          <div className="lg:col-span-7 grid grid-cols-2 gap-4">
            <div className="bg-slate-950 p-6 rounded-2xl border border-slate-800/60 group-hover:border-slate-700 transition-colors">
              <label className="text-[10px] text-slate-500 uppercase tracking-widest font-black block mb-3">Target Entry</label>
              <p className="text-white font-bold text-2xl mono tracking-tight">{signal.entry_zone}</p>
            </div>
            <div className="bg-slate-950 p-6 rounded-2xl border border-rose-500/10 group-hover:border-rose-500/20 transition-colors">
              <label className="text-[10px] text-rose-500/60 uppercase tracking-widest font-black block mb-3">Hard Stop Loss</label>
              <p className="text-rose-400 font-bold text-2xl mono tracking-tight">{signal.stoploss}</p>
            </div>
          </div>
          
          {/* Targets Chip Set */}
          <div className="lg:col-span-5 bg-slate-950 p-6 rounded-2xl border border-slate-800/60 group-hover:border-slate-700 transition-colors">
            <label className="text-[10px] text-emerald-500/60 uppercase tracking-widest font-black block mb-4">Profit Milestones</label>
            <div className="flex flex-wrap gap-4">
              {signal.targets.map((tp, idx) => (
                <div key={idx} className="flex flex-col gap-1">
                  <span className="text-[9px] text-slate-600 font-black uppercase tracking-widest">TP {idx+1}</span>
                  <span className="text-white font-bold mono text-lg tracking-tighter">{tp}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : null}

      {/* Position Management Sub-Panel */}
      {!isNoTrade && (
        <div className="mb-10 p-6 bg-indigo-500/[0.03] rounded-2xl border border-indigo-500/10 flex flex-col md:flex-row gap-6 items-center">
          <div className="shrink-0 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-600/10 border border-indigo-500/20 flex items-center justify-center">
               <svg className="w-5 h-5 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z"/></svg>
            </div>
            <div className="hidden md:block">
              <label className="text-[9px] text-indigo-400 uppercase tracking-widest font-black">Position Management</label>
              <p className="text-slate-400 text-[10px] font-medium uppercase tracking-widest">Calculated Logic</p>
            </div>
          </div>
          <div className="flex-1">
            <p className="text-slate-200 font-bold text-sm leading-relaxed mono bg-slate-950/50 p-4 rounded-xl border border-slate-800/40">
              {signal.position_size_hint}
            </p>
          </div>
        </div>
      )}

      {/* Logic & Footer Warnings */}
      <div className="space-y-6 pt-8 border-t border-slate-800/60">
        <div>
          <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-3">Terminal Logic & Signal Structure</h4>
          <p className="text-sm text-slate-300 leading-relaxed font-medium bg-slate-900/40 p-5 rounded-2xl border border-slate-800/40">{signal.reason}</p>
        </div>
        
        <div className="flex items-start gap-4 bg-amber-500/[0.03] p-5 rounded-2xl border border-amber-500/10">
          <div className="mt-0.5 shrink-0">
            <div className="w-7 h-7 bg-amber-500/10 border border-amber-500/20 rounded-lg flex items-center justify-center">
              <svg className="w-4 h-4 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/></svg>
            </div>
          </div>
          <div>
            <h5 className="text-[9px] font-black text-amber-500 uppercase tracking-widest mb-1.5 leading-none">Execution Guard Rails</h5>
            <p className="text-xs text-amber-200/50 italic leading-tight uppercase tracking-wider font-semibold">{signal.warnings}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignalCard;
