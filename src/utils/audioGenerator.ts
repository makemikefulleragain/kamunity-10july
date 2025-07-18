// ElevenLabs TTS integration for Kamunity Newsfeed
import { ToneFilter } from '@/types';

// Voice personality mapping based on perspective "feels"
// Note: Currently using static audio files, but kept for documentation and potential future API use
const VOICE_PERSONALITIES = {
  FUN: {
    voiceId: 'EXAVITQu4vr4xnSDxMaL', // Sarah - energetic, upbeat (confirmed available)
    stability: 0.3,
    similarityBoost: 0.8,
    style: 0.7 // More expressive
  },
  FACTUAL: {
    voiceId: 'JBFqnCBsd6RMkjVDRZzb', // George - professional, authoritative
    stability: 0.8,
    similarityBoost: 0.5,
    style: 0.2 // More controlled
  },
  SPICY: {
    voiceId: 'SAz9YHcvj6GT2YYXdXww', // River - dramatic, expressive
    stability: 0.2,
    similarityBoost: 0.9,
    style: 0.9 // Very expressive
  },
  NICE: {
    voiceId: 'FGY2WhTYpPnrIDTdsKH5', // Laura - warm, friendly
    stability: 0.6,
    similarityBoost: 0.7,
    style: 0.6 // Warm and gentle
  },
  UNUSUAL: {
    voiceId: 'Xb7hH8MSUJpSbSDYk0k2', // Alice - distinctive, unique
    stability: 0.4,
    similarityBoost: 0.6,
    style: 0.8 // Quirky and distinctive
  },
  CURIOUS: {
    voiceId: 'IKne3meq5aSn9XLyUdCD', // Charlie - thoughtful, inquisitive
    stability: 0.5,
    similarityBoost: 0.6,
    style: 0.5 // Thoughtful and questioning
  }
};

// Script templates that match each perspective's personality
const SCRIPT_TEMPLATES = {
  FUN: (highlights: string[], summary: string, timeFilter: string) => 
    `Hey Kamunity! Welcome to your daily dose of awesome from ${timeFilter.toLowerCase()}! Today's fun highlights are: ${highlights.join(', ')}. In more depth: ${summary}. That's your fun fix! Try another perspective or go live your best life!`,
  
  FACTUAL: (highlights: string[], summary: string, timeFilter: string) => 
    `Good day. Here's your verified information briefing from ${timeFilter.toLowerCase()}. Today's key highlights: ${highlights.join(', ')}. Detailed analysis: ${summary}. That concludes today's factual summary.`,
  
  SPICY: (highlights: string[], summary: string, timeFilter: string) => 
    `Oh, you want the REAL tea? Buckle up for ${timeFilter.toLowerCase()}'s controversial takes. The headlines everyone's debating: ${highlights.join(', ')}. Here's the unfiltered scoop: ${summary}. That's the spice! Switch perspectives or put that phone down!`,
  
  NICE: (highlights: string[], summary: string, timeFilter: string) => 
    `Hello beautiful humans! Let's share some goodness from ${timeFilter.toLowerCase()}. Today's heartwarming highlights: ${highlights.join(', ')}. Spreading more love: ${summary}. Keep spreading those good vibes! Try another perspective or go hug someone!`,
  
  UNUSUAL: (highlights: string[], summary: string, timeFilter: string) => 
    `Ready for something completely different? Welcome to ${timeFilter.toLowerCase()}'s weirdest and most wonderful. Today's unusual discoveries: ${highlights.join(', ')}. Diving into the strange: ${summary}. Stay curious, stay weird!`,
  
  CURIOUS: (highlights: string[], summary: string, timeFilter: string) => 
    `Fascinating questions emerged from ${timeFilter.toLowerCase()}. Today's thought-provoking highlights: ${highlights.join(', ')}. Exploring deeper: ${summary}. Keep questioning, keep learning!`
};

export const generateTTSAudio = async (
  text: string, 
  perspective: ToneFilter,
  timeFilter: string
): Promise<string> => {
  try {
    // Use pre-generated static audio files instead of API calls
    const filename = `${perspective}_${timeFilter.replace(' ', '_').toUpperCase()}.mp3`;
    const audioUrl = `/audio/${filename}`;
    
    // Check if the static audio file exists
    const response = await fetch(audioUrl, { method: 'HEAD' });
    
    if (response.ok) {
      console.log(`✅ Using static audio file: ${filename}`);
      return audioUrl;
    } else {
      // Fallback: provide helpful error message
      console.warn(`⚠️ Static audio file not found: ${filename}`);
      throw new Error(`Audio file not available: ${filename}. Please generate this file using ElevenLabs web interface and place it in public/audio/`);
    }
    
  } catch (error) {
    console.error('TTS generation failed:', error);
    throw error;
  }
};

export const createNarrationScript = (
  highlights: string[],
  summary: string,
  perspective: ToneFilter,
  timeFilter: string
): string => {
  const template = SCRIPT_TEMPLATES[perspective];
  return template(highlights, summary, timeFilter);
};

// Cache management for generated audio
const audioCache = new Map<string, string>();

export const getCachedAudio = (cacheKey: string): string | null => {
  return audioCache.get(cacheKey) || null;
};

export const setCachedAudio = (cacheKey: string, audioUrl: string): void => {
  audioCache.set(cacheKey, audioUrl);
};

// Safe base64 encoding that works in all environments
const safeBase64Encode = (str: string): string => {
  try {
    return btoa(str);
  } catch {
    // Fallback for environments without btoa
    return Buffer.from(str).toString('base64');
  }
};

export const generateCacheKey = (
  perspective: ToneFilter,
  timeFilter: string,
  contentHash: string
): string => {
  return `${perspective}_${timeFilter}_${contentHash}`;
};

export const generateContentHash = (highlights: string[], summary: string): string => {
  const content = `${highlights.join('')}${summary}`;
  return safeBase64Encode(content).slice(0, 16);
}; 