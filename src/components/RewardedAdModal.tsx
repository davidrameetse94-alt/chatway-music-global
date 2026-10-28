import React, { useState, useEffect } from 'react';
import { Video, ShieldCheck, CheckCircle2, Play, Crown, Sparkles, Loader2, X } from 'lucide-react';
import { Track } from '../types/music';

interface RewardedAdModalProps {
  isOpen: boolean;
  track: Track | null;
  onClose: () => void;
  onUnlockSuccess: (track: Track) => void;
  isVip: boolean;
}

export const RewardedAdModal: React.FC<RewardedAdModalProps> = ({
  isOpen,
  track,
  onClose,
  onUnlockSuccess,
  isVip,
}) => {
  const [adStarted, setAdStarted] = useState<boolean>(false);
  const [secondsRemaining, setSecondsRemaining] = useState<number>(15);
  const [rewardGranted, setRewardGranted] = useState<boolean>(false);

  useEffect(() => {
    if (!isOpen) {
      setAdStarted(false);
      setSecondsRemaining(15);
      setRewardGranted(false);
    }
  }, [isOpen, track]);

  useEffect(() => {
    let timer: NodeJS.Timeout;

    if (adStarted && secondsRemaining > 0) {
      timer = setInterval(() => {
        setSecondsRemaining((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            setRewardGranted(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (timer) clearInterval(timer);
    };
  }, [adStarted, secondsRemaining]);

  if (!isOpen || !track) return null;

  const handleStartRewardedAd = async () => {
    setAdStarted(true);

    try {
      if (typeof window.showZone === 'function') {
        await window.showZone(12141355);
      }
    } catch (err) {
      console.error('[RewardedAd] Error calling zone 12141355:', err);
    }
  };

  const handleFinishAndPlay = () => {
    onUnlockSuccess(track);
  };

  const highResArtwork = track.artworkUrl100.replace('100x100bb', '600x600bb');
  const progressPercent = ((15 - secondsRemaining) / 15) * 100;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg rounded-2xl bg-[#0c101c] border border-white/10 p-6 md:p-8 shadow-2xl overflow-hidden">
        {/* Glow */}
        <div className="absolute -top-20 -left-20 w-44 h-44 bg-purple-500/15 rounded-full blur-3xl pointer-events-none" />

        {/* Close button */}
        {!adStarted && (
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full text-slate-400 hover:text-white bg-slate-800/50 hover:bg-slate-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        )}

        {/* Header Tag */}
        <div className="flex items-center justify-between text-xs text-slate-400 mb-5">
          <div className="flex items-center gap-1.5 text-purple-400 font-semibold tracking-wide uppercase text-[11px]">
            <ShieldCheck className="w-4 h-4" />
            <span>Monetag Rewarded Video</span>
          </div>
          <span className="font-mono text-slate-500 tabular-nums">Zone 12141355</span>
        </div>

        {/* Track preview banner */}
        <div className="flex items-center gap-4 p-3 rounded-xl bg-slate-900/80 border border-white/5 mb-5">
          <img
            src={highResArtwork}
            alt={track.trackName}
            referrerPolicy="no-referrer"
            className="w-16 h-16 rounded-lg object-cover shadow-md"
          />
          <div className="flex-1 min-w-0">
            <h4 className="text-sm font-bold text-white truncate">{track.trackName}</h4>
            <p className="text-xs text-slate-400 truncate mt-0.5">{track.artistName}</p>
            <span className="inline-flex items-center gap-1 text-[11px] text-purple-400 mt-1">
              <Video className="w-3.5 h-3.5" />
              <span>Full HD Music Video Locked</span>
            </span>
          </div>
        </div>

        {!adStarted && !rewardGranted && (
          <>
            <h3 className="text-xl font-bold text-white tracking-tight mb-2">
              Unlock Full Music Video Experience
            </h3>
            <p className="text-sm text-slate-300 leading-relaxed mb-6">
              Watch a quick 15-second sponsored ad to unlock the full HD music video, studio visualizer, and lyrics sync for this track.
            </p>

            {isVip && (
              <div className="mb-4 p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Crown className="w-4 h-4 text-amber-400" />
                  <span className="text-xs font-semibold text-amber-300">VIP Pass Active</span>
                </div>
                <button
                  onClick={handleFinishAndPlay}
                  className="px-3 py-1 bg-amber-500 text-black text-xs font-bold rounded-md hover:bg-amber-400 transition-colors"
                >
                  Instant VIP Unlock
                </button>
              </div>
            )}

            <button
              onClick={handleStartRewardedAd}
              className="w-full py-3.5 px-6 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-sm tracking-wide transition-all duration-200 flex items-center justify-center gap-2 shadow-lg shadow-purple-600/30 active:scale-[0.99] cursor-pointer"
            >
              <Play className="w-4 h-4 fill-white" />
              <span>Watch 15s Ad to Unlock (Zone 12141355)</span>
            </button>
          </>
        )}

        {adStarted && !rewardGranted && (
          <div className="py-4 text-center">
            <div className="relative w-24 h-24 mx-auto mb-4 flex items-center justify-center">
              {/* Circular or countdown display */}
              <div className="absolute inset-0 rounded-full border-4 border-slate-800" />
              <div 
                className="absolute inset-0 rounded-full border-4 border-purple-500 transition-all duration-1000"
                style={{
                  clipPath: `polygon(50% 50%, 50% 0%, ${progressPercent >= 25 ? '100% 0%,' : ''} ${progressPercent >= 50 ? '100% 100%,' : ''} ${progressPercent >= 75 ? '0% 100%,' : ''} ${progressPercent >= 100 ? '0% 0%,' : ''} 50% 0%)`
                }}
              />
              <span className="text-3xl font-extrabold text-white font-mono tabular-nums">
                {secondsRemaining}s
              </span>
            </div>

            <h4 className="text-base font-bold text-white mb-1">
              Sponsored Monetag Rewarded Ad Playing
            </h4>
            <p className="text-xs text-slate-400 max-w-xs mx-auto">
              Please watch until the timer reaches 0 to claim your Full HD video unlock.
            </p>

            {/* Progress bar */}
            <div className="mt-5 w-full bg-slate-800 rounded-full h-2 overflow-hidden">
              <div
                className="bg-gradient-to-r from-purple-500 to-indigo-400 h-full transition-all duration-1000 ease-linear"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
            <div className="mt-2 flex justify-between text-[11px] text-slate-500 font-mono">
              <span>Zone 12141355 Active</span>
              <span>{Math.round(progressPercent)}% completed</span>
            </div>
          </div>
        )}

        {rewardGranted && (
          <div className="py-4 text-center">
            <div className="w-16 h-16 mx-auto mb-3 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center border border-emerald-500/30">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-white mb-1">
              Reward Granted! Full Video Unlocked
            </h3>
            <p className="text-xs text-slate-300 mb-6 max-w-sm mx-auto">
              Thank you for supporting ChatWay Music Global. Your video has been unlocked for unlimited viewing.
            </p>

            <button
              onClick={handleFinishAndPlay}
              className="w-full py-3.5 px-6 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-bold text-sm tracking-wide transition-all flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/25 active:scale-[0.99] cursor-pointer"
            >
              <Play className="w-4 h-4 fill-black" />
              <span>Watch Full Video Now</span>
            </button>
          </div>
        )}

        <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between text-[11px] text-slate-400">
          <span>Monetag Rewarded Video Zone</span>
          <span>15s Verified Unlock</span>
        </div>
      </div>
    </div>
  );
};
