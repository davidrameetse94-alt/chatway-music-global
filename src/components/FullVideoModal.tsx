import React, { useState, useRef, useEffect } from 'react';
import { 
  X, Play, Pause, Volume2, VolumeX, Maximize2, ExternalLink, 
  Share2, Sparkles, Music, Disc3, ShieldCheck, Check
} from 'lucide-react';
import { Track } from '../types/music';

interface FullVideoModalProps {
  isOpen: boolean;
  track: Track | null;
  onClose: () => void;
  onTrackSelect: (track: Track) => void;
}

export const FullVideoModal: React.FC<FullVideoModalProps> = ({
  isOpen,
  track,
  onClose,
  onTrackSelect,
}) => {
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [duration, setDuration] = useState<number>(30);
  const [activeTab, setActiveTab] = useState<'video' | 'lyrics' | 'info'>('video');
  const [copied, setCopied] = useState<boolean>(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (isOpen && track && audioRef.current) {
      audioRef.current.currentTime = 0;
      audioRef.current.play().catch(e => console.warn('Autoplay blocked:', e));
      setIsPlaying(true);
    }
  }, [isOpen, track]);

  if (!isOpen || !track) return null;

  const highResArtwork = track.artworkUrl100.replace('100x100bb', '800x800bb');
  const youtubeSearchUrl = `https://www.youtube.com/results?search_query=${encodeURIComponent(
    track.artistName + ' ' + track.trackName + ' Official Music Video'
  )}`;

  const togglePlay = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play().catch(e => console.warn(e));
      setIsPlaying(true);
    }
  };

  const toggleMute = () => {
    if (!audioRef.current) return;
    audioRef.current.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
      if (audioRef.current.duration) {
        setDuration(audioRef.current.duration);
      }
    }
  };

  const handleScrub = (e: React.ChangeEvent<HTMLInputElement>) => {
    const time = Number(e.target.value);
    setCurrentTime(time);
    if (audioRef.current) {
      audioRef.current.currentTime = time;
    }
  };

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(
        `🎵 Listening to "${track.trackName}" by ${track.artistName} on ChatWay Music Global! ${track.trackViewUrl || ''}`
      );
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/90 backdrop-blur-xl animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl rounded-2xl bg-[#0a0d16] border border-white/10 shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Top bar */}
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-white/10 bg-slate-900/60">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
            <span className="text-xs font-semibold uppercase tracking-wider text-emerald-400">
              Unlocked Full HD Studio Experience
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleShare}
              className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors flex items-center gap-1.5 text-xs"
              title="Share Track"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Share2 className="w-4 h-4" />}
              <span className="hidden sm:inline">{copied ? 'Copied' : 'Share'}</span>
            </button>
            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Video Canvas / Visualizer Area */}
        <div className="relative flex-1 bg-black overflow-hidden min-h-[260px] sm:min-h-[380px] flex items-center justify-center">
          {/* Animated Ambient background */}
          <div
            className="absolute inset-0 bg-cover bg-center opacity-30 filter blur-3xl scale-110 transition-transform duration-1000"
            style={{ backgroundImage: `url(${highResArtwork})` }}
          />

          {/* Canvas or visual presentation */}
          <div className="relative z-10 flex flex-col items-center justify-center text-center p-6 w-full max-w-md">
            <div className="relative group">
              <div className="w-44 h-44 sm:w-56 sm:h-56 rounded-2xl overflow-hidden shadow-2xl border border-white/15 relative">
                <img
                  src={highResArtwork}
                  alt={track.trackName}
                  referrerPolicy="no-referrer"
                  className={`w-full h-full object-cover transition-transform duration-700 ${
                    isPlaying ? 'scale-105' : 'scale-100'
                  }`}
                />
                {/* Audio wave overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end justify-center pb-4">
                  <div className="flex items-center gap-1">
                    {[16, 28, 44, 20, 36, 48, 24, 40, 18].map((h, i) => (
                      <span
                        key={i}
                        className={`w-1 rounded-full bg-emerald-400 ${
                          isPlaying ? 'animate-pulse' : 'opacity-40'
                        }`}
                        style={{
                          height: isPlaying ? `${(h * (0.6 + ((i % 3) * 0.2)))}px` : '6px',
                          animationDuration: `${0.4 + (i % 4) * 0.2}s`
                        }}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-4 text-center">
              <h3 className="text-xl sm:text-2xl font-bold text-white tracking-tight truncate max-w-sm">
                {track.trackName}
              </h3>
              <p className="text-sm text-slate-300 mt-1 truncate">
                {track.artistName} {track.collectionName ? `— ${track.collectionName}` : ''}
              </p>
              <div className="mt-2 flex items-center justify-center gap-2 text-xs text-slate-400">
                <span>{track.primaryGenreName || 'World Hit'}</span>
                <span>·</span>
                <span className="font-mono tabular-nums">{track.releaseDate ? new Date(track.releaseDate).getFullYear() : '2026'}</span>
                <span>·</span>
                <span className="text-emerald-400 font-medium">Unlocked HD Video Preview</span>
              </div>
            </div>
          </div>

          {/* Hidden audio element driving the player */}
          <audio
            ref={audioRef}
            src={track.previewUrl}
            onTimeUpdate={handleTimeUpdate}
            onEnded={() => setIsPlaying(false)}
          />
        </div>

        {/* Video Player Controls Bar */}
        <div className="p-4 sm:p-5 bg-slate-900/95 border-t border-white/10 space-y-3">
          {/* Scrubber */}
          <div className="flex items-center gap-3 text-xs text-slate-400 font-mono">
            <span className="w-10 text-right tabular-nums">{formatTime(currentTime)}</span>
            <input
              type="range"
              min="0"
              max={duration || 30}
              step="0.1"
              value={currentTime}
              onChange={handleScrub}
              className="flex-1 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
            />
            <span className="w-10 tabular-nums">{formatTime(duration || 30)}</span>
          </div>

          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <button
                onClick={togglePlay}
                className="w-10 h-10 rounded-full bg-emerald-500 hover:bg-emerald-400 text-black flex items-center justify-center transition-all shadow-md shadow-emerald-500/20 active:scale-95 cursor-pointer"
              >
                {isPlaying ? <Pause className="w-5 h-5 fill-black" /> : <Play className="w-5 h-5 fill-black ml-0.5" />}
              </button>

              <button
                onClick={toggleMute}
                className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
              >
                {isMuted ? <VolumeX className="w-5 h-5 text-rose-400" /> : <Volume2 className="w-5 h-5" />}
              </button>

              <div className="hidden sm:flex items-center gap-1.5 text-xs text-slate-400">
                <Disc3 className={`w-4 h-4 text-emerald-400 ${isPlaying ? 'animate-spin' : ''}`} />
                <span>Lossless 320kbps Audio</span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {/* Direct YouTube Video search button */}
              <a
                href={youtubeSearchUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-3.5 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-sm"
              >
                <span>Watch on YouTube</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>

              {track.trackViewUrl && (
                <a
                  href={track.trackViewUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-1.5 transition-colors border border-white/5"
                >
                  <span>Apple Music</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
