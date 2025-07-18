import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Layout from '@/components/Layout';
import { ToneFilter, TimeFilter } from '@/types';
import { 
  generateTTSAudio, 
  createNarrationScript,
  getCachedAudio,
  setCachedAudio,
  generateCacheKey 
} from '@/utils/audioGenerator';

const PERSPECTIVES: ToneFilter[] = ['FUN', 'FACTUAL', 'UNUSUAL', 'CURIOUS', 'SPICY', 'NICE'];
const TIME_FILTERS: TimeFilter[] = ['TODAY', 'LAST WEEK', 'LAST MONTH', 'LAST YEAR'];

interface GenerationStatus {
  [key: string]: 'idle' | 'generating' | 'success' | 'error';
}

export default function AudioManager() {
  const [password, setPassword] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [generationStatus, setGenerationStatus] = useState<GenerationStatus>({});
  const [isGeneratingAll, setIsGeneratingAll] = useState(false);

  const handleAuth = () => {
    // Simple password check - you can change this
    if (password === 'kamunity2024') {
      setIsAuthenticated(true);
    } else {
      alert('Incorrect password');
    }
  };

  const getHighlights = (perspective: ToneFilter) => {
    const highlights = {
      'FUN': [
        "Gaming tournament attracted 120+ participants across platforms",
        "Meme contest generated over 500 community shares",
        "Comedy night featured 15 members performing tech humor"
      ],
      'FACTUAL': [
        "Community Garden project advanced two weeks ahead",
        "Tech Meetup confirmed with three keynote speakers", 
        "New member orientation welcomed 12 professionals"
      ],
      'UNUSUAL': [
        "Coding in darkness experiment yielded 40% productivity gains",
        "Interpretive dance programming tutorial went viral",
        "Former circus performer transitioned to UX design"
      ],
      'CURIOUS': [
        "Quantum computing discussion attracted 150+ participants",
        "AI ethics debate generated three policy proposals",
        "Environmental technology brainstorming produced solutions"
      ],
      'SPICY': [
        "Net neutrality debate sparked productive compromises",
        "Data privacy discussion challenged corporate practices",
        "Tech regulation conversation influenced local policy"
      ],
      'NICE': [
        "Member achievements celebrated with 200+ responses",
        "Mentorship program matched 100+ partnerships",
        "Community service initiatives impacted 1,000+ lives"
      ]
    };
    
    return highlights[perspective] || highlights['FACTUAL'];
  };

  const getSummaryText = (perspective: ToneFilter, timeFilter: TimeFilter) => {
    const timeText = timeFilter === 'TODAY' ? "today" : timeFilter.toLowerCase().replace('last ', '');
    const tab = perspective.toLowerCase();
    
    const summaries: Record<string, Record<string, string>> = {
      'fun': {
        'today': "Today's fun content has been absolutely delightful! Our community shared hilarious memes about weekend coding fails, viral TikTok dance challenges that somehow incorporate programming concepts, and adorable pet photos from members' home offices.",
        'week': "This week brought incredible entertainment value to our community feeds! Monday's Meme Madness continued with programming humor that had everyone in stitches.",
        'month': "This month's fun content reached new heights of creativity and engagement! Our Halloween programming costume contest produced some truly memorable entries.",
        'year': "This year has been a remarkable journey of laughter, creativity, and community bonding! Our annual highlights reel captures the evolution of inside jokes."
      },
      'factual': {
        'today': "Today's factual content provides crucial community updates and industry insights. The Community Garden initiative received final approval with budget allocation confirmed.",
        'week': "This week's factual updates showcase significant community progress and external partnerships. The Community Garden project moved into phase two with soil preparation.",
        'month': "This month's factual content demonstrates substantial growth and achievement across all community initiatives. The Community Garden project completion timeline advanced.",
        'year': "This year's factual analysis reveals transformative community evolution and measurable impact. Membership doubled from 500 to 1,000 active participants."
      },
      'spicy': {
        'today': "Today's spicy content generated heated but respectful debates on controversial technology topics. Net neutrality discussions brought passionate arguments from multiple perspectives.",
        'week': "This week's spicy topics maintained high engagement while preserving community respect and productive discourse. Technology regulation debates attracted industry professionals.",
        'month': "This month's spicy content tackled complex issues requiring nuanced discussion and multiple perspective consideration. Technology ethics debates expanded into industry-wide policy.",
        'year': "This year's spicy content demonstrates our community's ability to tackle controversial topics while maintaining respect and producing constructive outcomes."
      },
      'nice': {
        'today': "Today's nice content showcased the warmth and supportiveness that defines our community spirit. Celebration posts for member achievements generated hundreds of responses.",
        'week': "This week's nice highlights demonstrate our community's commitment to mutual support and celebration. Member appreciation posts recognized contributions from volunteers.",
        'month': "This month's nice content reveals the deep connections and genuine care that characterize our community relationships. Major celebration events included member anniversaries.",
        'year': "This year's nice content timeline illustrates the evolution of genuine community care and mutual support. Major nice achievements include mentorship programs."
      },
      'unusual': {
        'today': "Today's unusual content sparked fascinating discussions about unconventional approaches to common problems. A member's experiment with coding in complete darkness yielded surprising insights.",
        'week': "This week's unusual discoveries challenged conventional thinking across multiple domains. Experimental work schedules including 'twilight coding sessions' showed productivity increases.",
        'month': "This month's unusual content exploration revealed hidden talents and unexpected solutions throughout our community. Alternative learning methods gained traction.",
        'year': "This year's unusual content timeline showcases our community's willingness to embrace unconventional wisdom and creative thinking."
      },
      'curious': {
        'today': "Today's curious content sparked deep exploration into emerging technologies and philosophical questions. Discussions about quantum computing applications attracted engaged participants.",
        'week': "This week's curious explorations delved into cutting-edge research and thought-provoking questions that challenge our understanding. Deep learning algorithm discussions evolved.",
        'month': "This month's curious content fostered intellectual growth through diverse topic exploration and collaborative research initiatives. Emerging technology trend analysis sessions brought experts together.",
        'year': "This year's curious content journey reflects our community's commitment to lifelong learning and intellectual exploration. Major curious achievements include guest expert sessions."
      }
    };
    
    return summaries[tab]?.[timeText] || `Sample summary text for ${perspective} perspective from ${timeFilter}`;
  };

  const generateSingleAudio = async (perspective: ToneFilter, timeFilter: TimeFilter) => {
    const key = `${perspective}_${timeFilter}`;
    setGenerationStatus(prev => ({ ...prev, [key]: 'generating' }));

    try {
      const highlights = getHighlights(perspective);
      const summary = getSummaryText(perspective, timeFilter);
      const script = createNarrationScript(highlights, summary, perspective, timeFilter);
      
      await generateTTSAudio(script, perspective, timeFilter);
      
      setGenerationStatus(prev => ({ ...prev, [key]: 'success' }));
    } catch (error) {
      console.error(`Failed to generate audio for ${key}:`, error);
      setGenerationStatus(prev => ({ ...prev, [key]: 'error' }));
    }
  };

  const generateAllAudio = async () => {
    setIsGeneratingAll(true);
    
    for (const perspective of PERSPECTIVES) {
      for (const timeFilter of TIME_FILTERS) {
        await generateSingleAudio(perspective, timeFilter);
        // Small delay to avoid rate limiting
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    }
    
    setIsGeneratingAll(false);
  };

  const clearCache = () => {
    // Clear the cache (this is a simple implementation)
    localStorage.removeItem('tts-cache');
    setGenerationStatus({});
    alert('Audio cache cleared!');
  };

  const getStatusIcon = (status: string | undefined) => {
    switch (status) {
      case 'generating':
        return <span className="text-blue-500">🔄</span>;
      case 'success':
        return <span className="text-green-500">✅</span>;
      case 'error':
        return <span className="text-red-500">❌</span>;
      default:
        return <span className="text-gray-400">⚪</span>;
    }
  };

  if (!isAuthenticated) {
    return (
      <Layout title="Audio Manager - Admin">
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="bg-white rounded-lg shadow-md p-8 max-w-md w-full">
            <h1 className="text-2xl font-bold text-center mb-6">Audio Manager Access</h1>
            <div className="space-y-4">
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter admin password"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                onKeyPress={(e) => e.key === 'Enter' && handleAuth()}
              />
              <button
                onClick={handleAuth}
                className="w-full bg-indigo-600 text-white py-2 px-4 rounded-lg hover:bg-indigo-700 transition-colors"
              >
                Access Admin Panel
              </button>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout title="Audio Manager - Admin">
      <div className="min-h-screen bg-gray-50 py-8 px-4">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-lg shadow-md p-6 mb-8"
          >
            <h1 className="text-3xl font-bold text-gray-800 mb-2">
              🎙️ Audio Manager
            </h1>
            <p className="text-gray-600 mb-6">
              Manage TTS audio generation for all perspective and timeline combinations
            </p>

            {/* Control Buttons */}
            <div className="flex gap-4 mb-8">
              <button
                onClick={generateAllAudio}
                disabled={isGeneratingAll}
                className={`px-6 py-3 rounded-lg font-medium transition-colors ${
                  isGeneratingAll
                    ? 'bg-gray-400 text-white cursor-not-allowed'
                    : 'bg-green-600 text-white hover:bg-green-700'
                }`}
              >
                {isGeneratingAll ? '🔄 Generating All...' : '🚀 Generate All Audio'}
              </button>
              
              <button
                onClick={clearCache}
                className="px-6 py-3 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-colors"
              >
                🗑️ Clear Cache
              </button>
            </div>

            {/* Status Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {PERSPECTIVES.map(perspective => (
                <div key={perspective} className="border border-gray-200 rounded-lg p-4">
                  <h3 className="font-bold text-lg mb-3 text-center">
                    {perspective}
                  </h3>
                  <div className="space-y-2">
                    {TIME_FILTERS.map(timeFilter => {
                      const key = `${perspective}_${timeFilter}`;
                      const status = generationStatus[key];
                      
                      return (
                        <div
                          key={timeFilter}
                          className="flex items-center justify-between p-2 bg-gray-50 rounded"
                        >
                          <span className="text-sm font-medium">
                            {timeFilter}
                          </span>
                          <div className="flex items-center gap-2">
                            {getStatusIcon(status)}
                            <button
                              onClick={() => generateSingleAudio(perspective, timeFilter)}
                              disabled={status === 'generating'}
                              className="text-xs px-2 py-1 bg-indigo-100 text-indigo-700 rounded hover:bg-indigo-200 disabled:opacity-50"
                            >
                              Generate
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>

            {/* Instructions */}
            <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <h3 className="font-bold text-blue-800 mb-2">📋 Instructions</h3>
              <ul className="text-sm text-blue-700 space-y-1">
                <li>• <strong>Generate All Audio:</strong> Creates TTS for all 24 combinations (6 perspectives × 4 timelines)</li>
                <li>• <strong>Individual Generate:</strong> Creates TTS for specific perspective/timeline combination</li>
                <li>• <strong>Clear Cache:</strong> Removes all cached audio files (forces regeneration)</li>
                <li>• <strong>Status Icons:</strong> ⚪ Not generated, 🔄 Generating, ✅ Success, ❌ Error</li>
              </ul>
            </div>

            {/* Environment Check */}
            <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
              <p className="text-sm text-yellow-800">
                <strong>⚙️ Environment:</strong> {
                  process.env.NEXT_PUBLIC_ELEVENLABS_API_KEY 
                    ? '✅ ElevenLabs API Key Configured' 
                    : '❌ ElevenLabs API Key Missing'
                }
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </Layout>
  );
} 