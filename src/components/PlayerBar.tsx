import React from 'react';
import { 
  Play, Pause, SkipBack, SkipForward, Volume2, VolumeX, 
  Repeat, Shuffle, Heart, Video, Disc3, Sparkles 
} from 'lucide-react';
import { Track } from '../types/music';

interface PlayerBarProps {
  currentTrack: Track | null;
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  volume: number;
  isMuted: boolean;
  isLooping: boolean;
  isShuffle: boolean;
  isLiked: boolean;
  isVideoUnlocked: boolean;
  onTogglePlay: () => void;
  onPrevious: () => void;
  onNext: () => void;
  onSeek: (time: number) => void;
  onVolumeChange: (val: number) => void;
  onToggleMute: () => void;
  onToggleLoop: () => void;
  onToggleShuffle: () => void;
  onToggleLike: (track: Track) => void;
  onOpenFullVideo: (track: Track) => void;
}

export const PlayerBar: React.FC<PlayerBarProps> = ({
  currentTrack,
  isPlaying,
  currentTime,
  duration,
  volume,
  isMuted,
  isLooping,
  isShuffle,
  isLiked,
  isVideoUnlocked,
  onTogglePlay,
  onPrevious,
  onNext,
  onSeek,
  onVolumeChange,
  onToggleMute,
  onToggleLoop,
  onToggleShuffle,
  onToggleLike,
  onOpenFullVideo,
}) => {
  if (!currentTrack) return null;

  const formatTime = (secs: number) => {
    if (isNaN(secs)) return '0:00';
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const highResArtwork = currentTrack.artworkUrl100.replace('100x100bb', '300x300bb');

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 bg-[#090d16]/95 backdrop-blur-xl border-t border-white/10 px-4 py-2.5 sm:py-3 transition-all duration-300">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        
        {/* Left Track Info */}
        <div className="flex items-center gap-3 min-w-0 w-1/4 sm:w-1/3">
          <div className="relative w-11 h-11 sm:w-13 sm:h-13 rounded-lg overflow-hidden shrink-0 bg-slate-900 shadow-md">
            <img
              src={highResArtwork}
              alt={currentTrack.trackName}
              referrerPolicy="no-referrer"
              className={`w-full h-full object-cover transition-transform duration-700 ${
                isPlaying ? 'scale-105' : ''
              }`}
            />
            {isPlaying && (
              <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                <Disc3 className="w-5 h-5 text-emerald-400 animate-spin" />
              </div>
            )}
          </div>

          <div className="min-w-0">
            <h5 className="text-xs sm:text-sm font-bold text-white truncate hover:text-emerald-400 transition-colors">
              {currentTrack.trackName}
            </h5>
            <p className="text-[11px] sm:text-xs text-slate-400 truncate">
              {currentTrack.artistName}
            </p>
          </div>

          <button
            onClick={() => onToggleLike(currentTrack)}
            className="hidden sm:block p-1.5 text-slate-400 hover:text-rose-500 transition-colors"
            title={isLiked ? 'Unlike' : 'Like'}
          >
            <Heart className={`w-4 h-4 ${isLiked ? 'fill-rose-500 text-rose-500' : ''}`} />
          </button>
        </div>

        {/* Center: Controls & Scrubber */}
        <div className="flex-1 max-w-xl flex flex-col items-center">
          <div className="flex items-center gap-3 sm:gap-5 mb-1">
            <button
              onClick={onToggleShuffle}
              className={`p-1.5 transition-colors ${
                isShuffle ? 'text-emerald-400' : 'text-slate-400 hover:text-white'
              }`}
              title="Shuffle"
            >
              <Shuffle className="w-4 h-4" />
            </button>

            <button
              onClick={onPrevious}
              className="p-1.5 text-slate-300 hover:text-white transition-colors"
              title="Previous"
            >
              <SkipBack className="w-4 h-4 fill-current" />
            </button>

            <button
              onClick={onTogglePlay}
              className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-emerald-500 hover:bg-emerald-400 text-black flex items-center justify-center shadow-lg shadow-emerald-500/25 transition-transform active:scale-95 cursor-pointer"
              title={isPlaying ? 'Pause' : 'Play'}
            >
              {isPlaying ? (
                <Pause className="w-4 h-4 fill-black" />
              ) : (
                <Play className="w-4 h-4 fill-black ml-0.5" />
              )}
            </button>

            <button
              onClick={onNext}
              className="p-1.5 text-slate-300 hover:text-white transition-colors"
              title="Next"
            >
              <SkipForward className="w-4 h-4 fill-current" />
            </button>

            <button
              onClick={onToggleLoop}
              className={`p-1.5 transition-colors ${
                isLooping ? 'text-emerald-400' : 'text-slate-400 hover:text-white'
              }`}
              title="Repeat"
            >
              <Repeat className="w-4 h-4" />
            </button>
          </div>

          {/* Time scrubber */}
          <div className="w-full flex items-center gap-2 text-[11px] font-mono text-slate-400">
            <span className="w-8 text-right tabular-nums">{formatTime(currentTime)}</span>
            <input
              type="range"
              min="0"
              max={duration || 30}
              step="0.1"
              value={currentTime}
              onChange={(e) => onSeek(Number(e.target.value))}
              className="flex-1 h-1 bg-slate-800 rounded-full cursor-pointer hover:h-1.5 transition-all"
            />
            <span className="w-8 tabular-nums">{formatTime(duration || 30)}</span>
          </div>
        </div>

        {/* Right: Volume & Full Video Trigger */}
        <div className="hidden sm:flex items-center justify-end gap-3 w-1/4 sm:w-1/3">
          <button
            onClick={() => onOpenFullVideo(currentTrack)}
            className={`py-1.5 px-3 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors ${
              isVideoUnlocked
                ? 'bg-purple-600 hover:bg-purple-500 text-white'
                : 'bg-slate-800 hover:bg-slate-700 text-purple-300 border border-purple-500/30'
            }`}
          >
            <Video className="w-3.5 h-3.5" />
            <span>{isVideoUnlocked ? 'Video' : 'Unlock Video'}</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={onToggleMute}
              className="p-1.5 text-slate-400 hover:text-white transition-colors"
            >
              {isMuted || volume === 0 ? (
                <VolumeX className="w-4 h-4 text-rose-400" />
              ) : (
                <Volume2 className="w-4 h-4" />
              )}
            </button>

            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={isMuted ? 0 : volume}
              onChange={(e) => onVolumeChange(Number(e.target.value))}
              className="w-16 h-1 bg-slate-800 rounded-full cursor-pointer"
            />
          </div>
        </div>

      </div>
    </div>
  );
};
