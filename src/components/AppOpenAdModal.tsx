import React, { useState } from 'react';
import { Sparkles, Play, ShieldCheck, ArrowRight, Zap, CheckCircle2 } from 'lucide-react';
import { VipProgress } from '../types/music';

interface AppOpenAdModalProps {
  isOpen: boolean;
  onClose: () => void;
  vipProgress: VipProgress;
  onRecordCpaClick: () => void;
}

export const AppOpenAdModal: React.FC<AppOpenAdModalProps> = ({
  isOpen,
  onClose,
  vipProgress,
  onRecordCpaClick,
}) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [adTriggered, setAdTriggered] = useState(false);

  if (!isOpen) return null;

  const directLinkUrl = 'https://otieuwou.com/4/302344'; // Monetag Direct Link CPA zone 302344

  const handleContinue = async () => {
    setIsProcessing(true);

    // 1. Trigger Monetag CPA direct link in a new tab (1 install = $0.30 - $0.60, 2 installs = $1.00)
    try {
      window.open(directLinkUrl, '_blank', 'noopener,noreferrer');
      onRecordCpaClick();
    } catch (err) {
      console.warn('[AppOpenAd] Direct link open prevented:', err);
    }

    // 2. Trigger Monetag AppOpen Zone 12141348 via window.showZone
    try {
      if (typeof window.showZone === 'function') {
        await window.showZone(12141348);
      }
    } catch (err) {
      console.error('[AppOpenAd] Error with zone 12141348:', err);
    }

    setAdTriggered(true);
    setTimeout(() => {
      setIsProcessing(false);
      onClose();
    }, 400);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg rounded-2xl bg-gradient-to-b from-slate-900 via-slate-900 to-[#0b0f19] border border-white/10 p-6 md:p-8 shadow-2xl overflow-hidden">
        {/* Glow ambient background */}
        <div className="absolute -top-24 -left-24 w-60 h-60 bg-emerald-500/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 w-60 h-60 bg-cyan-500/15 rounded-full blur-3xl pointer-events-none" />

        {/* Header Tag */}
        <div className="flex items-center justify-between text-xs text-slate-400 mb-5">
          <div className="flex items-center gap-1.5 text-emerald-400 font-semibold tracking-wide uppercase text-[11px]">
            <ShieldCheck className="w-4 h-4" />
            <span>Monetag Monetized Partner</span>
          </div>
          <span className="font-mono text-slate-500 tabular-nums">Zone 12141348</span>
        </div>

        {/* Hero Title */}
        <div className="mb-6">
          <h2 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight leading-tight">
            Welcome to <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-300">ChatWay Music</span> Global
          </h2>
          <p className="mt-2 text-sm text-slate-300 leading-relaxed">
            Stream the world's Top 50 trending tracks instantly, unlock full HD music videos, and experience lossless high-fidelity audio previews.
          </p>
        </div>

        {/* VIP CPA Direct Link Promo Banner */}
        <div className="mb-6 p-4 rounded-xl bg-slate-800/60 border border-emerald-500/20">
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400 shrink-0 mt-0.5">
              <Zap className="w-4 h-4" />
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                  $1 VIP Pass Offer (2 Clicks)
                </h4>
                <span className="text-[11px] font-mono text-emerald-400 font-semibold">
                  {vipProgress.clicks}/2 clicks
                </span>
              </div>
              <p className="mt-1 text-xs text-slate-300">
                1 CPA click = $0.30–$0.60 estimated value. Complete 2 clicks to activate VIP Pass ($1 value) with zero interruptions!
              </p>
              
              {/* Progress Bar */}
              <div className="mt-2.5 w-full bg-slate-900 rounded-full h-1.5 overflow-hidden">
                <div 
                  className="bg-gradient-to-r from-emerald-500 to-teal-400 h-full transition-all duration-300"
                  style={{ width: `${Math.min(100, (vipProgress.clicks / 2) * 100)}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="space-y-3">
          <button
            onClick={handleContinue}
            disabled={isProcessing}
            className="w-full py-3.5 px-6 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-black font-bold text-sm transition-all duration-200 flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/25 active:scale-[0.99] disabled:opacity-70 cursor-pointer"
          >
            {isProcessing ? (
              <span className="flex items-center gap-2">
                <span>Connecting to AppOpen Zone 12141348...</span>
              </span>
            ) : adTriggered ? (
              <span className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4" />
                <span>Opening ChatWay Music...</span>
              </span>
            ) : (
              <>
                <span>Continue to Music (Zone 12141348 + $0.50 CPA)</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>

          <button
            onClick={onClose}
            className="w-full py-2 text-xs text-slate-400 hover:text-slate-200 transition-colors cursor-pointer"
          >
            Directly Enter Player
          </button>
        </div>

        {/* Legal notice */}
        <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between text-[11px] text-slate-400">
          <span>Official Monetag AppOpen Zone</span>
          <span>Click-to-trigger compliance</span>
        </div>
      </div>
    </div>
  );
};
