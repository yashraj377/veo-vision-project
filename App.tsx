import React, { useState, useEffect } from 'react';
import { GenerationStep, VideoConfig, GenerationResult, AspectRatio, InputMode } from './types';
import { processPipeline } from './services/aiService';
import VideoForm from './components/VideoForm';
import VideoResult from './components/VideoResult';
import StatusDisplay from './components/StatusDisplay';

const App: React.FC = () => {
  const [step, setStep] = useState<GenerationStep>(GenerationStep.IDLE);
  const [result, setResult] = useState<GenerationResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isKeyReady, setIsKeyReady] = useState<boolean>(false);
  const [initialConfig, setInitialConfig] = useState<Partial<VideoConfig>>({});
  const [autoRunTriggered, setAutoRunTriggered] = useState(false);

  // On Mount: Check API Key & Parse URL
  useEffect(() => {
    checkApiKey();
    parseUrlParams();
  }, []);

  // Auto-Run Logic: Triggers if key is ready, config is present, and we haven't run yet
  useEffect(() => {
    if (isKeyReady && !autoRunTriggered && step === GenerationStep.IDLE) {
        // Check if we have enough config to run
        const hasPrompt = !!initialConfig.prompt;
        const hasTopic = !!initialConfig.topic;

        if (hasPrompt || hasTopic) {
            console.log("Auto-running pipeline from URL parameters...");
            setAutoRunTriggered(true);
            
            // Construct full config from partial + defaults
            const runConfig: VideoConfig = {
                mode: (initialConfig.mode as InputMode) || (hasTopic ? 'structured' : 'prompt'),
                prompt: initialConfig.prompt || '',
                topic: initialConfig.topic || '',
                style: initialConfig.style || 'cinematic, modern',
                aspectRatio: initialConfig.aspectRatio || AspectRatio.LANDSCAPE,
                duration: 6,
                enhancePrompt: true
            };
            
            handleGenerate(runConfig);
        }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isKeyReady, initialConfig, autoRunTriggered, step]);

  const parseUrlParams = () => {
    const params = new URLSearchParams(window.location.search);
    const config: Partial<VideoConfig> = {};
    
    const prompt = params.get('prompt');
    const topic = params.get('topic');
    const style = params.get('style');
    const aspect = params.get('aspectRatio') as AspectRatio;

    if (prompt) config.prompt = prompt;
    if (topic) {
        config.topic = topic;
        config.mode = 'structured';
    }
    if (style) config.style = style;
    if (aspect && (aspect === AspectRatio.LANDSCAPE || aspect === AspectRatio.PORTRAIT)) {
      config.aspectRatio = aspect;
    }

    setInitialConfig(config);
  };

  const checkApiKey = async () => {
    try {
      if ((window as any).aistudio && await (window as any).aistudio.hasSelectedApiKey()) {
        setIsKeyReady(true);
      }
    } catch (e) {
      console.error("Error checking API key status", e);
    }
  };

  const handleConnect = async () => {
    try {
      if ((window as any).aistudio) {
        await (window as any).aistudio.openSelectKey();
        setIsKeyReady(true);
        setError(null);
        // Reset auto run so if they connect after loading url, it can try again if it failed
        setAutoRunTriggered(false);
      } else {
        setError("AI Studio environment not detected.");
      }
    } catch (e) {
      console.error("Failed to select key", e);
      setError("Failed to select API key.");
    }
  };

  const handleGenerate = async (config: VideoConfig) => {
    setError(null);
    setResult(null);

    if (!isKeyReady) {
      // If auto-run tries to run without key, wait for user
      if (autoRunTriggered) {
         // Don't error, just show the connect prompt
         return; 
      }
      await handleConnect();
    }

    try {
      // Start Pipeline
      setStep(GenerationStep.OPTIMIZING); // Visual indication we are working
      
      const pipelineResult = await processPipeline(config);

      setResult(pipelineResult);
      setStep(GenerationStep.COMPLETE);

    } catch (err: any) {
      console.error(err);
      
      const msg = err.message || "An unexpected error occurred.";
      setError(msg);
      setStep(GenerationStep.ERROR);
      
      // Specifically handle the "Requested entity was not found" error
      // This implies the Key/Project is invalid for Veo.
      if (msg.includes("Requested entity was not found")) {
        setIsKeyReady(false);
        // We cannot await here easily inside the catch without blocking UI update
        // But we reset state so UI shows "Connect" button or error banner with reconnect
      }
    }
  };

  const reset = () => {
    setStep(GenerationStep.IDLE);
    setResult(null);
    setError(null);
    setAutoRunTriggered(false); // Allow re-run
    // clear URL params to prevent loop on refresh
    window.history.pushState({}, document.title, window.location.pathname);
  };

  return (
    <div className="min-h-screen bg-black bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-zinc-900 via-black to-black text-zinc-100 flex flex-col items-center p-4 md:p-8">
      
      {/* Header */}
      <header className="w-full max-w-4xl flex items-center justify-between mb-12">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center shadow-lg shadow-indigo-500/20">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-white to-zinc-400">
              Veo Vision
            </h1>
            <p className="text-xs text-zinc-500">Google Veo 3.1 Pipeline</p>
          </div>
        </div>

        {!isKeyReady && (
           <button 
             onClick={handleConnect}
             className="text-xs font-medium bg-zinc-800 hover:bg-zinc-700 text-zinc-300 px-4 py-2 rounded-full transition-colors border border-zinc-700"
           >
             Connect API Key
           </button>
        )}
        {isKeyReady && (
            <div className="flex items-center gap-2 text-xs text-emerald-500 bg-emerald-950/30 px-3 py-1.5 rounded-full border border-emerald-900/50">
                <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                API Connected
            </div>
        )}
      </header>

      {/* Main Content */}
      <main className="w-full flex flex-col items-center gap-8">
        
        {/* Error Banner */}
        {error && (
          <div className="w-full max-w-2xl bg-red-950/50 border border-red-900 text-red-200 p-4 rounded-lg flex items-start gap-3 animate-in fade-in slide-in-from-top-4">
            <svg className="w-5 h-5 mt-0.5 text-red-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div className="flex-1">
              <p className="font-medium">Generation Error</p>
              <p className="text-sm opacity-80">{error}</p>
              {error.includes("entity was not found") && (
                 <div className="mt-3">
                    <p className="text-xs text-red-300 mb-2">
                        This usually means the selected Google Cloud Project does not have access to the Veo model or is not a paid project.
                    </p>
                    <button 
                    onClick={handleConnect}
                    className="text-xs bg-red-900/50 hover:bg-red-800 px-3 py-1.5 rounded border border-red-800 transition-colors font-medium"
                    >
                    Select Different API Key
                    </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* API Key Blocker */}
        {!isKeyReady && !error && (
            <div className="w-full max-w-2xl bg-zinc-900/50 border border-indigo-500/30 p-8 rounded-2xl text-center space-y-6 backdrop-blur-sm">
                <div className="w-16 h-16 bg-zinc-800 rounded-full flex items-center justify-center mx-auto">
                    <svg className="w-8 h-8 text-zinc-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 19l-1 1-1 1-2-2-2 2-2-2-2 2-1 1 10-10a6 6 0 016-6z" />
                    </svg>
                </div>
                <div>
                    <h2 className="text-xl font-bold text-white mb-2">Authentication Required</h2>
                    <p className="text-zinc-400 max-w-md mx-auto">
                        To generate videos with Veo, you must select a valid Google Cloud Project with billing enabled.
                    </p>
                </div>
                <div className="flex flex-col gap-3 items-center">
                    <button 
                        onClick={handleConnect}
                        className="bg-white text-black font-semibold px-8 py-3 rounded-full hover:bg-zinc-200 transition-colors"
                    >
                        Select API Key
                    </button>
                    <a 
                        href="https://ai.google.dev/gemini-api/docs/billing" 
                        target="_blank" 
                        rel="noreferrer"
                        className="text-xs text-indigo-400 hover:text-indigo-300 underline"
                    >
                        View Billing Documentation
                    </a>
                </div>
            </div>
        )}

        {/* Core Logic Visuals */}
        <StatusDisplay step={step} />

        {/* Form or Result Switch */}
        {step === GenerationStep.COMPLETE ? (
          <VideoResult result={result} onReset={reset} />
        ) : (
          isKeyReady && (
            <VideoForm 
              isLoading={step === GenerationStep.OPTIMIZING || step === GenerationStep.GENERATING} 
              onSubmit={handleGenerate}
              initialConfig={initialConfig}
            />
          )
        )}

      </main>

      <footer className="mt-auto py-8 text-zinc-600 text-xs text-center">
        <p>Powered by Google Gemini 2.5 Flash & Veo 3.1</p>
      </footer>
    </div>
  );
};

export default App;
