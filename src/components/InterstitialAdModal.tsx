import React, { useState } from 'react';
import { Volume2, ShieldCheck, ArrowRight, Music2, CheckCircle2 } from 'lucide-react';

interface InterstitialAdModalProps {
  isOpen: boolean;
  onClose: () => void;
  previewCount: number;
}

export const InterstitialAdModal: React.FC<InterstitialAdModalProps> = ({
  isOpen,
  onClose,
  previewCount,
}) => {
  const [isProcessing, setIsProcessing] = useState(false);

  if (!isOpen) return null;

  const handleTriggerInterstitial = async () => {
    setIsProcessing(true);

    try {
      if (typeof window.showZone === 'function') {
        await window.showZone(12141366);
      }
    } catch (err) {
      console.error('[Interstitial] Error showing zone 12141366:', err);
    }

    setTimeout(() => {
      setIsProcessing(false);
      onClose();
    }, 450);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-md rounded-2xl bg-[#0e1422] border border-white/10 p-6 shadow-2xl overflow-hidden">
        {/* Glow */}
        <div className="absolute -top-20 -right-20 w-44 h-44 bg-blue-500/15 rounded-full blur-3xl pointer-events-none" />

        <div className="flex items-center justify-between text-xs text-slate-400 mb-4">
          <div className="flex items-center gap-1.5 text-blue-400 font-semibold tracking-wide uppercase text-[11px]">
            <ShieldCheck className="w-4 h-4" />
            <span>Monetag Interstitial</span>
          </div>
          <span className="font-mono text-slate-500 tabular-nums">Zone 12141366</span>
        </div>

        <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-blue-500/10 text-blue-400 mb-4 border border-blue-500/20">
          <Music2 className="w-6 h-6 animate-pulse" />
        </div>

        <h3 className="text-xl font-bold text-white tracking-tight">
          Preview Milestone: {previewCount} Tracks Streamed
        </h3>
        
        <p className="mt-2 text-sm text-slate-300 leading-relaxed">
          You've explored 3 hit track previews on ChatWay Music Global! We keep our streaming 100% free with non-intrusive Monetag partner interstitials.
        </p>

        <div className="mt-5 p-3.5 rounded-xl bg-slate-900/90 border border-white/5 flex items-center gap-3">
          <Volume2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <div className="text-xs text-slate-300">
            <span className="font-medium text-white">Lossless Audio Buffer:</span> Next queue tracks are pre-cached and ready to stream.
          </div>
        </div>

        <div className="mt-6 space-y-2.5">
          <button
            onClick={handleTriggerInterstitial}
            disabled={isProcessing}
            className="w-full py-3 px-5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs tracking-wide uppercase transition-all duration-200 flex items-center justify-center gap-2 shadow-lg shadow-blue-600/25 active:scale-[0.99] disabled:opacity-70 cursor-pointer"
          >
            {isProcessing ? (
              <span>Requesting Interstitial (Zone 12141366)...</span>
            ) : (
              <>
                <span>Continue Listening (Zone 12141366)</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>

          <button
            onClick={onClose}
            className="w-full py-2 text-xs text-slate-400 hover:text-slate-200 transition-colors cursor-pointer text-center"
          >
            Dismiss & Keep Playing
          </button>
        </div>

        <div className="mt-4 pt-3 border-t border-white/5 text-[11px] text-slate-400 text-center">
          Monetag Compliant · 3-Song Interstitial Frequency
        </div>
      </div>
    </div>
  );
};
