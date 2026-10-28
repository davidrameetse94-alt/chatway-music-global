export interface Track {
  trackId: number;
  trackName: string;
  artistName: string;
  collectionName?: string;
  artworkUrl100: string;
  artworkUrl60?: string;
  previewUrl: string;
  trackViewUrl?: string;
  trackTimeMillis?: number;
  primaryGenreName?: string;
  releaseDate?: string;
  country?: string;
  artistViewUrl?: string;
}

export type MonetagZoneId = 
  | 12141348 // AppOpen
  | 12141366 // Interstitial
  | 12141355 // Rewarded
  | 12141307 // Vignette
  | 9510382  // Push
  | 302344;  // OnClick / Direct Link

export interface MonetagZonesConfig {
  appOpen: 12141348;
  interstitial: 12141366;
  rewarded: 12141355;
  vignette: 12141307;
  push: 9510382;
  onclick: 302344;
}

export interface VipProgress {
  clicks: number;
  unlocked: boolean;
  totalEarningsSimulated: number;
}
