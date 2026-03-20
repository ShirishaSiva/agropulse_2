import React, { useState, useEffect } from 'react';
import { InputSection } from './components/InputSection';
import { FarmShieldDashboard } from './components/FarmShieldDashboard';
import { analyzeAgriculturalInput, AnalysisResult } from './services/geminiService';
import { Sprout, ShieldCheck, Info, AlertTriangle, RefreshCcw, Sun, Moon } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function App() {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [theme, setTheme] = useState<'light' | 'dark'>('dark');

  useEffect(() => {
    if (theme === 'dark') {
      document.body.classList.add('dark');
    } else {
      document.body.classList.remove('dark');
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  const handleAnalyze = async (files: { data: string; mimeType: string }[]) => {
    setIsAnalyzing(true);
    setError(null);
    try {
      const analysis = await analyzeAgriculturalInput(files);
      setResult(analysis);
    } catch (err) {
      console.error(err);
      setError("Failed to bridge environmental noise. Check your connection and Gemini API key.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const reset = () => {
    setResult(null);
    setError(null);
  };

  return (
    <div className="min-h-screen font-sans selection:bg-emerald-500 selection:text-stone-950 transition-colors duration-300">
      {/* Rugged Header */}
      <header className="border-b border-blue-200 dark:border-stone-800/50 bg-white dark:bg-stone-950/60 backdrop-blur-md sticky top-0 z-50 transition-colors duration-500">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-blue-600 dark:bg-emerald-500 p-2 rounded-lg shadow-[0_0_15px_rgba(37,99,235,0.4)]">
              <Sprout className="w-6 h-6 text-white dark:text-stone-950" />
            </div>
            <div>
              <h1 className="text-xl font-black uppercase tracking-tighter leading-none dark:text-stone-100 text-blue-950">AgroPulse</h1>
              <p className="text-[10px] font-bold text-blue-700 dark:text-stone-500 uppercase tracking-widest mt-1">Universal Bridge v1.0</p>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg bg-white dark:bg-stone-900 text-blue-800 dark:text-stone-400 hover:text-blue-600 dark:hover:text-emerald-500 transition-all border border-blue-200 dark:border-stone-800 shadow-sm"
              aria-label="Toggle theme"
            >
              {theme === 'light' ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
            </button>
            <div className="hidden sm:flex items-center gap-2 px-3 py-1 bg-white dark:bg-stone-900 rounded-full border border-blue-200 dark:border-stone-800 shadow-sm">
              <div className="w-2 h-2 bg-blue-600 dark:bg-emerald-500 rounded-full animate-pulse" />
              <span className="text-[10px] font-black text-blue-800 dark:text-stone-400 uppercase tracking-widest">System Online</span>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-12">
        <AnimatePresence mode="wait">
          {!result ? (
            <motion.div
              key="input"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.05 }}
              className="space-y-12"
            >
              <div className="text-center space-y-4">
                <h2 className="text-4xl sm:text-6xl font-black uppercase tracking-tighter leading-none text-blue-950 dark:text-stone-200 drop-shadow-sm">
                  Listen to Your Land. <span className="text-blue-600 dark:text-emerald-500">Lead the Harvest.</span>
                </h2>
                <p className="text-blue-900 dark:text-stone-500 max-w-xl mx-auto font-bold text-lg bg-white/40 dark:bg-transparent p-2 rounded-lg backdrop-blur-sm">
                  Snap a photo, record a voice memo, or capture radio alerts. AgroPulse decodes messy environmental signals into precise, actionable strategies to protect your yield.
                </p>
              </div>

              <InputSection onAnalyze={handleAnalyze} isAnalyzing={isAnalyzing} />

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                  {[
                    { icon: <ShieldCheck className="w-5 h-5" />, title: "Farm-Shield", desc: "Real-time threat detection" },
                    { icon: <Info className="w-5 h-5" />, title: "Verified", desc: "Sourced from trusted data" },
                    { icon: <AlertTriangle className="w-5 h-5" />, title: "Rugged", desc: "Built for low-bandwidth" }
                  ].map((feature, i) => (
                    <div key={i} className="p-6 bg-white dark:bg-stone-900/60 backdrop-blur-md border border-blue-200 dark:border-stone-800/50 rounded-2xl transition-colors duration-500 shadow-xl">
                      <div className="text-blue-600 dark:text-emerald-500 mb-3">{feature.icon}</div>
                      <h3 className="font-black uppercase text-xs tracking-widest mb-1 text-blue-950 dark:text-stone-100">{feature.title}</h3>
                      <p className="text-xs text-blue-800 dark:text-stone-500 font-bold">{feature.desc}</p>
                    </div>
                  ))}
                </div>
            </motion.div>
          ) : (
            <motion.div
              key="dashboard"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <div className="flex items-center justify-between mb-8">
                <button 
                  onClick={reset}
                  className="flex items-center gap-2 text-blue-700 hover:text-blue-950 dark:hover:text-stone-300 transition-colors uppercase font-black text-[10px] tracking-widest bg-white/80 dark:bg-transparent px-3 py-2 rounded-lg"
                >
                  <RefreshCcw className="w-4 h-4" />
                  New Analysis
                </button>
                <div className="px-3 py-1 bg-blue-600 dark:bg-emerald-500/10 border border-blue-600/20 dark:border-emerald-500/20 rounded-full">
                  <span className="text-[10px] font-black text-white dark:text-emerald-500 uppercase tracking-widest">Analysis Complete</span>
                </div>
              </div>
              <FarmShieldDashboard data={result} />
            </motion.div>
          )}
        </AnimatePresence>

        {error && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-8 p-4 bg-red-500/10 border border-red-500/20 rounded-xl flex items-center gap-3 text-red-700"
          >
            <AlertTriangle className="w-5 h-5 shrink-0" />
            <p className="text-xs font-bold">{error}</p>
          </motion.div>
        )}
      </main>

      <footer className="border-t border-blue-200 dark:border-stone-800/50 bg-white dark:bg-stone-950/60 backdrop-blur-md py-12 px-6 transition-colors duration-500">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2 opacity-50">
            <Sprout className="w-5 h-5 text-blue-950 dark:text-stone-100" />
            <span className="font-black uppercase tracking-tighter text-sm text-blue-950 dark:text-stone-100">AgroPulse</span>
          </div>
          <p className="text-[10px] font-bold text-blue-800 dark:text-stone-700 uppercase tracking-[0.2em]">
            Empowering small-scale farmers through AI
          </p>
        </div>
      </footer>
    </div>
  );
}
