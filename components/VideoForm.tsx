import React, { useState, useEffect } from 'react';
import { VideoConfig, AspectRatio, InputMode } from '../types';

interface VideoFormProps {
  isLoading: boolean;
  onSubmit: (config: VideoConfig) => void;
  initialConfig: Partial<VideoConfig>;
}

const VideoForm: React.FC<VideoFormProps> = ({ isLoading, onSubmit, initialConfig }) => {
  const [mode, setMode] = useState<InputMode>('prompt');
  const [prompt, setPrompt] = useState('');
  const [topic, setTopic] = useState('');
  const [style, setStyle] = useState('');
  const [aspectRatio, setAspectRatio] = useState<AspectRatio>(AspectRatio.LANDSCAPE);
  const [enhancePrompt, setEnhancePrompt] = useState(true);

  useEffect(() => {
    if (initialConfig.mode) setMode(initialConfig.mode);
    if (initialConfig.prompt) setPrompt(initialConfig.prompt);
    if (initialConfig.topic) setTopic(initialConfig.topic);
    if (initialConfig.style) setStyle(initialConfig.style);
    if (initialConfig.aspectRatio) setAspectRatio(initialConfig.aspectRatio);
  }, [initialConfig]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      mode,
      prompt,
      topic,
      style,
      aspectRatio,
      enhancePrompt,
    });
  };

  return (
    <div className="w-full max-w-2xl bg-zinc-900/50 backdrop-blur-md border border-zinc-800 rounded-2xl p-6 md:p-8 shadow-xl">
      <div className="flex gap-4 mb-6 border-b border-zinc-800 pb-4">
        <button
          onClick={() => setMode('prompt')}
          className={`text-sm font-medium pb-4 -mb-4 transition-colors ${
            mode === 'prompt' ? 'text-white border-b-2 border-indigo-500' : 'text-zinc-500 hover:text-zinc-300'
          }`}
        >
          Free Prompt
        </button>
        <button
          onClick={() => setMode('structured')}
          className={`text-sm font-medium pb-4 -mb-4 transition-colors ${
            mode === 'structured' ? 'text-white border-b-2 border-indigo-500' : 'text-zinc-500 hover:text-zinc-300'
          }`}
        >
          Structured Creator
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {mode === 'prompt' ? (
          <div>
            <label className="block text-xs font-medium text-zinc-400 mb-2 uppercase tracking-wider">
              Video Description
            </label>
            <textarea
              required
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="A futuristic city with neon lights reflecting in rain puddles, cinematic 4k..."
              className="w-full bg-black/50 border border-zinc-700 rounded-xl p-4 text-white placeholder-zinc-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 h-32 resize-none transition-all"
            />
          </div>
        ) : (
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-zinc-400 mb-2 uppercase tracking-wider">
                Topic / Subject
              </label>
              <input
                required
                type="text"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="e.g., A vintage car chase"
                className="w-full bg-black/50 border border-zinc-700 rounded-xl p-3 text-white placeholder-zinc-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-zinc-400 mb-2 uppercase tracking-wider">
                Visual Style
              </label>
              <input
                type="text"
                value={style}
                onChange={(e) => setStyle(e.target.value)}
                placeholder="e.g., Noir, Anime, Photorealistic"
                className="w-full bg-black/50 border border-zinc-700 rounded-xl p-3 text-white placeholder-zinc-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-zinc-400 mb-2 uppercase tracking-wider">
                Additional Details (Optional)
              </label>
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Specific camera angles, lighting conditions..."
                className="w-full bg-black/50 border border-zinc-700 rounded-xl p-3 text-white placeholder-zinc-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 h-24 resize-none transition-all"
              />
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-xs font-medium text-zinc-400 mb-2 uppercase tracking-wider">
              Aspect Ratio
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setAspectRatio(AspectRatio.LANDSCAPE)}
                className={`flex flex-col items-center justify-center p-3 rounded-xl border transition-all ${
                  aspectRatio === AspectRatio.LANDSCAPE
                    ? 'bg-zinc-800 border-indigo-500 text-white'
                    : 'bg-black/30 border-zinc-800 text-zinc-500 hover:bg-zinc-800/50'
                }`}
              >
                <div className="w-8 h-5 border-2 border-current rounded-sm mb-2" />
                <span className="text-xs">16:9 Landscape</span>
              </button>
              <button
                type="button"
                onClick={() => setAspectRatio(AspectRatio.PORTRAIT)}
                className={`flex flex-col items-center justify-center p-3 rounded-xl border transition-all ${
                  aspectRatio === AspectRatio.PORTRAIT
                    ? 'bg-zinc-800 border-indigo-500 text-white'
                    : 'bg-black/30 border-zinc-800 text-zinc-500 hover:bg-zinc-800/50'
                }`}
              >
                <div className="w-5 h-8 border-2 border-current rounded-sm mb-2" />
                <span className="text-xs">9:16 Portrait</span>
              </button>
            </div>
          </div>
          
          <div className="flex flex-col justify-end">
             <label className="flex items-center gap-3 p-3 rounded-xl bg-black/30 border border-zinc-800 cursor-pointer hover:bg-zinc-800/30 transition-colors">
                <input 
                  type="checkbox" 
                  checked={enhancePrompt} 
                  onChange={(e) => setEnhancePrompt(e.target.checked)}
                  className="w-5 h-5 rounded border-zinc-600 text-indigo-500 focus:ring-indigo-500 bg-zinc-900"
                />
                <div>
                    <span className="block text-sm font-medium text-zinc-200">Enhance Prompt with Gemini</span>
                    <span className="block text-xs text-zinc-500">Uses Gemini 2.5 Flash to add detail</span>
                </div>
             </label>
          </div>
        </div>

        <button
          type="submit"
          disabled={isLoading || (mode === 'prompt' && !prompt) || (mode === 'structured' && !topic)}
          className={`w-full py-4 rounded-xl font-bold text-lg tracking-wide transition-all shadow-lg ${
            isLoading
              ? 'bg-zinc-800 text-zinc-500 cursor-wait'
              : 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white shadow-indigo-500/25 hover:shadow-indigo-500/40 transform hover:-translate-y-0.5'
          }`}
        >
          {isLoading ? (
            <span className="flex items-center justify-center gap-2">
              <svg className="animate-spin h-5 w-5 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Generating...
            </span>
          ) : (
            'Generate Video'
          )}
        </button>
      </form>
    </div>
  );
};

export default VideoForm;
