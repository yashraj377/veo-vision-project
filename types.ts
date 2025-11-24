export enum GenerationStep {
  IDLE = 'IDLE',
  OPTIMIZING = 'OPTIMIZING',
  GENERATING = 'GENERATING',
  COMPLETE = 'COMPLETE',
  ERROR = 'ERROR'
}

export enum AspectRatio {
  LANDSCAPE = '16:9',
  PORTRAIT = '9:16'
}

export type InputMode = 'prompt' | 'structured';

export interface VideoConfig {
  mode: InputMode;
  prompt: string;
  topic?: string;
  style?: string;
  aspectRatio: AspectRatio;
  duration?: number;
  enhancePrompt: boolean;
}

export interface GenerationResult {
  originalPrompt: string;
  enhancedPrompt: string;
  videoUrl: string;
}
