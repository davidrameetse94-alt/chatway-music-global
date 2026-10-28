import React, { useState } from 'react';
import { ShieldCheck, Zap, DollarSign, Award, Layers, Bell, MousePointer, Info, ExternalLink } from 'lucide-react';
import { AdZone } from './AdZone';
import { VipProgress } from '../types/music';

interface MonetagInspectorProps {
  vipProgress: VipProgress;
  onRecordCpaClick: () => void;
  onOpenAppOpenModal: () => void;
  onOpenInterstitialModal: () => void;
  onOpenRewardedModal: () => void;
}

export const MonetagInspector: React.FC<MonetagInspectorProps> = ({
  vipProgress,
  onRecordCpaClick,
  onOpenAppOpenModal,
  onOpenInterstitialModal,
  onOpenRewardedModal,
}) => {
  const [activeAdLog, setActiveAdLog] = useState<string[]>([]);

  const handleZoneComplete = (zoneId: number) => {
    setActiveAdLog((prev) => [
      `[${new Date().toLocaleTimeString()}] Zone ${zoneId} successfully rendered on user interaction`,
      ...prev.slice(0, 7),
    ]);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Title */}
      <div className="mb-8">
        <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold uppercase tracking-wider mb-2">
          <ShieldCheck className="w-4 h-4" />
          <span>Monetag Compliance & Monetization Hub</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
          Monetag Zone Management & Live Tester
        </h2>
        <p className="mt-2 text-sm text-slate-300 max-w-2xl leading-relaxed">
          Official configuration for ChatWay Music Global. All ad units adhere to Monetag publisher guidelines: zero auto-clicks, strict user interaction triggers, and full CPA tracking.
        </p>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="p-4 rounded-xl bg-slate-900/60 border border-white/10">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-slate-400 font-medium">AppOpen Zone</span>
            <span className="text-xs font-mono text-emerald-400 font-bold">12141348</span>
          </div>
          <p className="text-sm font-semibold text-white">Initial Visit Welcome</p>
          <p className="text-[11px] text-slate-400 mt-1">Triggers upon first page load entry button</p>
        </div>

        <div className="p-4 rounded-xl bg-slate-900/60 border border-white/10">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-slate-400 font-medium">Interstitial Zone</span>
            <span className="text-xs font-mono text-blue-400 font-bold">12141366</span>
          </div>
          <p className="text-sm font-semibold text-white">Every 3 Songs</p>
          <p className="text-[11px] text-slate-400 mt-1">Non-intrusive stream milestone ad</p>
        </div>

        <div className="p-4 rounded-xl bg-slate-900/60 border border-white/10">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-slate-400 font-medium">Rewarded Zone</span>
            <span className="text-xs font-mono text-purple-400 font-bold">12141355</span>
          </div>
          <p className="text-sm font-semibold text-white">Full HD Video Unlock</p>
          <p className="text-[11px] text-slate-400 mt-1">15-second opt-in user reward</p>
        </div>

        <div className="p-4 rounded-xl bg-slate-900/60 border border-amber-500/20 bg-amber-500/5">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-amber-400 font-medium">CPA Direct Link</span>
            <span className="text-xs font-mono text-amber-400 font-bold">302344</span>
          </div>
          <p className="text-sm font-semibold text-white">VIP $1 (2 Clicks)</p>
          <p className="text-[11px] text-slate-400 mt-1">$0.30 - $0.60 per verified click</p>
        </div>
      </div>

      {/* Interactive Ad Zones Grid */}
      <h3 className="text-lg font-bold text-white mb-4">Live Ad Zone Controls</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        
        {/* Zone 1: AppOpen */}
        <div className="flex flex-col justify-between">
          <AdZone
            zoneId={12141348}
            zoneName="AppOpen Ad Unit"
            buttonLabel="Test AppOpen Zone (12141348)"
            onAdCompleted={handleZoneComplete}
          />
          <button
            onClick={onOpenAppOpenModal}
            className="mt-2 text-xs text-slate-400 hover:text-emerald-400 text-center underline cursor-pointer"
          >
            Launch Fullscreen AppOpen Modal
          </button>
        </div>

        {/* Zone 2: Interstitial */}
        <div className="flex flex-col justify-between">
          <AdZone
            zoneId={12141366}
            zoneName="Interstitial Ad Unit"
            buttonLabel="Test Interstitial (12141366)"
            onAdCompleted={handleZoneComplete}
          />
          <button
            onClick={onOpenInterstitialModal}
            className="mt-2 text-xs text-slate-400 hover:text-blue-400 text-center underline cursor-pointer"
          >
            Launch 3-Song Interstitial Modal
          </button>
        </div>

        {/* Zone 3: Rewarded */}
        <div className="flex flex-col justify-between">
          <AdZone
            zoneId={12141355}
            zoneName="Rewarded Video Unit"
            buttonLabel="Test Rewarded (12141355)"
            onAdCompleted={handleZoneComplete}
          />
          <button
            onClick={onOpenRewardedModal}
            className="mt-2 text-xs text-slate-400 hover:text-purple-400 text-center underline cursor-pointer"
          >
            Simulate 15s Rewarded Flow
          </button>
        </div>

        {/* Zone 4: Vignette */}
        <div>
          <AdZone
            zoneId={12141307}
            zoneName="Vignette Ad Unit"
            buttonLabel="Trigger Vignette (12141307)"
            onAdCompleted={handleZoneComplete}
          />
        </div>

        {/* Zone 5: Push */}
        <div>
          <AdZone
            zoneId={9510382}
            zoneName="In-Page Push Ad"
            buttonLabel="Register Push (9510382)"
            onAdCompleted={handleZoneComplete}
          />
        </div>

        {/* Zone 6: OnClick / Direct Link */}
        <div>
          <AdZone
            zoneId={302344}
            zoneName="OnClick Direct Link CPA"
            buttonLabel="Trigger OnClick CPA (302344)"
            directLinkUrl="https://otieuwou.com/4/302344"
            onAdCompleted={(id) => {
              handleZoneComplete(id);
              onRecordCpaClick();
            }}
          />
        </div>

      </div>

      {/* Real-time Activity Log */}
      {activeAdLog.length > 0 && (
        <div className="p-4 rounded-xl bg-slate-900 border border-white/10 mb-8">
          <h4 className="text-xs font-mono text-slate-400 uppercase tracking-wider mb-2">Live Monetag Session Logs</h4>
          <div className="space-y-1 font-mono text-xs text-slate-300">
            {activeAdLog.map((log, i) => (
              <div key={i} className="text-emerald-400">
                {log}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Monetag CPA Rules & Disclaimers */}
      <div className="p-5 rounded-2xl bg-slate-900/40 border border-white/10 flex items-start gap-3">
        <Info className="w-5 h-5 text-slate-400 shrink-0 mt-0.5" />
        <div className="text-xs text-slate-400 leading-relaxed">
          <strong className="text-white">Monetag Compliant Integration:</strong> Ads are executed solely in response to human user clicks. No auto-refresh, iframe cloaking, or artificial impression manipulation is utilized. Direct link CPA triggers target legitimate monetization zones authorized under publisher ID guidelines.
        </div>
      </div>
    </div>
  );
};
