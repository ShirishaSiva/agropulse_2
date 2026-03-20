import React, { useState, useRef } from 'react';
import { Camera, Mic, Upload, X, Loader2 } from 'lucide-react';
import { cn } from '@/src/lib/utils';

interface InputSectionProps {
  onAnalyze: (files: { data: string; mimeType: string }[]) => void;
  isAnalyzing: boolean;
}

export const InputSection: React.FC<InputSectionProps> = ({ onAnalyze, isAnalyzing }) => {
  const [files, setFiles] = useState<{ data: string; mimeType: string; name: string; type: 'image' | 'audio' }[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const audioInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, type: 'image' | 'audio') => {
    const selectedFiles = e.target.files;
    if (!selectedFiles) return;

    Array.from(selectedFiles).forEach(file => {
      const reader = new FileReader();
      reader.onload = (event) => {
        const data = event.target?.result as string;
        setFiles(prev => [...prev, { data, mimeType: file.type, name: file.name, type }]);
      };
      reader.readAsDataURL(file);
    });
  };

  const removeFile = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="bg-stone-900 border-2 border-stone-800 rounded-2xl p-6 shadow-2xl">
      <h2 className="text-stone-400 uppercase tracking-widest text-xs font-bold mb-4 flex items-center gap-2">
        <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
        Input Bridge
      </h2>
      
      <div className="grid grid-cols-2 gap-4 mb-6">
        <button
          onClick={() => fileInputRef.current?.click()}
          className="flex flex-col items-center justify-center gap-3 p-8 border-2 border-dashed border-stone-700 rounded-xl hover:border-emerald-500/50 hover:bg-emerald-500/5 transition-all group"
        >
          <Camera className="w-8 h-8 text-stone-500 group-hover:text-emerald-500" />
          <span className="text-sm font-bold text-stone-400 group-hover:text-emerald-400">Crop Photo</span>
          <input
            type="file"
            ref={fileInputRef}
            onChange={(e) => handleFileChange(e, 'image')}
            accept="image/*"
            className="hidden"
            multiple
          />
        </button>

        <button
          onClick={() => audioInputRef.current?.click()}
          className="flex flex-col items-center justify-center gap-3 p-8 border-2 border-dashed border-stone-700 rounded-xl hover:border-amber-500/50 hover:bg-amber-500/5 transition-all group"
        >
          <Mic className="w-8 h-8 text-stone-500 group-hover:text-amber-500" />
          <span className="text-sm font-bold text-stone-400 group-hover:text-amber-400">Radio/Voice</span>
          <input
            type="file"
            ref={audioInputRef}
            onChange={(e) => handleFileChange(e, 'audio')}
            accept="audio/*"
            className="hidden"
            multiple
          />
        </button>
      </div>

      {files.length > 0 && (
        <div className="space-y-3 mb-6">
          {files.map((file, idx) => (
            <div key={idx} className="flex items-center justify-between bg-stone-800/50 p-3 rounded-lg border border-stone-700">
              <div className="flex items-center gap-3">
                {file.type === 'image' ? (
                  <img src={file.data} className="w-10 h-10 rounded object-cover border border-stone-600" alt="preview" />
                ) : (
                  <div className="w-10 h-10 rounded bg-amber-500/20 flex items-center justify-center border border-amber-500/30">
                    <Mic className="w-5 h-5 text-amber-500" />
                  </div>
                )}
                <span className="text-xs font-mono text-stone-300 truncate max-w-[150px]">{file.name}</span>
              </div>
              <button onClick={() => removeFile(idx)} className="text-stone-500 hover:text-red-500">
                <X className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      )}

      <button
        onClick={() => onAnalyze(files)}
        disabled={files.length === 0 || isAnalyzing}
        className={cn(
          "w-full py-4 rounded-xl font-black uppercase tracking-tighter text-lg transition-all flex items-center justify-center gap-2",
          files.length === 0 || isAnalyzing
            ? "bg-stone-800 text-stone-600 cursor-not-allowed"
            : "bg-emerald-500 text-stone-950 hover:bg-emerald-400 active:scale-[0.98] shadow-[0_0_20px_rgba(16,185,129,0.3)]"
        )}
      >
        {isAnalyzing ? (
          <>
            <Loader2 className="w-6 h-6 animate-spin" />
            Synthesizing...
          </>
        ) : (
          <>
            <Upload className="w-6 h-6" />
            Bridge to Action
          </>
        )}
      </button>
    </div>
  );
};
