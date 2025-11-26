import React, { useState } from 'react';
import { ChefHat, Clock, Flame, Utensils, Loader2, Search } from 'lucide-react';
import { generateRecipe } from '../services/geminiService';
import { RecipeData } from '../types';

export const RecipeTool: React.FC = () => {
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [recipe, setRecipe] = useState<RecipeData | null>(null);

  const handleGenerate = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!input.trim()) return;

    setLoading(true);
    setRecipe(null);
    const res = await generateRecipe(input);
    if (res.data) setRecipe(res.data);
    setLoading(false);
  };

  return (
    <div className="w-full max-w-5xl mx-auto space-y-6 animate-fadeIn">
      <div className="flex items-center gap-3 mb-4">
        <div className="p-3 bg-green-500/20 rounded-xl text-green-400 ring-1 ring-green-500/30">
           <ChefHat size={24} />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-white">AI Master Chef</h2>
          <p className="text-slate-400 text-sm">Turn ingredients into gourmet recipes instantly</p>
        </div>
      </div>

      <div className="bg-slate-800/40 backdrop-blur-md border border-white/10 rounded-3xl p-6 shadow-xl">
        <form onSubmit={handleGenerate} className="flex gap-2">
          <input 
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Enter ingredients (e.g., chicken, basil) or dish name..."
            className="flex-1 bg-slate-900/60 border border-slate-700/50 rounded-xl px-5 py-3 text-white focus:outline-none focus:ring-2 focus:ring-green-500/50 transition-all placeholder-slate-500"
          />
          <button 
            type="submit"
            disabled={loading}
            className="bg-green-600 hover:bg-green-500 text-white px-6 py-3 rounded-xl font-medium transition-all flex items-center gap-2 disabled:opacity-50"
          >
            {loading ? <Loader2 className="animate-spin" size={20} /> : <Utensils size={20} />}
            <span className="hidden sm:inline">Cook</span>
          </button>
        </form>
      </div>

      {recipe && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-slideUp">
          {/* Left: Overview */}
          <div className="md:col-span-1 space-y-4">
            <div className="bg-gradient-to-br from-green-900/40 to-slate-900/40 backdrop-blur-md border border-white/10 rounded-3xl p-6 shadow-xl h-full flex flex-col">
              <h3 className="text-2xl font-bold text-white mb-2 leading-tight">{recipe.title}</h3>
              <p className="text-slate-400 text-sm mb-6 flex-1">{recipe.description}</p>
              
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-slate-950/30 rounded-xl p-3 flex flex-col items-center justify-center text-center border border-white/5">
                  <Clock size={20} className="text-orange-400 mb-1" />
                  <span className="text-xs text-slate-500">Prep Time</span>
                  <span className="font-semibold text-white">{recipe.prepTime}</span>
                </div>
                <div className="bg-slate-950/30 rounded-xl p-3 flex flex-col items-center justify-center text-center border border-white/5">
                  <Flame size={20} className="text-red-400 mb-1" />
                  <span className="text-xs text-slate-500">Energy</span>
                  <span className="font-semibold text-white">{recipe.calories}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Details */}
          <div className="md:col-span-2 space-y-4">
            <div className="bg-slate-800/40 backdrop-blur-md border border-white/10 rounded-3xl p-6 shadow-xl">
              <h4 className="text-sm font-bold text-green-400 uppercase tracking-wider mb-4 flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-green-400"/> Ingredients
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {recipe.ingredients.map((ing, i) => (
                  <div key={i} className="flex items-start gap-3 p-2 hover:bg-white/5 rounded-lg transition-colors">
                    <div className="w-1.5 h-1.5 rounded-full bg-slate-500 mt-2 shrink-0"/>
                    <span className="text-slate-300 text-sm">{ing}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-slate-800/40 backdrop-blur-md border border-white/10 rounded-3xl p-6 shadow-xl">
               <h4 className="text-sm font-bold text-blue-400 uppercase tracking-wider mb-4 flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-blue-400"/> Instructions
              </h4>
               <div className="space-y-4">
                 {recipe.instructions.map((step, i) => (
                   <div key={i} className="flex gap-4">
                     <div className="flex-shrink-0 w-8 h-8 rounded-full bg-slate-700/50 flex items-center justify-center text-white font-bold text-sm border border-white/10">
                       {i + 1}
                     </div>
                     <p className="text-slate-300 text-sm leading-relaxed pt-1.5">{step}</p>
                   </div>
                 ))}
               </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};