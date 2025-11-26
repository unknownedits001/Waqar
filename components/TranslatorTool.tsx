import React, { useState } from 'react';
import { Languages, ArrowRightLeft, Copy, Check, Loader2, Sparkles } from 'lucide-react';
import { translateText } from '../services/geminiService';

export const TranslatorTool: React.FC = () => {
  const [inputText, setInputText] = useState('');
  const [targetLang, setTargetLang] = useState('Spanish');
  const [outputText, setOutputText] = useState('');
  const [detectedLang, setDetectedLang] = useState('');
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const languages = [
    "Spanish", "French", "German", "Italian", "Portuguese", 
    "Chinese (Simplified)", "Japanese", "Korean", "Russian", "Hindi", "Arabic"
  ];

  const handleTranslate = async () => {
    if (!inputText.trim()) return;
    setLoading(true);
    setDetectedLang('');
    
    try {
      const result = await translateText(inputText, targetLang);
      setOutputText(result.translatedText);
      if (result.detectedLanguage) setDetectedLang(result.detectedLanguage);
    } catch (e) {
      setOutputText("Error translating. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(outputText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="w-full max-w-5xl mx-auto space-y-6 animate-fadeIn">
      <div className="flex items-center gap-3 mb-4">
        <div className="p-3 bg-purple-500/20 rounded-xl text-purple-400">
           <Languages size={24} />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-white">Smart Translator</h2>
          <p className="text-slate-400 text-sm">Context-aware translation powered by Gemini</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative">
        
        {/* Arrow for desktop */}
        <div className="hidden md:flex absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10 bg-slate-800 p-2 rounded-full border border-slate-600 text-slate-400 shadow-lg">
          <ArrowRightLeft size={20} />
        </div>

        {/* Input Card */}
        <div className="bg-slate-800/50 backdrop-blur-md border border-white/10 rounded-3xl p-6 shadow-xl flex flex-col h-[400px]">
          <div className="flex justify-between items-center mb-4">
            <span className="text-sm font-medium text-slate-400">
              {detectedLang ? `Detected: ${detectedLang}` : 'Input Text'}
            </span>
          </div>
          <textarea
            className="flex-1 bg-transparent resize-none border-none focus:ring-0 text-lg text-white placeholder-slate-600 p-0"
            placeholder="Type or paste text here..."
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
          />
          <div className="mt-4 flex justify-end">
            <button 
              onClick={handleTranslate}
              disabled={loading || !inputText.trim()}
              className="bg-purple-600 hover:bg-purple-500 text-white px-6 py-2 rounded-xl text-sm font-medium transition-all shadow-lg shadow-purple-900/20 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? <Loader2 className="animate-spin" size={16} /> : <><Sparkles size={16} /> Translate</>}
            </button>
          </div>
        </div>

        {/* Output Card */}
        <div className="bg-slate-900/80 backdrop-blur-md border border-purple-500/20 rounded-3xl p-6 shadow-xl flex flex-col h-[400px]">
          <div className="flex justify-between items-center mb-4">
            <select 
              value={targetLang}
              onChange={(e) => setTargetLang(e.target.value)}
              className="bg-slate-800 border border-slate-700 text-white text-sm rounded-lg focus:ring-purple-500 focus:border-purple-500 block p-2 cursor-pointer"
            >
              {languages.map(lang => (
                <option key={lang} value={lang}>{lang}</option>
              ))}
            </select>
            {outputText && (
              <button 
                onClick={copyToClipboard}
                className="text-slate-400 hover:text-white transition-colors p-2 hover:bg-white/5 rounded-lg"
                title="Copy translation"
              >
                {copied ? <Check size={18} className="text-green-400"/> : <Copy size={18} />}
              </button>
            )}
          </div>
          
          <div className="flex-1 overflow-y-auto">
            {outputText ? (
              <p className="text-lg text-purple-100 whitespace-pre-wrap leading-relaxed">{outputText}</p>
            ) : (
              <div className="h-full flex items-center justify-center text-slate-600 italic">
                Translation will appear here
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};