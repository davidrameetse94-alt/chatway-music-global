import React from 'react';
import { Play, Pause, Video, Heart, Music, ExternalLink, Sparkles } from 'lucide-react';
import { Track } from '../types/music';

interface TrackCardProps {
  track: Track;
  isPlaying: boolean;
  isCurrentTrack: boolean;
  isLiked: boolean;
  isVideoUnlocked: boolean;
  onPreviewClick: (track: Track) => void;
  onFullVideoClick: (track: Track) => void;
  onToggleLike: (track: Track) => void;
}

export const TrackCard: React.FC<TrackCardProps> = ({
  track,
  isPlaying,
  isCurrentTrack,
  isLiked,
  isVideoUnlocked,
  onPreviewClick,
  onFullVideoClick,
  onToggleLike,
}) => {
  // Upgrade iTunes 100x100 to 600x600 for high-fidelity artwork
  const highResArtwork = track.artworkUrl100.replace('100x100bb', '600x600bb');
  const releaseYear = track.releaseDate ? new Date(track.releaseDate).getFullYear() : '';
  const durationSecs = track.trackTimeMillis ? Math.round(track.trackTimeMillis / 1000) : 30;
  const durationFormatted = `${Math.floor(durationSecs / 60)}:${(durationSecs % 60).toString().padStart(2, '0')}`;

  return (
    <div className={`group relative rounded-xl p-3 bg-slate-900/40 hover:bg-slate-800/80 border transition-all duration-200 flex flex-col justify-between ${
      isCurrentTrack ? 'border-emerald-500/50 shadow-lg shadow-emerald-950/40 bg-slate-800/60' : 'border-white/5 hover:border-white/15'
    }`}>
      {/* Artwork with overlay button */}
      <div className="relative aspect-square w-full rounded-lg overflow-hidden bg-slate-950 mb-3 shadow-md">
        <img
          src={highResArtwork}
          alt={track.trackName}
          referrerPolicy="no-referrer"
          loading="lazy"
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />

        {/* Floating Like Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggleLike(track);
          }}
          className={`absolute top-2.5 right-2.5 p-1.5 rounded-full backdrop-blur-md transition-all cursor-pointer ${
            isLiked
              ? 'bg-rose-500 text-white shadow-md'
              : 'bg-black/50 text-slate-300 hover:text-white hover:bg-black/80 opacity-0 group-hover:opacity-100'
          }`}
          title={isLiked ? 'Remove from favorites' : 'Add to favorites'}
        >
          <Heart className={`w-3.5 h-3.5 ${isLiked ? 'fill-white' : ''}`} />
        </button>

        {/* Hover / Active Play Button Overlay */}
        <div className={`absolute inset-0 bg-black/40 backdrop-blur-[2px] flex items-center justify-center transition-opacity duration-200 ${
          isCurrentTrack ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
        }`}>
          <button
            onClick={() => onPreviewClick(track)}
            className="w-12 h-12 rounded-full bg-emerald-500 hover:bg-emerald-400 text-black flex items-center justify-center shadow-xl shadow-emerald-500/30 transition-transform active:scale-95 cursor-pointer"
            title={isCurrentTrack && isPlaying ? 'Pause preview' : 'Play 30s preview'}
          >
            {isCurrentTrack && isPlaying ? (
              <Pause className="w-5 h-5 fill-black" />
            ) : (
              <Play className="w-5 h-5 fill-black ml-0.5" />
            )}
          </button>
        </div>

        {/* Video Unlocked Indicator */}
        {isVideoUnlocked && (
          <div className="absolute bottom-2 left-2 px-2 py-0.5 rounded-md bg-purple-950/80 border border-purple-500/40 text-[10px] text-purple-300 font-semibold flex items-center gap-1 backdrop-blur-sm">
            <Video className="w-3 h-3" />
            <span>HD Video Unlocked</span>
          </div>
        )}
      </div>

      {/* Track Information */}
      <div className="flex-1 min-w-0 mb-3">
        <h4 className="text-sm font-bold text-white truncate group-hover:text-emerald-400 transition-colors">
          {track.trackName}
        </h4>
        <p className="text-xs text-slate-400 truncate mt-0.5 font-medium">
          {track.artistName}
        </p>

        {/* Clean unboxed metadata with separators (no pill badges) */}
        <div className="mt-1.5 flex items-center gap-1.5 text-[11px] text-slate-400 font-normal truncate">
          <span>{track.primaryGenreName || 'World Hit'}</span>
          {releaseYear && (
            <>
              <span aria-hidden="true">·</span>
              <span className="font-mono tabular-nums">{releaseYear}</span>
            </>
          )}
          <span aria-hidden="true">·</span>
          <span className="font-mono tabular-nums">{durationFormatted}</span>
        </div>
      </div>

      {/* Primary Action Buttons (Spotify Grid Style: Preview + Full Video) */}
      <div className="grid grid-cols-2 gap-2 pt-2 border-t border-white/5">
        <button
          onClick={() => onPreviewClick(track)}
          className={`py-2 px-2 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer ${
            isCurrentTrack && isPlaying
              ? 'bg-emerald-500 text-black'
              : 'bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white'
          }`}
        >
          {isCurrentTrack && isPlaying ? (
            <>
              <Pause className="w-3.5 h-3.5 fill-current" />
              <span>Playing</span>
            </>
          ) : (
            <>
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>Preview</span>
            </>
          )}
        </button>

        <button
          onClick={() => onFullVideoClick(track)}
          className={`py-2 px-2 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
            isVideoUnlocked
              ? 'bg-purple-600 hover:bg-purple-500 text-white'
              : 'bg-purple-950/60 hover:bg-purple-900/80 text-purple-200 border border-purple-500/30'
          }`}
          title={isVideoUnlocked ? 'Watch Unlocked Full Video' : 'Watch 15s Rewarded Ad (Zone 12141355) to unlock'}
        >
          <Video className="w-3.5 h-3.5" />
          <span>{isVideoUnlocked ? 'Full Video' : 'Full Video 🎬'}</span>
        </button>
      </div>
    </div>
  );
};
