import React, { useState, useEffect } from 'react';
import { InputSection } from './components/InputSection';
import { FarmShieldDashboard } from './components/FarmShieldDashboard';
import { analyzeAgriculturalInput, AnalysisResult } from './services/geminiService';
import { Sprout, ShieldCheck, Info, AlertTriangle, RefreshCcw } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function App() {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleAnalyze = async (files: { data: string; mimeType: string }[]) => {
    setIsAnalyzing(true);
    setError(null);
    try {
      // In a real app, we'd fetch weather/market data here
      // For this demo, we'll let Gemini synthesize based on the multimodal input
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
    <div className="min-h-screen bg-stone-950 text-stone-100 font-sans selection:bg-emerald-500 selection:text-stone-950">
      {/* Rugged Header */}
      <header className="border-b-4 border-stone-900 bg-stone-950 sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-emerald-500 p-2 rounded-lg shadow-[0_0_15px_rgba(16,185,129,0.4)]">
              <Sprout className="w-6 h-6 text-stone-950" />
            </div>
            <div>
              <h1 className="text-xl font-black uppercase tracking-tighter leading-none">AgroPulse</h1>
              <p className="text-[10px] font-bold text-stone-500 uppercase tracking-widest mt-1">Universal Bridge v1.0</p>
            </div>
          </div>
          
          <div className="hidden sm:flex items-center gap-4">
            <div className="flex items-center gap-2 px-3 py-1 bg-stone-900 rounded-full border border-stone-800">
              <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
              <span className="text-[10px] font-black text-stone-400 uppercase tracking-widest">System Online</span>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-12">
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
                <h2 className="text-4xl sm:text-6xl font-black uppercase tracking-tighter leading-none text-stone-200">
                  Convert Noise into <span className="text-emerald-500">Action.</span>
                </h2>
                <p className="text-stone-500 max-w-xl mx-auto font-medium text-lg">
                  Upload crop photos, radio clips, or voice memos. Gemini translates messy environmental data into life-saving agricultural instructions.
                </p>
              </div>

              <InputSection onAnalyze={handleAnalyze} isAnalyzing={isAnalyzing} />

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                {[
                  { icon: <ShieldCheck className="w-5 h-5" />, title: "Farm-Shield", desc: "Real-time threat detection" },
                  { icon: <Info className="w-5 h-5" />, title: "Verified", desc: "Sourced from trusted data" },
                  { icon: <AlertTriangle className="w-5 h-5" />, title: "Rugged", desc: "Built for low-bandwidth" }
                ].map((feature, i) => (
                  <div key={i} className="p-6 bg-stone-900/50 border border-stone-800 rounded-2xl">
                    <div className="text-emerald-500 mb-3">{feature.icon}</div>
                    <h3 className="font-black uppercase text-xs tracking-widest mb-1">{feature.title}</h3>
                    <p className="text-xs text-stone-500 font-medium">{feature.desc}</p>
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
                  className="flex items-center gap-2 text-stone-500 hover:text-stone-300 transition-colors uppercase font-black text-[10px] tracking-widest"
                >
                  <RefreshCcw className="w-4 h-4" />
                  New Analysis
                </button>
                <div className="px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded-full">
                  <span className="text-[10px] font-black text-emerald-500 uppercase tracking-widest">Analysis Complete</span>
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
            className="mt-8 p-4 bg-red-500/10 border border-red-500/20 rounded-xl flex items-center gap-3 text-red-500"
          >
            <AlertTriangle className="w-5 h-5 shrink-0" />
            <p className="text-xs font-bold">{error}</p>
          </motion.div>
        )}
      </main>

      <footer className="border-t border-stone-900 py-12 px-6">
        <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2 opacity-30 grayscale">
            <Sprout className="w-5 h-5" />
            <span className="font-black uppercase tracking-tighter text-sm">AgroPulse</span>
          </div>
          <p className="text-[10px] font-bold text-stone-700 uppercase tracking-[0.2em]">
            Empowering small-scale farmers through AI
          </p>
        </div>
      </footer>
    </div>
  );
}
