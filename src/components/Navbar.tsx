import React from 'react';
import { Music, Crown, Radio, Sparkles, Heart, Shield } from 'lucide-react';
import { VipProgress } from '../types/music';

interface NavbarProps {
  currentTab: 'hits' | 'favorites' | 'genres' | 'monetag';
  onTabChange: (tab: 'hits' | 'favorites' | 'genres' | 'monetag') => void;
  favoritesCount: number;
  vipProgress: VipProgress;
  onOpenVipModal: () => void;
  onOpenAdZoneInspector: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  onTabChange,
  favoritesCount,
  vipProgress,
  onOpenVipModal,
  onOpenAdZoneInspector,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-[#080b11]/90 backdrop-blur-md border-b border-white/10 px-4 sm:px-8 py-3.5 flex items-center justify-between gap-4 md:gap-8 transition-colors">
      {/* Zone 1: Brand Wordmark */}
      <div 
        onClick={() => onTabChange('hits')}
        className="flex items-center gap-2.5 cursor-pointer shrink-0 select-none"
      >
        <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center text-black font-extrabold shadow-md shadow-emerald-500/20">
          <Music className="w-5 h-5 fill-black" />
        </div>
        <div className="flex flex-col">
          <span className="text-base sm:text-lg font-bold tracking-tight text-white whitespace-nowrap">
            ChatWay <span className="text-emerald-400 font-extrabold">Music</span>
          </span>
        </div>
      </div>

      {/* Zone 2: Navigation Links (Clean single-line text links) */}
      <nav className="hidden md:flex items-center gap-7 text-xs font-semibold text-slate-300">
        <button
          onClick={() => onTabChange('hits')}
          className={`hover:text-white transition-colors whitespace-nowrap shrink-0 pb-0.5 cursor-pointer ${
            currentTab === 'hits' ? 'text-emerald-400 border-b-2 border-emerald-400' : ''
          }`}
        >
          World Top Hits
        </button>

        <button
          onClick={() => onTabChange('genres')}
          className={`hover:text-white transition-colors whitespace-nowrap shrink-0 pb-0.5 cursor-pointer ${
            currentTab === 'genres' ? 'text-emerald-400 border-b-2 border-emerald-400' : ''
          }`}
        >
          Genres & Charts
        </button>

        <button
          onClick={() => onTabChange('favorites')}
          className={`hover:text-white transition-colors whitespace-nowrap shrink-0 pb-0.5 cursor-pointer flex items-center gap-1.5 ${
            currentTab === 'favorites' ? 'text-emerald-400 border-b-2 border-emerald-400' : ''
          }`}
        >
          <span>Favorites</span>
          {favoritesCount > 0 && (
            <span className="font-mono text-[11px] text-emerald-400 font-bold tabular-nums">
              ({favoritesCount})
            </span>
          )}
        </button>

        <button
          onClick={() => onTabChange('monetag')}
          className={`hover:text-white transition-colors whitespace-nowrap shrink-0 pb-0.5 cursor-pointer flex items-center gap-1.5 ${
            currentTab === 'monetag' ? 'text-emerald-400 border-b-2 border-emerald-400' : ''
          }`}
        >
          <Shield className="w-3.5 h-3.5 text-slate-400" />
          <span>Monetag Zones</span>
        </button>
      </nav>

      {/* Zone 3: Primary Action CTA */}
      <div className="flex items-center gap-2.5 shrink-0">
        <button
          onClick={onOpenVipModal}
          className={`py-2 px-3.5 sm:px-4 rounded-xl text-xs font-bold transition-all duration-200 flex items-center gap-2 cursor-pointer shadow-sm ${
            vipProgress.unlocked
              ? 'bg-gradient-to-r from-amber-500 to-yellow-400 text-black shadow-amber-500/20'
              : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border border-amber-500/40 hover:border-amber-400'
          }`}
        >
          <Crown className={`w-3.5 h-3.5 ${vipProgress.unlocked ? 'fill-black' : 'text-amber-400'}`} />
          <span className="whitespace-nowrap">
            {vipProgress.unlocked ? 'VIP Member' : `$1 VIP Pass (${vipProgress.clicks}/2)`}
          </span>
        </button>
      </div>
    </header>
  );
};
