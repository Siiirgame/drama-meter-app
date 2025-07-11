import React, { useState } from 'react';
import { AlertCircle } from 'lucide-react';

const TRANSLATIONS = {
  "en-US": {
    "title": "How dramatic are you?",
    "subtitle": "Share your reaction and let Claude measure your drama level",
    "inputLabel": "What happened and how did you react?",
    "inputPlaceholder": "The WiFi went down for 5 minutes and I dramatically declared it was the end of the world...",
    "exampleCoffee": "No coffee drama",
    "exampleTraffic": "Traffic meltdown",
    "examplePhone": "Phone battery panic",
    "exampleWeather": "Weather woes",
    "grievanceCoffee": "The coffee shop was out of my usual order so I sighed deeply and said my whole day was ruined",
    "grievanceTraffic": "I was stuck in traffic for 10 extra minutes and started honking while yelling 'Why does this always happen to ME?!'",
    "grievancePhone": "My phone battery died at 15% and I gasped like I was witnessing a tragedy",
    "grievanceWeather": "It started raining unexpectedly and I threw my hands up declaring 'The universe is against me today!'",
    "errorMessage": "Please share your reaction to analyze your drama level!",
    "analyzeButton": "Measure my drama!",
    "analyzingButton": "Analyzing drama...",
    "analysisTitle": "Drama Analysis",
    "adviceTitle": "Reality Check",
    "tryAnotherButton": "Try another reaction",
    "failedAnalysis": "Failed to analyze drama level. Please try again!"
  }
};

const t = (key) => TRANSLATIONS['en-US'][key] || key;

const DramaMeter = () => {
  const [reaction, setReaction] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const [displayScore, setDisplayScore] = useState(0);

  const exampleReactions = [
    { label: t('exampleCoffee'), text: t('grievanceCoffee') },
    { label: t('exampleTraffic'), text: t('grievanceTraffic') },
    { label: t('examplePhone'), text: t('grievancePhone') },
    { label: t('exampleWeather'), text: t('grievanceWeather') }
  ];

  const analyzeReaction = async () => {
    if (!reaction.trim()) {
      setError(t('errorMessage'));
      return;
    }

    setLoading(true);
    setError('');

    try {
      // Mock analysis since we don't have Claude API in production
      const mockAnalysis = {
        score: Math.floor(Math.random() * 100),
        category: "Getting dramatic",
        judgment: "Your reaction was quite theatrical! You definitely know how to make a moment more dramatic than it needs to be.",
        advice: "Maybe take a deep breath next time and ask yourself: 'Will this matter in 5 years?'"
      };
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setResult(mockAnalysis);
      animateScore(mockAnalysis.score);
    } catch (err) {
      setError(t('failedAnalysis'));
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  const animateScore = (targetScore) => {
    const duration = 1500;
    const startTime = Date.now();
    const startScore = 0;

    const updateScore = () => {
      const now = Date.now();
      const progress = Math.min((now - startTime) / duration, 1);
      
      const easeOut = 1 - Math.pow(1 - progress, 3);
      const currentScore = Math.round(startScore + (targetScore - startScore) * easeOut);
      
      setDisplayScore(currentScore);
      
      if (progress < 1) {
        requestAnimationFrame(updateScore);
      }
    };
    
    requestAnimationFrame(updateScore);
  };

  const getGaugeFillDasharray = (score) => {
    const arcLength = 220;
    const fillLength = (score / 100) * arcLength;
    return `${fillLength} ${arcLength}`;
  };

  const getDramaEmoji = (score) => {
    if (score <= 20) return '😌';
    if (score <= 40) return '🤔';
    if (score <= 60) return '🎭';
    if (score <= 80) return '🎪';
    return '🏆';
  };

  return (
    <div className="min-h-screen p-8" style={{ backgroundColor: '#FEE2E2' }}>
      <div className="max-w-2xl mx-auto">
        <h1 className="text-5xl font-bold text-center mb-2" style={{ color: '#7C2D12' }}>
          {t('title')}
        </h1>
        <p className="text-center mb-8" style={{ color: '#7C2D12' }}>
          {t('subtitle')}
        </p>

        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="flex flex-col items-center mb-8">
            <div className="relative w-80 h-48 mb-4">
              <svg viewBox="0 0 200 130" className="w-full h-full">
                <path
                  d="M 30 100 A 70 70 0 0 1 170 100"
                  fill="none"
                  stroke="#E5E7EB"
                  strokeWidth="20"
                  strokeLinecap="round"
                />
                
                <path
                  d="M 30 100 A 70 70 0 0 1 170 100"
                  fill="none"
                  stroke="url(#dramaGradient)"
                  strokeWidth="20"
                  strokeLinecap="round"
                  strokeDasharray={getGaugeFillDasharray(displayScore)}
                  className="transition-all duration-1500 ease-out"
                />
                
                <defs>
                  <linearGradient id="dramaGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#10B981" />
                    <stop offset="25%" stopColor="#F59E0B" />
                    <stop offset="50%" stopColor="#EF4444" />
                    <stop offset="75%" stopColor="#8B5CF6" />
                    <stop offset="100%" stopColor="#EC4899" />
                  </linearGradient>
                </defs>
                
                <text x="28" y="125" textAnchor="middle" className="text-xs font-medium" fill="#7C2D12">Calm</text>
                <text x="100" y="15" textAnchor="middle" className="text-xs font-medium" fill="#7C2D12">Drama</text>
                <text x="172" y="125" textAnchor="middle" className="text-xs font-medium" fill="#7C2D12">Oscar</text>
              </svg>
              
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center mt-16">
                  <div className="text-4xl mb-2">{getDramaEmoji(displayScore)}</div>
                  <span className="text-5xl font-bold block" style={{ color: '#DC2626' }}>
                    {result ? displayScore : 0}%
                  </span>
                  {result && (
                    <span className="text-sm font-medium mt-1 block" style={{ color: '#DC2626' }}>
                      {result.category}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="mb-6">
            <label className="block text-lg font-semibold mb-3" style={{ color: '#7C2D12' }}>
              {t('inputLabel')}
            </label>
            
            {!result ? (
              <>
                <textarea
                  value={reaction}
                  onChange={(e) => setReaction(e.target.value)}
                  placeholder={t('inputPlaceholder')}
                  className="w-full p-4 border-2 border-red-200 rounded-lg focus:border-red-500 focus:outline-none resize-none"
                  rows={4}
                />
                
                <div className="mt-3">
                  <div className="flex flex-wrap gap-2">
                    {exampleReactions.map((example, index) => (
                      <button
                        key={index}
                        onClick={() => setReaction(example.text)}
                        className="px-3 py-1 text-sm border border-red-600 text-red-900 bg-white rounded-full transition-colors hover:bg-red-50"
                      >
                        {example.label}
                      </button>
                    ))}
                  </div>
                </div>
                
                {error && (
                  <div className="mt-3 flex items-center text-red-600">
                    <AlertCircle className="w-5 h-5 mr-2" />
                    <span>{error}</span>
                  </div>
                )}

                <button
                  onClick={analyzeReaction}
                  disabled={loading}
                  className="mt-4 w-full py-4 rounded-lg font-bold text-white transition-all transform hover:scale-105 bg-red-600 hover:bg-red-700 disabled:bg-red-400"
                >
                  {loading ? t('analyzingButton') : t('analyzeButton')}
                </button>
              </>
            ) : (
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="italic" style={{ color: '#7C2D12' }}>"{reaction}"</p>
              </div>
            )}
          </div>

          {result && (
            <div className="animate-fadeIn">
              <div className="border-t border-gray-200 pt-6">
                <div className="space-y-6">
                  <div>
                    <p className="text-lg font-semibold mb-3" style={{ color: '#7C2D12' }}>{t('analysisTitle')}</p>
                    <div className="bg-red-50 rounded-lg p-4">
                      <p style={{ color: '#7C2D12' }}>
                        {result.judgment}
                      </p>
                    </div>
                  </div>
                  
                  <div>
                    <p className="text-lg font-semibold mb-3" style={{ color: '#7C2D12' }}>{t('adviceTitle')}</p>
                    <div className="bg-red-100 rounded-lg p-4">
                      <p style={{ color: '#7C2D12' }}>
                        {result.advice}
                      </p>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => {
                    setReaction('');
                    setResult(null);
                    setDisplayScore(0);
                  }}
                  className="mt-6 w-full py-3 border-2 border-red-600 text-red-600 rounded-lg font-semibold transition-colors hover:bg-red-50"
                >
                  {t('tryAnotherButton')}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-fadeIn {
          animation: fadeIn 0.5s ease-out;
        }
      `}</style>
    </div>
  );
};

export default DramaMeter;