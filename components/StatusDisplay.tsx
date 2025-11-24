import React from 'react';
import { GenerationStep } from '../types';

interface StatusDisplayProps {
  step: GenerationStep;
}

const StatusDisplay: React.FC<StatusDisplayProps> = ({ step }) => {
  if (step === GenerationStep.IDLE || step === GenerationStep.ERROR || step === GenerationStep.COMPLETE) {
    return null;
  }

  return (
    <div className="w-full max-w-lg mt-8 mb-4">
      <div className="relative">
        <div className="absolute top-1/2 left-0 w-full h-1 bg-zinc-800 rounded-full -z-10" />
        <div 
            className="absolute top-1/2 left-0 h-1 bg-indigo-500 rounded-full -z-10 transition-all duration-1000 ease-in-out" 
            style={{ width: step === GenerationStep.OPTIMIZING ? '50%' : '100%'}}
        />
        
        <div className="flex justify-between w-full">
          {/* Step 1: Optimization */}
          <div className="flex flex-col items-center gap-2">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center border-4 transition-all ${
                step === GenerationStep.OPTIMIZING || step === GenerationStep.GENERATING
                ? 'bg-black border-indigo-500 text-indigo-500 scale-110 shadow-[0_0_15px_rgba(99,102,241,0.5)]'
                : 'bg-zinc-800 border-zinc-700 text-zinc-500'
            }`}>
               {step === GenerationStep.OPTIMIZING ? (
                 <svg className="w-5 h-5 animate-pulse" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                 </svg>
               ) : (
                 <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                 </svg>
               )}
            </div>
            <span className={`text-xs font-medium ${step === GenerationStep.OPTIMIZING ? 'text-indigo-400 animate-pulse' : 'text-zinc-500'}`}>
              Enhancing Prompt
            </span>
          </div>

          {/* Step 2: Generation */}
          <div className="flex flex-col items-center gap-2">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center border-4 transition-all ${
                step === GenerationStep.GENERATING
                ? 'bg-black border-indigo-500 text-indigo-500 scale-110 shadow-[0_0_15px_rgba(99,102,241,0.5)]'
                : step === GenerationStep.OPTIMIZING ? 'bg-zinc-800 border-zinc-700 text-zinc-500' : 'bg-black border-indigo-500 text-indigo-500'
            }`}>
               <svg className={`w-5 h-5 ${step === GenerationStep.GENERATING ? 'animate-spin' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
               </svg>
            </div>
            <span className={`text-xs font-medium ${step === GenerationStep.GENERATING ? 'text-indigo-400 animate-pulse' : 'text-zinc-500'}`}>
              Rendering Video
            </span>
          </div>
        </div>
      </div>
      
      {step === GenerationStep.GENERATING && (
          <p className="text-center text-zinc-500 text-xs mt-6">
              Veo 3.1 is creating pixels. This usually takes about 30-60 seconds...
          </p>
      )}
    </div>
  );
};

export default StatusDisplay;
