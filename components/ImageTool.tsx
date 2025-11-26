import React, { useState } from 'react';
import { Image as ImageIcon, Wand2, Download, Loader2, AlertCircle } from 'lucide-react';
import { generateImage } from '../services/geminiService';

export const ImageTool: React.FC = () => {
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!prompt.trim()) return;

    setLoading(true);
    setImageUrl(null);
    setError(null);

    try {
      const result = await generateImage(prompt);
      if (result.imageUrl) {
        setImageUrl(result.imageUrl);
      } else {
        setError(result.error || "Failed to generate.");
      }
    } catch (e) {
      setError("Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-8 animate-fadeIn">
      <div className="flex items-center gap-3 mb-4">
        <div className="p-3 bg-fuchsia-500/20 rounded-xl text-fuchsia-400 ring-1 ring-fuchsia-500/30">
           <ImageIcon size={24} />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-white">Imagine AI</h2>
          <p className="text-slate-400 text-sm">Turn text into stunning visuals instantly</p>
        </div>
      </div>

      <div className="bg-slate-800/40 backdrop-blur-md border border-white/10 rounded-3xl p-8 shadow-xl">
        <form onSubmit={handleGenerate} className="relative">
          <textarea 
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Describe what you want to see (e.g., 'A cyberpunk city at sunset with neon rain')..."
            className="w-full h-24 bg-slate-900/60 border border-slate-700/50 rounded-2xl p-5 text-lg text-white focus:outline-none focus:ring-2 focus:ring-fuchsia-500/50 transition-all placeholder-slate-600 resize-none"
          />
          <div className="mt-4 flex justify-end">
            <button 
              type="submit"
              disabled={loading}
              className="bg-fuchsia-600 hover:bg-fuchsia-500 text-white px-8 py-3 rounded-xl font-medium transition-all shadow-lg shadow-fuchsia-900/20 flex items-center gap-2 disabled:opacity-50"
            >
              {loading ? <Loader2 className="animate-spin" size={20} /> : <><Wand2 size={20}/> Generate</>}
            </button>
          </div>
          {error && (
            <div className="mt-4 flex items-center gap-2 text-red-300 text-sm bg-red-500/10 p-3 rounded-xl border border-red-500/20 animate-slideUp">
              <AlertCircle size={16} />
              {error}
            </div>
          )}
        </form>
      </div>

      {imageUrl && (
        <div className="bg-slate-900/50 backdrop-blur-md border border-white/10 rounded-3xl p-4 shadow-2xl animate-slideUp flex flex-col items-center">
           <div className="relative group w-full max-w-lg aspect-square rounded-2xl overflow-hidden shadow-2xl ring-1 ring-white/10">
             <img src={imageUrl} alt="Generated" className="w-full h-full object-cover" />
             <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
               <a 
                 href={imageUrl} 
                 download={`imagine-${Date.now()}.png`}
                 className="bg-white text-black px-6 py-2 rounded-full font-bold flex items-center gap-2 transform translate-y-4 group-hover:translate-y-0 transition-all"
               >
                 <Download size={18} /> Download
               </a>
             </div>
           </div>
        </div>
      )}
    </div>
  );
};