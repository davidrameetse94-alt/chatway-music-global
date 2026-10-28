/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { 
  Search, Play, Pause, Disc3, ShieldCheck, Zap, RefreshCw, 
  Crown, Heart, Video, Sparkles, Filter, Music, AlertCircle, Volume2
} from 'lucide-react';
import { Track, VipProgress } from './types/music';
import { Navbar } from './components/Navbar';
import { TrackCard } from './components/TrackCard';
import { PlayerBar } from './components/PlayerBar';
import { AppOpenAdModal } from './components/AppOpenAdModal';
import { InterstitialAdModal } from './components/InterstitialAdModal';
import { RewardedAdModal } from './components/RewardedAdModal';
import { FullVideoModal } from './components/FullVideoModal';
import { VipPassModal } from './components/VipPassModal';
import { MonetagInspector } from './components/MonetagInspector';

const GENRES = [
  'World Top Hits',
  'Global Pop',
  'Afrobeats',
  'Hip-Hop',
  'Latin Hits',
  'Electronic EDM',
  'Rock & Alternative',
  'R&B Soul',
  'K-Pop'
];

export default function App() {
  // Navigation & filter states
  const [currentTab, setCurrentTab] = useState<'hits' | 'favorites' | 'genres' | 'monetag'>('hits');
  const [selectedGenre, setSelectedGenre] = useState<string>('World Top Hits');
  const [searchQuery, setSearchQuery] = useState<string>('');
  
  // Tracks & loading
  const [tracks, setTracks] = useState<Track[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [fetchError, setFetchError] = useState<string | null>(null);

  // Audio Player State
  const [currentTrack, setCurrentTrack] = useState<Track | null>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [duration, setDuration] = useState<number>(30);
  const [volume, setVolume] = useState<number>(0.85);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [isLooping, setIsLooping] = useState<boolean>(false);
  const [isShuffle, setIsShuffle] = useState<boolean>(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // User engagement & Monetag state
  const [previewCount, setPreviewCount] = useState<number>(0);
  const [unlockedVideoIds, setUnlockedVideoIds] = useState<number[]>(() => {
    try {
      const saved = localStorage.getItem('chatway_unlocked_videos');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [favorites, setFavorites] = useState<number[]>(() => {
    try {
      const saved = localStorage.getItem('chatway_favorites');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [vipProgress, setVipProgress] = useState<VipProgress>(() => {
    try {
      const savedClicks = Number(localStorage.getItem('chatway_cpa_clicks') || '0');
      return {
        clicks: savedClicks,
        unlocked: savedClicks >= 2,
        totalEarningsSimulated: Math.min(1.0, savedClicks * 0.5),
      };
    } catch {
      return { clicks: 0, unlocked: false, totalEarningsSimulated: 0 };
    }
  });

  // Modals state
  const [showAppOpenModal, setShowAppOpenModal] = useState<boolean>(false);
  const [showInterstitialModal, setShowInterstitialModal] = useState<boolean>(false);
  const [rewardedTrack, setRewardedTrack] = useState<Track | null>(null);
  const [videoModalTrack, setVideoModalTrack] = useState<Track | null>(null);
  const [showVipModal, setShowVipModal] = useState<boolean>(false);

  // Trigger AppOpen modal on first session load
  useEffect(() => {
    const hasSeenAppOpen = sessionStorage.getItem('chatway_has_seen_appopen');
    if (!hasSeenAppOpen) {
      // Small timeout for smooth entrance
      const timer = setTimeout(() => {
        setShowAppOpenModal(true);
        sessionStorage.setItem('chatway_has_seen_appopen', 'true');
      }, 700);
      return () => clearTimeout(timer);
    }
  }, []);

  // Fetch Tracks from iTunes API
  const fetchTracks = useCallback(async (searchTerm: string) => {
    setIsLoading(true);
    setFetchError(null);
    try {
      const query = encodeURIComponent(searchTerm || 'World Top Hits');
      const response = await fetch(`https://itunes.apple.com/search?term=${query}&media=music&limit=50`);
      
      if (!response.ok) {
        throw new Error(`iTunes API responded with status ${response.status}`);
      }

      const data = await response.json();
      if (data.results && data.results.length > 0) {
        // Filter out items without valid previewUrls
        const validTracks: Track[] = data.results.filter((item: any) => Boolean(item.previewUrl && item.trackName));
        setTracks(validTracks);
        if (!currentTrack && validTracks.length > 0) {
          setCurrentTrack(validTracks[0]);
        }
      } else {
        setTracks([]);
      }
    } catch (err: any) {
      console.error('Error fetching iTunes tracks:', err);
      setFetchError(err.message || 'Failed to load tracks. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }, [currentTrack]);

  // Initial load
  useEffect(() => {
    fetchTracks(selectedGenre);
  }, [selectedGenre, fetchTracks]);

  // Handle Search Input with debounce
  useEffect(() => {
    if (!searchQuery.trim()) return;
    const timeout = setTimeout(() => {
      fetchTracks(searchQuery);
    }, 500);
    return () => clearTimeout(timeout);
  }, [searchQuery, fetchTracks]);

  // Record CPA click for VIP progress
  const recordCpaClick = () => {
    setVipProgress((prev) => {
      const newClicks = prev.clicks + 1;
      const isNowUnlocked = newClicks >= 2;
      localStorage.setItem('chatway_cpa_clicks', newClicks.toString());
      return {
        clicks: newClicks,
        unlocked: isNowUnlocked,
        totalEarningsSimulated: Math.min(1.0, newClicks * 0.5),
      };
    });
  };

  // Toggle Favorite
  const handleToggleLike = (track: Track) => {
    setFavorites((prev) => {
      const exists = prev.includes(track.trackId);
      const updated = exists ? prev.filter((id) => id !== track.trackId) : [...prev, track.trackId];
      localStorage.setItem('chatway_favorites', JSON.stringify(updated));
      return updated;
    });
  };

  // Play a Track & Check Interstitial Frequency (Every 3 songs previewed)
  const handlePreviewTrack = (track: Track) => {
    if (currentTrack?.trackId === track.trackId) {
      // Toggle current
      if (isPlaying) {
        audioRef.current?.pause();
        setIsPlaying(false);
      } else {
        audioRef.current?.play().catch((e) => console.warn(e));
        setIsPlaying(true);
      }
      return;
    }

    // New song previewed
    const newCount = previewCount + 1;
    setPreviewCount(newCount);

    setCurrentTrack(track);
    setIsPlaying(true);
    setCurrentTime(0);

    // After 3 songs previewed, show InterstitialAdModal for zone 12141366 (unless VIP active)
    if (!vipProgress.unlocked && newCount > 0 && newCount % 3 === 0) {
      setShowInterstitialModal(true);
    }
  };

  // Play next track in list
  const handleNextTrack = () => {
    if (!tracks.length || !currentTrack) return;
    const currentIndex = tracks.findIndex((t) => t.trackId === currentTrack.trackId);
    let nextIndex = 0;
    if (isShuffle) {
      nextIndex = Math.floor(Math.random() * tracks.length);
    } else {
      nextIndex = (currentIndex + 1) % tracks.length;
    }
    handlePreviewTrack(tracks[nextIndex]);
  };

  // Play previous track
  const handlePreviousTrack = () => {
    if (!tracks.length || !currentTrack) return;
    const currentIndex = tracks.findIndex((t) => t.trackId === currentTrack.trackId);
    const prevIndex = (currentIndex - 1 + tracks.length) % tracks.length;
    handlePreviewTrack(tracks[prevIndex]);
  };

  // Full Video button clicked on track card
  const handleFullVideoClick = (track: Track) => {
    const isUnlocked = unlockedVideoIds.includes(track.trackId);
    if (isUnlocked || vipProgress.unlocked) {
      // Directly open video player
      setVideoModalTrack(track);
    } else {
      // Show RewardedAdModal for zone 12141355 (Watch 15s = unlock)
      setRewardedTrack(track);
    }
  };

  // Successful reward watch completion
  const handleRewardUnlock = (track: Track) => {
    const updated = [...unlockedVideoIds, track.trackId];
    setUnlockedVideoIds(updated);
    localStorage.setItem('chatway_unlocked_videos', JSON.stringify(updated));
    setRewardedTrack(null);
    setVideoModalTrack(track);
  };

  // Audio event listeners
  const handleAudioTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
      if (audioRef.current.duration) {
        setDuration(audioRef.current.duration);
      }
    }
  };

  const handleAudioEnded = () => {
    if (isLooping) {
      if (audioRef.current) {
        audioRef.current.currentTime = 0;
        audioRef.current.play();
      }
    } else {
      handleNextTrack();
    }
  };

  const handleSeek = (time: number) => {
    setCurrentTime(time);
    if (audioRef.current) {
      audioRef.current.currentTime = time;
    }
  };

  const handleVolumeChange = (newVol: number) => {
    setVolume(newVol);
    if (audioRef.current) {
      audioRef.current.volume = newVol;
      audioRef.current.muted = false;
    }
    setIsMuted(false);
  };

  const handleToggleMute = () => {
    if (audioRef.current) {
      audioRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  // Sync audio element when currentTrack or isPlaying changes
  useEffect(() => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.play().catch((err) => {
        console.warn('Playback error / auto-play blocked:', err);
        setIsPlaying(false);
      });
    } else {
      audioRef.current.pause();
    }
  }, [currentTrack, isPlaying]);

  // Tracks to display based on tab
  const displayedTracks = tracks.filter((t) => {
    if (currentTab === 'favorites') {
      return favorites.includes(t.trackId);
    }
    return true;
  });

  return (
    <div className="min-h-screen bg-[#080b11] text-slate-100 flex flex-col selection:bg-emerald-500 selection:text-black">
      {/* Hidden persistent Audio Driver */}
      {currentTrack && (
        <audio
          ref={audioRef}
          src={currentTrack.previewUrl}
          onTimeUpdate={handleAudioTimeUpdate}
          onEnded={handleAudioEnded}
          loop={isLooping}
        />
      )}

      {/* Navigation Header */}
      <Navbar
        currentTab={currentTab}
        onTabChange={(tab) => {
          setCurrentTab(tab);
          if (tab === 'hits') {
            setSelectedGenre('World Top Hits');
          }
        }}
        favoritesCount={favorites.length}
        vipProgress={vipProgress}
        onOpenVipModal={() => setShowVipModal(true)}
        onOpenAdZoneInspector={() => setCurrentTab('monetag')}
      />

      {/* Main Content Area */}
      <main className="flex-1 pb-28 md:pb-32">
        {currentTab === 'monetag' ? (
          <MonetagInspector
            vipProgress={vipProgress}
            onRecordCpaClick={recordCpaClick}
            onOpenAppOpenModal={() => setShowAppOpenModal(true)}
            onOpenInterstitialModal={() => setShowInterstitialModal(true)}
            onOpenRewardedModal={() => {
              if (tracks.length > 0) setRewardedTrack(tracks[0]);
            }}
          />
        ) : (
          <div className="max-w-7xl mx-auto px-4 sm:px-8 pt-6">
            
            {/* Hero / Filter Bar */}
            <div className="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                  {currentTab === 'favorites' ? (
                    'Your Favorite Tracks'
                  ) : (
                    <span>
                      {selectedGenre} <span className="text-emerald-400">· Global Charts</span>
                    </span>
                  )}
                </h1>
                <div className="mt-1 flex items-center gap-2 text-xs text-slate-400">
                  <span>iTunes Music API</span>
                  <span>·</span>
                  <span className="font-mono tabular-nums">{displayedTracks.length} tracks available</span>
                  <span>·</span>
                  <span className="text-emerald-400 font-medium">30s Lossless Previews</span>
                  {previewCount > 0 && (
                    <>
                      <span>·</span>
                      <span className="font-mono tabular-nums text-slate-400">
                        {previewCount} previewed {vipProgress.unlocked ? '(VIP Ad-Free)' : `(${previewCount % 3}/3 for Interstitial)`}
                      </span>
                    </>
                  )}
                </div>
              </div>

              {/* Search Bar */}
              <div className="relative w-full md:w-80">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search tracks, artists, hits..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-slate-900/80 border border-white/10 rounded-xl text-xs text-white placeholder-slate-400 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all"
                />
                {searchQuery && (
                  <button
                    onClick={() => {
                      setSearchQuery('');
                      fetchTracks(selectedGenre);
                    }}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-white"
                  >
                    Clear
                  </button>
                )}
              </div>
            </div>

            {/* VIP Notification Bar (if not yet complete) */}
            {!vipProgress.unlocked && (
              <div className="mb-6 p-3.5 rounded-xl bg-gradient-to-r from-amber-950/40 via-slate-900/80 to-slate-900/80 border border-amber-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="p-1.5 rounded-lg bg-amber-500/20 text-amber-400">
                    <Crown className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-white">
                      Unlock $1 VIP Pass via Direct Link CPA (2 Clicks)
                    </h4>
                    <p className="text-[11px] text-slate-300">
                      Skip all 3-song interstitials and unlock full videos instantly. Progress: {vipProgress.clicks}/2 clicks.
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => setShowVipModal(true)}
                  className="py-1.5 px-3.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-black text-xs font-bold transition-all shrink-0 cursor-pointer text-center"
                >
                  View $1 CPA Offer
                </button>
              </div>
            )}

            {/* Genre Filter Tabs (Functional segmented filter controls) */}
            {currentTab !== 'favorites' && (
              <div className="flex items-center gap-1.5 overflow-x-auto pb-3 mb-6 no-scrollbar">
                {GENRES.map((genre) => (
                  <button
                    key={genre}
                    onClick={() => {
                      setSelectedGenre(genre);
                      setSearchQuery('');
                    }}
                    className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg whitespace-nowrap transition-colors cursor-pointer ${
                      selectedGenre === genre && !searchQuery
                        ? 'bg-emerald-500 text-black shadow-md shadow-emerald-500/20'
                        : 'bg-slate-900/60 hover:bg-slate-800 text-slate-300 hover:text-white border border-white/5'
                    }`}
                  >
                    {genre}
                  </button>
                ))}
              </div>
            )}

            {/* Loading State */}
            {isLoading && (
              <div className="py-20 flex flex-col items-center justify-center text-center">
                <Disc3 className="w-10 h-10 text-emerald-400 animate-spin mb-3" />
                <p className="text-sm font-semibold text-white">Fetching World Top Hits...</p>
                <p className="text-xs text-slate-400 mt-1">Connecting to official iTunes catalog</p>
              </div>
            )}

            {/* Error State */}
            {!isLoading && fetchError && (
              <div className="py-16 p-6 rounded-2xl bg-rose-950/20 border border-rose-500/30 text-center max-w-lg mx-auto">
                <AlertCircle className="w-8 h-8 text-rose-400 mx-auto mb-2" />
                <h3 className="text-base font-bold text-white">Unable to fetch songs</h3>
                <p className="text-xs text-slate-300 mt-1 mb-4">{fetchError}</p>
                <button
                  onClick={() => fetchTracks(selectedGenre)}
                  className="px-4 py-2 rounded-lg bg-rose-600 hover:bg-rose-500 text-white text-xs font-semibold inline-flex items-center gap-2 cursor-pointer"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Retry Search</span>
                </button>
              </div>
            )}

            {/* Empty Favorites State */}
            {!isLoading && !fetchError && currentTab === 'favorites' && displayedTracks.length === 0 && (
              <div className="py-20 text-center max-w-md mx-auto">
                <div className="w-16 h-16 rounded-2xl bg-slate-900 border border-white/10 flex items-center justify-center mx-auto mb-4 text-slate-500">
                  <Heart className="w-8 h-8" />
                </div>
                <h3 className="text-lg font-bold text-white">No favorite tracks yet</h3>
                <p className="text-xs text-slate-400 mt-1 mb-5">
                  Click the heart icon on any music card to save tracks to your personal collection.
                </p>
                <button
                  onClick={() => setCurrentTab('hits')}
                  className="px-4 py-2 rounded-lg bg-emerald-500 text-black text-xs font-bold hover:bg-emerald-400 transition-colors cursor-pointer"
                >
                  Explore Top Hits
                </button>
              </div>
            )}

            {/* Music Tracks Grid (Spotify-style layout) */}
            {!isLoading && !fetchError && displayedTracks.length > 0 && (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {displayedTracks.map((track) => (
                  <TrackCard
                    key={track.trackId}
                    track={track}
                    isPlaying={isPlaying}
                    isCurrentTrack={currentTrack?.trackId === track.trackId}
                    isLiked={favorites.includes(track.trackId)}
                    isVideoUnlocked={unlockedVideoIds.includes(track.trackId) || vipProgress.unlocked}
                    onPreviewClick={handlePreviewTrack}
                    onFullVideoClick={handleFullVideoClick}
                    onToggleLike={handleToggleLike}
                  />
                ))}
              </div>
            )}

          </div>
        )}
      </main>

      {/* Persistent Bottom Player Bar */}
      <PlayerBar
        currentTrack={currentTrack}
        isPlaying={isPlaying}
        currentTime={currentTime}
        duration={duration}
        volume={volume}
        isMuted={isMuted}
        isLooping={isLooping}
        isShuffle={isShuffle}
        isLiked={currentTrack ? favorites.includes(currentTrack.trackId) : false}
        isVideoUnlocked={currentTrack ? unlockedVideoIds.includes(currentTrack.trackId) || vipProgress.unlocked : false}
        onTogglePlay={() => {
          if (!currentTrack && tracks.length > 0) {
            handlePreviewTrack(tracks[0]);
          } else {
            setIsPlaying(!isPlaying);
          }
        }}
        onPrevious={handlePreviousTrack}
        onNext={handleNextTrack}
        onSeek={handleSeek}
        onVolumeChange={handleVolumeChange}
        onToggleMute={handleToggleMute}
        onToggleLoop={() => setIsLooping(!isLooping)}
        onToggleShuffle={() => setIsShuffle(!isShuffle)}
        onToggleLike={handleToggleLike}
        onOpenFullVideo={handleFullVideoClick}
      />

      {/* 1. AppOpen Ad Modal (Zone 12141348 + $0.50 CPA Direct Link) */}
      <AppOpenAdModal
        isOpen={showAppOpenModal}
        onClose={() => setShowAppOpenModal(false)}
        vipProgress={vipProgress}
        onRecordCpaClick={recordCpaClick}
      />

      {/* 2. Interstitial Ad Modal (Zone 12141366 triggered after 3 songs) */}
      <InterstitialAdModal
        isOpen={showInterstitialModal}
        onClose={() => setShowInterstitialModal(false)}
        previewCount={previewCount}
      />

      {/* 3. Rewarded Ad Modal (Zone 12141355 - Watch 15s to unlock video) */}
      <RewardedAdModal
        isOpen={Boolean(rewardedTrack)}
        track={rewardedTrack}
        onClose={() => setRewardedTrack(null)}
        onUnlockSuccess={handleRewardUnlock}
        isVip={vipProgress.unlocked}
      />

      {/* Full HD Video Player Modal */}
      <FullVideoModal
        isOpen={Boolean(videoModalTrack)}
        track={videoModalTrack}
        onClose={() => setVideoModalTrack(null)}
        onTrackSelect={handlePreviewTrack}
      />

      {/* VIP Pass CPA Modal */}
      <VipPassModal
        isOpen={showVipModal}
        onClose={() => setShowVipModal(false)}
        vipProgress={vipProgress}
        onRecordCpaClick={recordCpaClick}
      />
    </div>
  );
}
