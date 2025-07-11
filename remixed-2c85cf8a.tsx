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
  },
  "es-ES": {
    "title": "¿Qué tan dramático eres?",
    "subtitle": "Comparte tu reacción y deja que Claude mida tu nivel de drama",
    "inputLabel": "¿Qué pasó y cómo reaccionaste?",
    "inputPlaceholder": "El WiFi se cayó por 5 minutos y dramáticamente declaré que era el fin del mundo...",
    "exampleCoffee": "Drama del café",
    "exampleTraffic": "Colapso de tráfico",
    "examplePhone": "Pánico de batería",
    "exampleWeather": "Problemas del clima",
    "grievanceCoffee": "La cafetería no tenía mi pedido usual, así que suspiré profundamente y dije que mi día estaba arruinado",
    "grievanceTraffic": "Estuve atrapado en tráfico por 10 minutos extra y empecé a tocar el claxon gritando '¡¿Por qué siempre me pasa a MÍ?!'",
    "grievancePhone": "Mi teléfono se murió al 15% y jadeé como si estuviera presenciando una tragedia",
    "grievanceWeather": "Empezó a llover inesperadamente y levanté las manos declarando '¡El universo está en mi contra hoy!'",
    "errorMessage": "¡Por favor comparte tu reacción para analizar tu nivel de drama!",
    "analyzeButton": "¡Mide mi drama!",
    "analyzingButton": "Analizando drama...",
    "analysisTitle": "Análisis de Drama",
    "adviceTitle": "Verificación de Realidad",
    "tryAnotherButton": "Probar otra reacción",
    "failedAnalysis": "Error al analizar el nivel de drama. ¡Por favor intenta de nuevo!"
  }
};

const appLocale = '{{APP_LOCALE}}';
const browserLocale = navigator.languages?.[0] || navigator.language || 'en-US';
const findMatchingLocale = (locale) => {
  if (TRANSLATIONS[locale]) return locale;
  const lang = locale.split('-')[0];
  const match = Object.keys(TRANSLATIONS).find(key => key.startsWith(lang + '-'));
  return match || 'en-US';
};
const locale = (appLocale !== '{{APP_LOCALE}}') ? findMatchingLocale(appLocale) : findMatchingLocale(browserLocale);
const t = (key) => TRANSLATIONS[locale]?.[key] || TRANSLATIONS['en-US'][key] || key;

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
      const prompt = `You are a witty but fair judge of dramatic behavior. Analyze the following reaction and rate it on a drama scale from 0 to 100, where:
      - 0-20: Totally reasonable (That's a normal human reaction)
      - 21-40: Slightly theatrical (A bit much, but we get it)
      - 41-60: Getting dramatic (You're channeling your inner soap opera)
      - 61-80: Full drama mode (Shakespeare would be proud)
      - 81-100: Oscar-worthy performance (Hollywood is calling!)

      Reaction: "${reaction}"

      Respond ONLY with a valid JSON object in this exact format:
      {
        "score": [number between 0-100],
        "category": "[one of the category names above]",
        "judgment": "[A funny but not mean 1-2 sentence analysis of their dramatic reaction]",
        "advice": "[A humorous but helpful reality check in 1 sentence]"
      }

      DO NOT OUTPUT ANYTHING OTHER THAN VALID JSON.

      Please respond in ${locale} language`;

      const response = await window.claude.complete(prompt);
      const data = JSON.parse(response);
      setResult(data);
      
      // Animate the score
      animateScore(data.score);
    } catch (err) {
      setError(t('failedAnalysis'));
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  const animateScore = (targetScore) => {
    const duration = 1500; // 1.5 seconds
    const startTime = Date.now();
    const startScore = 0;

    const updateScore = () => {
      const now = Date.now();
      const progress = Math.min((now - startTime) / duration, 1);
      
      // Ease-out animation
      const easeOut = 1 - Math.pow(1 - progress, 3);
      const currentScore = Math.round(startScore + (targetScore - startScore) * easeOut);
      
      setDisplayScore(currentScore);
      
      if (progress < 1) {
        requestAnimationFrame(updateScore);
      }
    };
    
    requestAnimationFrame(updateScore);
  };

  const getGaugeRotation = (score) => {
    // Convert 0-100 to -90 to 90 degrees
    return (score * 1.8) - 90;
  };

  const getGaugeColor = (score) => {
    if (score <= 20) return '#10B981'; // Green - reasonable
    if (score <= 40) return '#F59E0B'; // Yellow - slightly theatrical
    if (score <= 60) return '#EF4444'; // Red - getting dramatic
    if (score <= 80) return '#8B5CF6'; // Purple - full drama
    return '#EC4899'; // Pink - Oscar-worthy
  };
  
  const getGaugeFillDasharray = (score) => {
    // Arc length is approximately 220
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

        {/* Single Container for Everything */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          {/* Gauge Meter */}
          <div className="flex flex-col items-center mb-8">
            <div className="relative w-80 h-48 mb-4">
              <svg viewBox="0 0 200 130" className="w-full h-full">
                {/* Background arc */}
                <path
                  d="M 30 100 A 70 70 0 0 1 170 100"
                  fill="none"
                  stroke="#E5E7EB"
                  strokeWidth="20"
                  strokeLinecap="round"
                />
                
                {/* Animated gradient fill arc */}
                <path
                  d="M 30 100 A 70 70 0 0 1 170 100"
                  fill="none"
                  stroke="url(#dramaGradient)"
                  strokeWidth="20"
                  strokeLinecap="round"
                  strokeDasharray={getGaugeFillDasharray(displayScore)}
                  className="transition-all duration-1500 ease-out"
                />
                
                {/* Gradient definition - drama themed */}
                <defs>
                  <linearGradient id="dramaGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#10B981" />
                    <stop offset="25%" stopColor="#F59E0B" />
                    <stop offset="50%" stopColor="#EF4444" />
                    <stop offset="75%" stopColor="#8B5CF6" />
                    <stop offset="100%" stopColor="#EC4899" />
                  </linearGradient>
                </defs>
                
                {/* Labels */}
                <text x="28" y="125" textAnchor="middle" className="text-xs font-medium" fill="#7C2D12">Calm</text>
                <text x="100" y="15" textAnchor="middle" className="text-xs font-medium" fill="#7C2D12">Drama</text>
                <text x="172" y="125" textAnchor="middle" className="text-xs font-medium" fill="#7C2D12">Oscar</text>
              </svg>
              
              {/* Score display */}
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

          {/* Input Section */}
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
                  style={{ borderColor: 'rgba(220, 38, 38, 0.3)' }}
                  rows={4}
                />
                
                {/* Example buttons */}
                <div className="mt-3">
                  <div className="flex flex-wrap gap-2">
                    {exampleReactions.map((example, index) => (
                      <button
                        key={index}
                        onClick={() => setReaction(example.text)}
                        className="px-3 py-1 text-sm border rounded-full transition-colors"
                        style={{ 
                          borderColor: '#DC2626',
                          color: '#7C2D12',
                          backgroundColor: 'white'
                        }}
                        onMouseEnter={(e) => {
                          e.target.style.backgroundColor = '#FEF2F2';
                          e.target.style.color = '#DC2626';
                        }}
                        onMouseLeave={(e) => {
                          e.target.style.backgroundColor = 'white';
                          e.target.style.color = '#7C2D12';
                        }}
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
                  className={`mt-4 w-full py-4 rounded-lg font-bold text-white transition-all transform hover:scale-105`}
                  style={{
                    backgroundColor: loading ? '#F87171' : '#DC2626',
                  }}
                  onMouseEnter={(e) => !loading && (e.target.style.backgroundColor = '#B91C1C')}
                  onMouseLeave={(e) => !loading && (e.target.style.backgroundColor = '#DC2626')}
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

          {/* Results Section */}
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
                  className="mt-6 w-full py-3 border-2 rounded-lg font-semibold transition-colors"
                  style={{ 
                    borderColor: '#DC2626', 
                    color: '#DC2626' 
                  }}
                  onMouseEnter={(e) => e.target.style.backgroundColor = '#FEF2F2'}
                  onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
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