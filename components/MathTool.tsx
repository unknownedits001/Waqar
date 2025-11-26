import React, { useState } from 'react';
import { Calculator, ArrowRight, Loader2, Sigma, Divide, Plus, ChevronRight } from 'lucide-react';
import { solveMath } from '../services/geminiService';
import { MathData } from '../types';

export const MathTool: React.FC = () => {
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [mathData, setMathData] = useState<MathData | null>(null);

  const handleSolve = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!input.trim()) return;

    setLoading(true);
    setMathData(null);
    const res = await solveMath(input);
    if (res.data) setMathData(res.data);
    setLoading(false);
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-8 animate-fadeIn">
      <div className="flex items-center gap-3 mb-4">
        <div className="p-3 bg-pink-500/20 rounded-xl text-pink-400 ring-1 ring-pink-500/30">
           <Calculator size={24} />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-white">Math Genius</h2>
          <p className="text-slate-400 text-sm">Solve complex problems with step-by-step logic</p>
        </div>
      </div>

      <div className="bg-slate-800/40 backdrop-blur-md border border-white/10 rounded-3xl p-8 shadow-xl">
        <form onSubmit={handleSolve} className="relative">
          <textarea 
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your math problem here (e.g. 'Integrate x^2 from 0 to 5' or 'Solve 3x + 5 = 20')..."
            className="w-full h-32 bg-slate-900/60 border border-slate-700/50 rounded-2xl p-5 text-lg text-white focus:outline-none focus:ring-2 focus:ring-pink-500/50 transition-all placeholder-slate-600 resize-none font-mono"
          />
          <div className="absolute bottom-4 right-4 flex gap-2">
            <button 
              type="submit"
              disabled={loading}
              className="bg-pink-600 hover:bg-pink-500 text-white px-6 py-2 rounded-xl font-medium transition-all shadow-lg shadow-pink-900/20 flex items-center gap-2 disabled:opacity-50"
            >
              {loading ? <Loader2 className="animate-spin" size={18} /> : <>Solve <ArrowRight size={18}/></>}
            </button>
          </div>
        </form>
      </div>

      {mathData && (
        <div className="space-y-6 animate-slideUp">
           <div className="bg-gradient-to-r from-slate-800/60 to-slate-900/60 backdrop-blur-md border border-white/10 rounded-3xl p-8 flex items-center justify-between shadow-2xl relative overflow-hidden">
              <div className="absolute left-0 top-0 w-1 h-full bg-pink-500" />
              <div>
                <p className="text-slate-400 text-sm uppercase tracking-wider mb-1">Result</p>
                <h3 className="text-3xl font-bold text-white font-mono">{mathData.result}</h3>
              </div>
              <div className="bg-pink-500/10 px-4 py-2 rounded-full border border-pink-500/20">
                <span className="text-pink-300 font-medium text-sm">{mathData.topic}</span>
              </div>
           </div>

           <div className="bg-slate-800/40 backdrop-blur-md border border-white/10 rounded-3xl p-8">
             <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
               <Sigma size={20} className="text-pink-400"/> Solution Steps
             </h3>
             <div className="space-y-0">
               {mathData.steps.map((step, idx) => (
                 <div key={idx} className="flex gap-4 p-4 hover:bg-white/5 rounded-xl transition-colors border-l-2 border-slate-700 hover:border-pink-500/50">
                   <div className="mt-1">
                     <div className="w-6 h-6 rounded-full bg-slate-700 flex items-center justify-center text-xs text-slate-300 font-mono">
                       {idx + 1}
                     </div>
                   </div>
                   <p className="text-slate-300 leading-relaxed font-mono text-sm">{step}</p>
                 </div>
               ))}
             </div>
           </div>
        </div>
      )}
    </div>
  );
};