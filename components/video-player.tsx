"use client";

import { useEffect, useRef, useState } from "react";
import Hls from "hls.js";

interface VideoPlayerProps {
  src: string;
  autoPlay?: boolean;
  controls?: boolean;
  muted?: boolean;
  className?: string;
}

export default function VideoPlayer({
  src,
  autoPlay = true,
  controls = true,
  muted = true,
  className = "",
}: VideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState<number | null>(null);
  const [hovering, setHovering] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    let hls: Hls | null = null;

    // Safari: native HLS support
    if (video.canPlayType("application/vnd.apple.mpegurl")) {
      video.src = src;
    } else if (Hls.isSupported()) {
      hls = new Hls({
        lowLatencyMode: true,
        enableWorker: true,
      });

      hls.loadSource(src);
      hls.attachMedia(video);
      hls.on(Hls.Events.ERROR, (_, data) => {
        console.warn("HLS error:", data);
      });
    } else {
      console.warn("HLS not supported in this browser.");
    }

    const onPlay = () => setIsPlaying(true);
    const onPause = () => setIsPlaying(false);

    video.addEventListener("play", onPlay);
    video.addEventListener("pause", onPause);

    return () => {
      video.removeEventListener("play", onPlay);
      video.removeEventListener("pause", onPause);
      if (hls) hls.destroy();
    };
  }, [src]);

  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;

    const onTime = () => setCurrentTime(v.currentTime || 0);
    const onLoaded = () => setDuration(isFinite(v.duration) ? v.duration : null);

    v.addEventListener("timeupdate", onTime);
    v.addEventListener("loadedmetadata", onLoaded);

    return () => {
      v.removeEventListener("timeupdate", onTime);
      v.removeEventListener("loadedmetadata", onLoaded);
    };
  }, []);

  function togglePlay() {
    const v = videoRef.current;
    if (!v) return;
    if (v.paused) v.play();
    else v.pause();
  }

  function enterFullscreen() {
    const el = videoRef.current;
    if (!el) return;
    if (el.requestFullscreen) el.requestFullscreen();
    // fallback for webkit
    // @ts-ignore
    else if (el.webkitEnterFullscreen) el.webkitEnterFullscreen();
  }

  function formatTime(s: number) {
    if (!isFinite(s) || s <= 0) return "0:00";
    const m = Math.floor(s / 60);
    const sec = Math.floor(s % 60)
      .toString()
      .padStart(2, "0");
    return `${m}:${sec}`;
  }

  return (
    <div className="relative rounded-lg overflow-hidden bg-black shadow-2xl ring-1 ring-gray-200">
      <video
        ref={videoRef}
        className={`${className} w-full h-full object-cover bg-black`}
        autoPlay={autoPlay}
        muted={muted}
        controls={false}
        playsInline
        // prevent native context menu (optional)
        onContextMenu={(e) => e.preventDefault()}
      />

      {/* Top-left LIVE/title badge (Netflix-style small pill) */}
      <div className="absolute left-4 top-4 z-20 inline-flex items-center gap-2 rounded-full bg-black/60 px-3 py-1 text-xs font-semibold text-white backdrop-blur-sm">
        <span className="h-2 w-2 rounded-full bg-red-500 animate-pulse" /> LIVE
      </div>

      {/* subtle top gradient for readability */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-black/70 to-transparent" />

      {/* Top-right fullscreen control (kept minimal) */}
      <div className="absolute right-4 top-4 z-20">
        <button
          type="button"
          onClick={enterFullscreen}
          className="rounded-md bg-black/40 px-2 py-1 text-white hover:bg-black/50 cursor-pointer ring-0 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/50"
          aria-label="Fullscreen"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M8 3H5a2 2 0 0 0-2 2v3" />
            <path strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M16 21h3a2 2 0 0 0 2-2v-3" />
            <path strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M21 8V5a2 2 0 0 0-2-2h-3" />
            <path strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M3 16v3a2 2 0 0 0 2 2h3" />
          </svg>
        </button>
      </div>

      {/* Center play/pause overlay */}
      <div
        className="absolute inset-0 z-10 flex items-center justify-center"
        onMouseEnter={() => setHovering(true)}
        onMouseLeave={() => setHovering(false)}
      >
        {/* Center big play when paused */}
        {!isPlaying && (
          <button
            onClick={togglePlay}
            className="flex h-16 w-16 items-center justify-center rounded-full bg-white/95 text-black shadow-2xl hover:scale-105 transition-transform cursor-pointer"
            aria-label="Play"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 ml-1" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M5 3v18l15-9L5 3z" />
            </svg>
          </button>
        )}

        {/* Bottom control bar - Netflix style */}
        {(hovering || !isPlaying) && (
          <div className="absolute left-0 right-0 bottom-0 z-30 flex items-center gap-4 bg-gradient-to-t from-black/80 to-transparent px-4 py-3">
            <button
              onClick={togglePlay}
              className="flex items-center justify-center rounded-full bg-white/90 text-black p-2 hover:scale-105 transition-transform cursor-pointer"
              aria-label={isPlaying ? "Pause" : "Play"}
            >
              {isPlaying ? (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M6 19h4V5H6v14zM14 5v14h4V5h-4z" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M5 3v18l15-9L5 3z" />
                </svg>
              )}
            </button>

            {/* time */}
            <div className="text-xs text-white tabular-nums">{formatTime(currentTime)}{duration ? ` / ${formatTime(duration)}` : ""}</div>

            {/* scrub bar */}
            <input
              aria-label="Seek"
              type="range"
              min={0}
              max={100}
              value={duration ? (currentTime / duration) * 100 : 0}
              onChange={(e) => {
                const v = videoRef.current;
                if (!v || !duration) return;
                const pct = Number(e.target.value);
                v.currentTime = (pct / 100) * duration;
                setCurrentTime(v.currentTime || 0);
              }}
              className="mx-3 h-1 w-full appearance-none bg-white/30 accent-white cursor-pointer"
            />

            <div className="ml-auto flex items-center gap-2">
              <button
                onClick={enterFullscreen}
                className="rounded-md bg-white/6 px-2 py-1 text-white hover:bg-white/10 cursor-pointer"
                aria-label="Fullscreen"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M8 3H5a2 2 0 0 0-2 2v3" />
                  <path strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M16 21h3a2 2 0 0 0 2-2v-3" />
                </svg>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
