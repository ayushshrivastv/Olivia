/**
 * YouTube IFrame API Type Definitions
 */

declare global {
  interface Window {
    YT: typeof YT;
    onYouTubeIframeAPIReady?: () => void;
  }
}

export interface YTPlayer {
  playVideo(): void;
  pauseVideo(): void;
  stopVideo(): void;
  seekTo(seconds: number, allowSeekAhead?: boolean): void;
  getCurrentTime(): number;
  getDuration(): number;
  getVideoUrl(): string;
  getVideoEmbedCode(): string;
  getPlaybackQuality(): string;
  setPlaybackQuality(suggestedQuality: string): void;
  getAvailableQualityLevels(): string[];
  getPlayerState(): number;
  getVolume(): number;
  setVolume(volume: number): void;
  isMuted(): boolean;
  mute(): void;
  unMute(): void;
  getPlaybackRate(): number;
  setPlaybackRate(suggestedRate: number): void;
  destroy(): void;
}

export interface YTOnReadyEvent {
  target: YTPlayer;
}

export interface YTOnStateChangeEvent {
  data: number;
  target: YTPlayer;
}

export interface YTPlayerOptions {
  videoId?: string;
  width?: string | number;
  height?: string | number;
  playerVars?: {
    autoplay?: 0 | 1;
    cc_lang_pref?: string;
    cc_load_policy?: 0 | 1;
    color?: 'red' | 'white';
    controls?: 0 | 1;
    disablekb?: 0 | 1;
    enablejsapi?: 0 | 1;
    end?: number;
    fs?: 0 | 1;
    hl?: string;
    iv_load_policy?: 1 | 3;
    list?: string;
    listType?: 'playlist' | 'user_uploads' | 'search';
    loop?: 0 | 1;
    modestbranding?: 0 | 1;
    mute?: 0 | 1;
    origin?: string;
    playlist?: string;
    playsinline?: 0 | 1;
    rel?: 0 | 1;
    start?: number;
  };
  events?: {
    onReady?: (event: YTOnReadyEvent) => void;
    onStateChange?: (event: YTOnStateChangeEvent) => void;
    onPlaybackQualityChange?: (event: YTOnPlaybackQualityChangeEvent) => void;
    onPlaybackRateChange?: (event: YTOnPlaybackRateChangeEvent) => void;
    onError?: (event: YTOnErrorEvent) => void;
    onApiChange?: (event: YTOnApiChangeEvent) => void;
  };
}

export interface YTOnPlaybackQualityChangeEvent {
  data: string;
  target: YTPlayer;
}

export interface YTOnPlaybackRateChangeEvent {
  data: number;
  target: YTPlayer;
}

export interface YTOnErrorEvent {
  data: number;
  target: YTPlayer;
}

export interface YTOnApiChangeEvent {
  data: number;
  target: YTPlayer;
}

declare namespace YT {
  class Player {
    constructor(elementId: string | HTMLElement, options: YTPlayerOptions);
    playVideo(): void;
    pauseVideo(): void;
    stopVideo(): void;
    seekTo(seconds: number, allowSeekAhead?: boolean): void;
    getCurrentTime(): number;
    getDuration(): number;
    getVideoUrl(): string;
    getVideoEmbedCode(): string;
    getPlaybackQuality(): string;
    setPlaybackQuality(suggestedQuality: string): void;
    getAvailableQualityLevels(): string[];
    getPlayerState(): number;
    getVolume(): number;
    setVolume(volume: number): void;
    isMuted(): boolean;
    mute(): void;
    unMute(): void;
    getPlaybackRate(): number;
    setPlaybackRate(suggestedRate: number): void;
    destroy(): void;
  }

  enum PlayerState {
    UNSTARTED = -1,
    ENDED = 0,
    PLAYING = 1,
    PAUSED = 2,
    BUFFERING = 3,
    CUED = 5,
  }
}

export {};
