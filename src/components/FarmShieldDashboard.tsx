import React from 'react';
import { Shield, AlertTriangle, TrendingUp, CheckCircle2, MapPin, Info } from 'lucide-react';
import { AnalysisResult } from '@/src/services/geminiService';
import { cn } from '@/src/lib/utils';
import { ThreatMap } from './ThreatMap';
import { motion } from 'motion/react';

interface DashboardProps {
  data: AnalysisResult;
}

export const FarmShieldDashboard: React.FC<DashboardProps> = ({ data }) => {
  const severityColors = {
    safe: 'bg-emerald-500 text-stone-950 shadow-emerald-500/20',
    warning: 'bg-amber-500 text-stone-950 shadow-amber-500/20',
    alert: 'bg-red-500 text-stone-950 shadow-red-500/20',
  };

  const severityIcons = {
    safe: <CheckCircle2 className="w-8 h-8" />,
    warning: <AlertTriangle className="w-8 h-8" />,
    alert: <Shield className="w-8 h-8" />,
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      {/* Immediate Action */}
      <div className={cn(
        "p-8 rounded-2xl border-4 border-stone-950 shadow-2xl flex items-center gap-6",
        severityColors[data.immediateAction.severity]
      )}>
        <div className="p-4 bg-stone-950/10 rounded-xl">
          {severityIcons[data.immediateAction.severity]}
        </div>
        <div>
          <p className="text-[10px] font-black uppercase tracking-[0.3em] mb-1 opacity-70">Immediate Action Required</p>
          <h1 className="text-3xl font-black uppercase tracking-tighter leading-none">
            {data.immediateAction.instruction}
          </h1>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Diagnosis */}
        <div className="bg-stone-900 border-2 border-stone-800 rounded-2xl p-6">
          <h2 className="text-stone-400 uppercase tracking-widest text-[10px] font-black mb-4 flex items-center gap-2">
            <Info className="w-4 h-4 text-emerald-500" />
            Field Diagnosis
          </h2>
          <p className="text-stone-200 font-medium leading-relaxed">
            {data.diagnosis}
          </p>
          <div className="mt-4 pt-4 border-t border-stone-800 flex items-center justify-between">
            <span className="text-[10px] font-black text-stone-500 uppercase">Verification Source</span>
            <span className="px-2 py-1 bg-stone-800 rounded text-[10px] font-bold text-emerald-400 border border-emerald-500/20">
              {data.verificationSource}
            </span>
          </div>
        </div>

        {/* Profit Optimizer */}
        <div className="bg-stone-900 border-2 border-stone-800 rounded-2xl p-6">
          <h2 className="text-stone-400 uppercase tracking-widest text-[10px] font-black mb-4 flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-amber-500" />
            Profit Optimizer
          </h2>
          <div className="bg-stone-950 p-4 rounded-xl border border-stone-800 mb-4">
            <p className="text-amber-500 font-black text-xl uppercase tracking-tight mb-1">
              {data.marketAdvice.recommendation}
            </p>
            <p className="text-stone-400 text-xs leading-snug">
              {data.marketAdvice.reasoning}
            </p>
          </div>
          <p className="text-[10px] text-stone-500 italic">
            * Based on regional grain market trends and current environmental threats.
          </p>
        </div>
      </div>

      {/* Threat Map */}
      <div className="bg-stone-900 border-2 border-stone-800 rounded-2xl p-6">
        <h2 className="text-stone-400 uppercase tracking-widest text-[10px] font-black mb-4 flex items-center gap-2">
          <MapPin className="w-4 h-4 text-red-500" />
          Regional Threat Map
        </h2>
        <ThreatMap threats={data.threats} />
        <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 gap-4">
          {data.threats.map((threat, idx) => (
            <div key={idx} className="bg-stone-950 p-3 rounded-lg border border-stone-800">
              <p className="text-[10px] font-black text-stone-500 uppercase mb-1">{threat.type}</p>
              <p className="text-xs font-bold text-stone-200">{threat.location}</p>
              <p className="text-[10px] text-stone-400 mt-1">{threat.radiusKm}km radius</p>
            </div>
          ))}
        </div>
      </div>

      <div className="text-center pb-8">
        <p className="text-[10px] font-black text-stone-600 uppercase tracking-widest">
          Detected Language: {data.detectedLanguage} • AgroPulse v1.0
        </p>
      </div>
    </motion.div>
  );
};
