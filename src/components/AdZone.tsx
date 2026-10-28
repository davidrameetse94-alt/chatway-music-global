import React, { useEffect, useState } from 'react';
import { ExternalLink, CheckCircle2, ShieldCheck, Loader2 } from 'lucide-react';
import { MonetagZoneId } from '../types/music';

declare global {
  interface Window {
    showZone?: (zoneId: number | string) => Promise<{ status: string; zoneId: number | string; timestamp: number } | any>;
    monetagConfig?: {
      zones: {
        appOpen: number;
        interstitial: number;
        rewarded: number;
        vignette: number;
      };
      push: number;
      onclick: number;
    };
  }
}

interface AdZoneProps {
  zoneId: MonetagZoneId | number;
  zoneName?: string;
  buttonLabel?: string;
  autoTriggerOnMount?: boolean; // Only set to true if the component was mounted DIRECTLY from an explicit user button click
  onAdCompleted?: (zoneId: number) => void;
  onAdClosed?: () => void;
  directLinkUrl?: string;
  className?: string;
}

/**
 * AdZone Component
 * Strictly complies with Monetag Ad Policy:
 * - Loads ads strictly on user interaction (explicit button click), never auto-clicks.
 * - Uses useEffect to call window.showZone(zoneId) once user has interacted.
 */
export const AdZone: React.FC<AdZoneProps> = ({
  zoneId,
  zoneName = 'Monetag Ad Zone',
  buttonLabel,
  autoTriggerOnMount = false,
  onAdCompleted,
  onAdClosed,
  directLinkUrl,
  className = '',
}) => {
  const [hasInteracted, setHasInteracted] = useState<boolean>(autoTriggerOnMount);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isCompleted, setIsCompleted] = useState<boolean>(false);
  const [statusMessage, setStatusMessage] = useState<string>('');

  // Call window.showZone(zoneId) inside useEffect upon user interaction only
  useEffect(() => {
    if (!hasInteracted || isCompleted) return;

    let isMounted = true;
    setIsLoading(true);
    setStatusMessage(`Requesting zone ${zoneId}...`);

    const triggerAd = async () => {
      try {
        if (typeof window.showZone === 'function') {
          const res = await window.showZone(zoneId);
          if (isMounted) {
            setIsLoading(false);
            setIsCompleted(true);
            setStatusMessage(`Ad displayed successfully for zone ${zoneId}`);
            if (onAdCompleted) {
              onAdCompleted(Number(zoneId));
            }
          }
        } else {
          // Fallback if window.showZone is not defined
          console.warn(`[AdZone] window.showZone is not available for zone ${zoneId}`);
          if (isMounted) {
            setIsLoading(false);
            setIsCompleted(true);
            setStatusMessage(`Zone ${zoneId} acknowledged`);
            if (onAdCompleted) {
              onAdCompleted(Number(zoneId));
            }
          }
        }
      } catch (err) {
        console.error(`[AdZone] Error showing zone ${zoneId}:`, err);
        if (isMounted) {
          setIsLoading(false);
          setIsCompleted(true);
          setStatusMessage(`Zone ${zoneId} finished`);
          if (onAdCompleted) {
            onAdCompleted(Number(zoneId));
          }
        }
      }
    };

    triggerAd();

    return () => {
      isMounted = false;
    };
  }, [hasInteracted, zoneId, isCompleted, onAdCompleted]);

  const handleUserClick = (e: React.MouseEvent) => {
    e.stopPropagation();

    // If direct link CPA is provided, open it safely in a new tab upon user click
    if (directLinkUrl) {
      try {
        window.open(directLinkUrl, '_blank', 'noopener,noreferrer');
      } catch (err) {
        console.warn('[AdZone] Direct link open prevented:', err);
      }
    }

    setHasInteracted(true);
  };

  return (
    <div className={`p-4 rounded-xl border border-white/10 bg-slate-900/80 backdrop-blur-md ${className}`}>
      <div className="flex items-center justify-between gap-3 mb-3">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
          <span className="text-xs font-semibold text-slate-300 uppercase tracking-wider">{zoneName}</span>
        </div>
        <span className="text-[11px] font-mono text-slate-400 tabular-nums">Zone #{zoneId}</span>
      </div>

      {!hasInteracted && !isCompleted && (
        <button
          onClick={handleUserClick}
          className="w-full py-2.5 px-4 bg-emerald-500 hover:bg-emerald-400 text-black font-semibold text-xs rounded-lg transition-all flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20 active:scale-[0.98]"
        >
          <span>{buttonLabel || `Show Ad (Zone ${zoneId})`}</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </button>
      )}

      {isLoading && (
        <div className="py-2.5 px-4 bg-slate-800/80 border border-emerald-500/30 rounded-lg flex items-center justify-center gap-2.5 text-xs text-emerald-300">
          <Loader2 className="w-4 h-4 animate-spin text-emerald-400" />
          <span>{statusMessage || 'Loading sponsored message...'}</span>
        </div>
      )}

      {isCompleted && (
        <div className="flex items-center justify-between py-2 px-3 bg-emerald-950/40 border border-emerald-500/30 rounded-lg text-xs text-emerald-300">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span className="font-medium">Zone {zoneId} Loaded</span>
          </div>
          {onAdClosed && (
            <button
              onClick={onAdClosed}
              className="text-xs text-slate-400 hover:text-white underline transition-colors"
            >
              Close
            </button>
          )}
        </div>
      )}

      <p className="mt-2 text-[10px] text-slate-400 text-center">
        Legal Monetag monetization partner · Safe verified ad zone
      </p>
    </div>
  );
};

export default AdZone;
