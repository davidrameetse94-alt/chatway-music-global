import React, { useState } from 'react';
import { Crown, Sparkles, CheckCircle2, ShieldCheck, Zap, ExternalLink, X } from 'lucide-react';
import { VipProgress } from '../types/music';

interface VipPassModalProps {
  isOpen: boolean;
  onClose: () => void;
  vipProgress: VipProgress;
  onRecordCpaClick: () => void;
}

export const VipPassModal: React.FC<VipPassModalProps> = ({
  isOpen,
  onClose,
  vipProgress,
  onRecordCpaClick,
}) => {
  const [feedback, setFeedback] = useState<string>('');

  if (!isOpen) return null;

  const directLinkUrl = 'https://otieuwou.com/4/302344'; // Monetag Direct Link CPA zone 302344

  const handleCpaClick = () => {
    try {
      window.open(directLinkUrl, '_blank', 'noopener,noreferrer');
      onRecordCpaClick();
      setFeedback('CPA interaction recorded! Progress updated.');
      setTimeout(() => setFeedback(''), 3000);
    } catch (err) {
      console.warn('CPA link open error:', err);
    }
  };

  const progressPercent = Math.min(100, (vipProgress.clicks / 2) * 100);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-md rounded-2xl bg-[#0d121f] border border-amber-500/30 p-6 md:p-8 shadow-2xl overflow-hidden">
        {/* Glow */}
        <div className="absolute -top-20 -right-20 w-48 h-48 bg-amber-500/15 rounded-full blur-3xl pointer-events-none" />

        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full text-slate-400 hover:text-white bg-slate-800/50 hover:bg-slate-800 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-2 mb-4">
          <div className="p-2 rounded-xl bg-amber-500/15 text-amber-400 border border-amber-500/30">
            <Crown className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-extrabold text-white tracking-tight">
              VIP Music Pass ($1.00 Value)
            </h3>
            <p className="text-xs text-amber-400 font-medium">Monetag CPA Direct Link Partnership</p>
          </div>
        </div>

        <p className="text-xs text-slate-300 leading-relaxed mb-5">
          Unlock premium VIP privileges with 2 verified Monetag CPA clicks. Each CPA interaction generates $0.30–$0.60 in publisher revenue, funding 100% ad-free streaming for you!
        </p>

        {/* Progress Tracker Card */}
        <div className="p-4 rounded-xl bg-slate-900/90 border border-white/5 mb-6">
          <div className="flex items-center justify-between text-xs mb-2">
            <span className="font-semibold text-white">VIP Unlock Progress</span>
            <span className="font-mono text-amber-400 font-bold tabular-nums">
              {vipProgress.clicks}/2 clicks {vipProgress.unlocked ? '(VIP ACTIVE)' : ''}
            </span>
          </div>

          <div className="w-full bg-slate-800 rounded-full h-2.5 overflow-hidden mb-2">
            <div
              className="bg-gradient-to-r from-amber-500 to-yellow-400 h-full transition-all duration-500"
              style={{ width: `${progressPercent}%` }}
            />
          </div>

          <div className="flex justify-between text-[11px] text-slate-400">
            <span>$0.00</span>
            <span>$0.50 (1 Click)</span>
            <span>$1.00 (VIP Level)</span>
          </div>
        </div>

        {/* VIP Perks */}
        <div className="space-y-2 mb-6 text-xs text-slate-300">
          <div className="flex items-center gap-2.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>Ad-free listening (Skip all 3-song Interstitial ads)</span>
          </div>
          <div className="flex items-center gap-2.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>Instant Full HD Video Unlock without 15s wait</span>
          </div>
          <div className="flex items-center gap-2.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>Ultra Lossless 320kbps Audio streaming mode</span>
          </div>
          <div className="flex items-center gap-2.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>Official VIP Golden Badge in Player & Profile</span>
          </div>
        </div>

        {feedback && (
          <div className="mb-4 p-2.5 rounded-lg bg-emerald-950/60 border border-emerald-500/30 text-emerald-300 text-xs text-center font-medium">
            {feedback}
          </div>
        )}

        {/* Action Button */}
        {!vipProgress.unlocked ? (
          <button
            onClick={handleCpaClick}
            className="w-full py-3.5 px-6 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-black font-bold text-sm tracking-wide transition-all flex items-center justify-center gap-2 shadow-lg shadow-amber-500/25 active:scale-[0.99] cursor-pointer"
          >
            <span>Click Direct Link CPA (+1 Click / +$0.50)</span>
            <ExternalLink className="w-4 h-4" />
          </button>
        ) : (
          <div className="py-3 px-4 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-center text-xs font-bold flex items-center justify-center gap-2">
            <Crown className="w-4 h-4 text-amber-400" />
            <span>You are an official VIP Pass holder!</span>
          </div>
        )}

        <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between text-[11px] text-slate-400">
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-slate-400" />
            <span>Monetag Direct Link CPA</span>
          </div>
          <span className="font-mono tabular-nums">Zone 302344</span>
        </div>
      </div>
    </div>
  );
};
