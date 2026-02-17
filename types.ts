
export interface BrandIdentity {
  name: string;
  tagline: string;
  colors: string[];
  fonts: string[];
  targetAudience: string;
  mission: string;
  logoPrompt: string;
}

export interface MarketInsight {
  competitor: string;
  strength: string;
  weakness: string;
  opportunity: string;
  sourceUrl?: string;
}

export interface AppState {
  step: 'intro' | 'analyze' | 'design' | 'live';
  brand?: BrandIdentity;
  insights: MarketInsight[];
  loading: boolean;
}
