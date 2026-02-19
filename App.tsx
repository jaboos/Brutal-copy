import React, { useState, useEffect } from 'react';
import { Sparkles, ArrowRight, Zap, RefreshCcw, Crown, CheckCircle2 } from 'lucide-react';
import { SignedIn, SignedOut, SignInButton, UserButton, useUser } from '@clerk/clerk-react';
import { analyzeText } from './services/geminiService';
import { AnalysisResult } from './types';
import { ResultCard } from './components/ResultCard';
import { PaywallModal } from './components/PaywallModal';

const FREE_LIMIT = 3;
const MAX_CHARS = 1000;

const App: React.FC = () => {
  const { user, isSignedIn } = useUser();
  const [input, setInput] = useState('');
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [usageCount, setUsageCount] = useState(0);
  const [showPaywall, setShowPaywall] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Získání PRO statusu přímo z Clerku (místo localStorage)
  const isPro = user?.publicMetadata?.isPro === true;

  useEffect(() => {
    const storedCount = localStorage.getItem('brutal_app_usage');
    if (storedCount) {
      setUsageCount(parseInt(storedCount, 10));
    }
  }, []);

  const handleAnalyze = async () => {
    if (!input.trim()) return;

    if (!isPro && usageCount >= FREE_LIMIT) {
      setShowPaywall(true);
      return;
    }

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const data = await analyzeText(input);
      setResult(data);
      
      if (!isPro) {
        const newCount = usageCount + 1;
        setUsageCount(newCount);
        localStorage.setItem('brutal_app_usage', newCount.toString());
      }
    } catch (err: any) {
      setError(err.message || "Nastala chyba při analýze.");
    } finally {
      setLoading(false);
    }
  };

  const getScoreColor = (score: number) => {
    if (score < 40) return 'text-red-500';
    if (score < 70) return 'text-yellow-500';
    return 'text-green-500';
  };

  return (
    <div className="min-h-screen bg-background text-zinc-100 flex flex-col font-sans selection:bg-indigo-500/30">
      <PaywallModal isOpen={showPaywall} onClose={() => setShowPaywall(false)} />

      {/* Header */}
      <header className="border-b border-border bg-background/50 backdrop-blur-md sticky top-0 z-30">
        <div className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className={`p-1.5 rounded-lg ${isPro ? 'bg-amber-500' : 'bg-indigo-600'}`}>
              <Zap size={20} className="text-white" fill="currentColor" />
            </div>
            <span className="font-bold text-lg tracking-tight">Brutal Copy</span>
          </div>
          
          <div className="flex items-center gap-4">
            {isPro ? (
              <div className="flex items-center gap-2 px-3 py-1.5 bg-indigo-500/10 border border-indigo-500/50 rounded-lg animate-in fade-in zoom-in duration-500">
                <Crown size={14} className="text-amber-400 fill-amber-400/20" />
                <span className="text-xs font-bold text-indigo-300 tracking-wide uppercase">Pro Member</span>
                <CheckCircle2 size={14} className="text-indigo-500 ml-1" />
              </div>
            ) : (
              <>
                {usageCount < FREE_LIMIT && (
                  <span className="text-sm text-zinc-500 font-medium hidden sm:block">
                    zbývá {FREE_LIMIT - usageCount} zdarma
                  </span>
                )}
                
                {/* Ochrana tlačítka: Pokud není přihlášen, vyvolá login. Pokud ano, otevře Paywall. */}
                {isSignedIn ? (
                  <button 
                    onClick={() => setShowPaywall(true)}
                    className="group flex items-center gap-2 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 hover:border-indigo-500/50 text-xs font-semibold py-1.5 px-3 rounded-lg transition-all duration-300"
                  >
                    <Crown size={14} className="text-indigo-500 group-hover:text-indigo-400" />
                    <span className="text-zinc-300 group-hover:text-white">Bez limitů</span>
                  </button>
                ) : (
                  <SignInButton mode="modal">
                    <button className="group flex items-center gap-2 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 hover:border-indigo-500/50 text-xs font-semibold py-1.5 px-3 rounded-lg transition-all duration-300">
                      <Crown size={14} className="text-indigo-500 group-hover:text-indigo-400" />
                      <span className="text-zinc-300 group-hover:text-white">Bez limitů</span>
                    </button>
                  </SignInButton>
                )}
              </>
            )}

            <div className="pl-4 ml-2 border-l border-zinc-800 flex items-center">
              <SignedOut>
                <SignInButton mode="modal">
                  <button className="bg-zinc-800 hover:bg-zinc-700 text-white text-xs font-semibold py-1.5 px-4 rounded-lg transition-colors">
                    Přihlásit se
                  </button>
                </SignInButton>
              </SignedOut>
              <SignedIn>
                <UserButton />
              </SignedIn>
            </div>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-5xl mx-auto w-full px-6 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-4 bg-gradient-to-br from-white to-zinc-500 bg-clip-text text-transparent">
            Udělej svůj text úderný.
          </h1>
          <p className="text-zinc-400 text-lg max-w-2xl mx-auto">
            Odstraň korporátní balast. AI analýza, která ti řekne pravdu do očí a přepíše tvůj text tak, aby se četl sám.
          </p>
        </div>

        <div className="max-w-3xl mx-auto mb-16 relative">
          <div className={`absolute -inset-1 rounded-2xl blur opacity-20 transition duration-1000 group-hover:opacity-40 ${isPro ? 'bg-gradient-to-r from-amber-500 to-indigo-600' : 'bg-gradient-to-r from-indigo-500 to-purple-600'}`}></div>
          <div className="relative bg-zinc-900 rounded-xl border border-border shadow-2xl overflow-hidden">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Vlož sem svůj reklamní text, e-mail nebo post..."
              className="w-full h-48 bg-transparent text-lg p-6 resize-none focus:outline-none placeholder:text-zinc-600"
              maxLength={isPro ? 4000 : MAX_CHARS}
            />
            <div className="flex items-center justify-between px-6 py-4 border-t border-border bg-zinc-900/50">
              <span className={`text-xs font-medium ${input.length > (isPro ? 4000 : MAX_CHARS) * 0.9 ? 'text-red-400' : 'text-zinc-500'}`}>
                {input.length} / {isPro ? '4000' : MAX_CHARS}
              </span>
              <button
                onClick={handleAnalyze}
                disabled={loading || input.length === 0}
                className={`flex items-center space-x-2 px-6 py-2.5 rounded-lg font-semibold transition-all duration-200 
                  ${loading || input.length === 0 
                    ? 'bg-zinc-800 text-zinc-500 cursor-not-allowed' 
                    : isPro 
                      ? 'bg-white text-black hover:bg-zinc-200 shadow-[0_0_15px_rgba(255,255,255,0.2)]'
                      : 'bg-white text-black hover:bg-zinc-200 shadow-[0_0_15px_rgba(255,255,255,0.1)]'
                  }`}
              >
                {loading ? (
                  <>
                    <RefreshCcw size={18} className="animate-spin" />
                    <span>Analyzuji...</span>
                  </>
                ) : (
                  <>
                    <Sparkles size={18} />
                    <span>Analyzovat</span>
                  </>
                )}
              </button>
            </div>
          </div>
          {error && (
            <div className="mt-4 p-4 bg-red-500/10 border border-red-500/20 text-red-400 rounded-lg text-sm text-center">
              {error}
            </div>
          )}
        </div>

        {result && (
          <div className="animate-in fade-in slide-in-from-bottom-8 duration-700">
            <div className="grid md:grid-cols-3 gap-6 mb-12">
              <div className="md:col-span-1 bg-zinc-900/50 border border-border rounded-xl p-8 flex flex-col items-center justify-center text-center">
                <span className="text-zinc-500 text-sm font-medium uppercase tracking-wider mb-2">Brutal Score</span>
                <div className={`text-6xl font-black ${getScoreColor(result.score)}`}>
                  {result.score}
                </div>
              </div>
              <div className="md:col-span-2 bg-zinc-900/50 border border-border rounded-xl p-8 flex flex-col justify-center">
                <h3 className="text-zinc-300 font-semibold mb-2 flex items-center">
                   Verdikt <ArrowRight size={16} className="ml-2 text-zinc-500" />
                </h3>
                <p className="text-zinc-400 leading-relaxed italic">
                  "{result.critique}"
                </p>
              </div>
            </div>

            <div className="mb-8">
              <h2 className="text-2xl font-bold mb-6 flex items-center">
                <span className="bg-indigo-500 w-1 h-6 rounded-full mr-3"></span>
                Vylepšené varianty
              </h2>
              <div className="grid md:grid-cols-3 gap-6">
                {result.variations.map((variation, index) => (
                  <ResultCard 
                    key={index} 
                    variation={variation} 
                    delay={index * 150} 
                  />
                ))}
              </div>
            </div>
          </div>
        )}
      </main>

      <footer className="border-t border-border py-8 mt-auto">
        <div className="max-w-5xl mx-auto px-6 text-center text-zinc-600 text-sm">
          <p>&copy; {new Date().getFullYear()} Brutal Copy Auditor. Built with Gemini AI.</p>
        </div>
      </footer>
    </div>
  );
};

export default App;
