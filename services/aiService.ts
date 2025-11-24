import { GoogleGenAI } from "@google/genai";
import { VideoConfig, GenerationResult, AspectRatio } from "../types";

// Helper to get fresh AI instance (crucial for picking up selected API keys)
const getAIClient = () => {
  return new GoogleGenAI({ apiKey: process.env.API_KEY });
};

export const processPipeline = async (config: VideoConfig): Promise<GenerationResult> => {
  const ai = getAIClient();
  
  // --- Step 1: Prompt Optimization ---
  let finalPrompt = config.prompt;

  if (config.mode === 'structured') {
    finalPrompt = `Topic: ${config.topic || 'Untitled'}. Style: ${config.style || 'Cinematic'}. ${config.prompt}`;
  }

  let enhancedPrompt = finalPrompt;

  if (config.enhancePrompt) {
    try {
        const optimizationResponse = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: `You are an expert video prompt engineer for Google Veo.
            Rewrite the following user request into a highly detailed, visual, and cinematic video generation prompt.
            Focus on lighting, camera movement, texture, and mood.
            Keep it under 300 words.
            Output ONLY the raw prompt text, no markdown, no quotes.
            
            User Request: "${finalPrompt}"`,
        });
        
        if (optimizationResponse.text) {
            enhancedPrompt = optimizationResponse.text.trim();
        }
    } catch (e) {
        console.warn("Prompt optimization failed, using original prompt.", e);
    }
  }

  // --- Step 2: Video Generation ---
  // Veo 3.1 Fast Generate Preview
  // Note: Aspect ratio must be 16:9 or 9:16 for Veo.
  
  let operation = await ai.models.generateVideos({
    model: 'veo-3.1-fast-generate-preview',
    prompt: enhancedPrompt,
    config: {
      numberOfVideos: 1,
      resolution: '1080p', // 1080p supported
      aspectRatio: config.aspectRatio === AspectRatio.PORTRAIT ? '9:16' : '16:9',
    }
  });

  // Polling for completion
  // Note: Polling interval can be longer for videos, but fast preview is relatively quick.
  while (!operation.done) {
    await new Promise(resolve => setTimeout(resolve, 5000)); // Poll every 5s
    operation = await ai.operations.getVideosOperation({ operation: operation });
  }

  if (operation.error) {
    throw new Error(`Video generation failed: ${operation.error.message}`);
  }

  const generatedVideo = operation.response?.generatedVideos?.[0];
  if (!generatedVideo || !generatedVideo.video?.uri) {
    throw new Error("No video URI returned from the API.");
  }

  // Fetch the actual video bytes to create a blob URL
  // This avoids CORS issues or expiring links on the client side if the URI requires auth headers directly
  const downloadLink = generatedVideo.video.uri;
  const videoResponse = await fetch(`${downloadLink}&key=${process.env.API_KEY}`);
  
  if (!videoResponse.ok) {
     throw new Error("Failed to download generated video content.");
  }

  const videoBlob = await videoResponse.blob();
  const videoUrl = URL.createObjectURL(videoBlob);

  return {
    originalPrompt: finalPrompt,
    enhancedPrompt: enhancedPrompt,
    videoUrl: videoUrl
  };
};
