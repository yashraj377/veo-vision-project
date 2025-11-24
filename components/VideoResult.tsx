import React from 'react';
import { GenerationResult } from '../types';

interface VideoResultProps {
  result: GenerationResult | null;
  onReset: () => void;
}

const VideoResult: React.FC<VideoResultProps> = ({ result, onReset }) => {
  if (!result) return null;

  return (
    <div className="w-full max-w-4xl animate-in fade-in slide-in-from-bottom-8 duration-700">
      
      <div className="relative group rounded-2xl overflow-hidden border border-zinc-800 bg-zinc-900 shadow-2xl">
        {/* Video Player */}
        <div className="aspect-video w-full bg-black relative">
            <video 
                src={result.videoUrl} 
                controls 
                autoPlay 
                loop 
                className="w-full h-full object-contain"
            />
        </div>

        {/* Metadata Overlay / Section */}
        <div className="p-6 md:p-8 space-y-6">
            <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold text-white">Generation Complete</h3>
                <div className="flex gap-3">
                    <a 
                        href={result.videoUrl} 
                        download="veo-generation.mp4"
                        className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-white text-sm font-medium rounded-lg transition-colors border border-zinc-700 flex items-center gap-2"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                        Download
                    </a>
                    <button 
                        onClick={onReset}
                        className="px-4 py-2 bg-white text-black text-sm font-medium rounded-lg hover:bg-zinc-200 transition-colors"
                    >
                        Create New
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-black/30 p-4 rounded-xl border border-zinc-800/50">
                    <p className="text-xs text-zinc-500 uppercase tracking-wider mb-2 font-semibold">Your Prompt</p>
                    <p className="text-zinc-300 text-sm leading-relaxed italic">
                        "{result.originalPrompt}"
                    </p>
                </div>
                
                <div className="bg-indigo-950/10 p-4 rounded-xl border border-indigo-500/20 relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-2 opacity-10">
                        <svg className="w-16 h-16 text-indigo-500" fill="currentColor" viewBox="0 0 24 24"><path d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>
                    </div>
                    <p className="text-xs text-indigo-400 uppercase tracking-wider mb-2 font-semibold flex items-center gap-2">
                        <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>
                        Optimized by Gemini
                    </p>
                    <p className="text-indigo-200/90 text-sm leading-relaxed">
                        {result.enhancedPrompt}
                    </p>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};

export default VideoResult;
