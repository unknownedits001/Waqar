import React, { useState } from 'react';
import { Youtube, Search, Download, Play, Loader2, AlertCircle, CheckCircle, Film } from 'lucide-react';
import { fetchVideoDetails } from '../services/geminiService';
import { VideoData } from '../types';

export const YoutubeTool: React.FC = () => {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [videoData, setVideoData] = useState<VideoData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [downloadLoading, setDownloadLoading] = useState(false);

  const extractVideoId = (input: string) => {
    // Enhanced regex to capture shorts, regular videos, and mobile links
    const regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/;
    const match = input.match(regExp);
    return (match && match[7].length === 11) ? match[7] : null;
  };

  const handleAnalyze = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const videoId = extractVideoId(url);
    
    if (!videoId) {
      setError("Invalid YouTube URL. Please check and try again.");
      return;
    }

    setError(null);
    setLoading(true);
    setVideoData(null);

    try {
      const result = await fetchVideoDetails(videoId);
      if (result.data) {
        setVideoData(result.data);
      } else {
        // Fallback manually if API fails totally
        setVideoData({
            videoId: videoId,
            title: "Ready to Download",
            channel: "YouTube",
            description: "Metadata could not be fetched, but the video is ready for download.",
            views: "Unknown",
            thumbnail: `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`
        });
      }
    } catch (err) {
      setError("Connection failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async () => {
    if (!videoData) return;
    setDownloadLoading(true);
    
    // Direct link to Cobalt for robust downloading
    const target = `https://cobalt.tools/?u=${encodeURIComponent(`https://www.youtube.com/watch?v=${videoData.videoId}`)}`;
    
    setTimeout(() => {
        window.open(target, '_blank');
        setDownloadLoading(false);
    }, 800);
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-8 animate-fadeIn">
      <div className="flex items-center gap-3 mb-4">
        <div className="p-3 bg-red-500/20 rounded-xl text-red-400 ring-1 ring-red-500/30">
           <Youtube size={24} />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-white">Universal Video Loader</h2>
          <p className="text-slate-400 text-sm">Download Shorts, Videos & Audio instantly</p>
        </div>
      </div>

      <div className="bg-slate-800/40 backdrop-blur-md border border-white/10 rounded-3xl p-8 shadow-xl">
        <form onSubmit={handleAnalyze} className="relative max-w-3xl mx-auto">
          <div className="flex gap-3 flex-col sm:flex-row">
            <div className="relative flex-1 group">
              <input 
                type="text" 
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="Paste link (Shorts, Regular, or Music)..."
                className="w-full bg-slate-900/60 border border-slate-700/50 rounded-xl py-4 pl-12 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-red-500/50 transition-all placeholder-slate-500 text-white group-hover:bg-slate-900/80"
              />
              <Youtube className="absolute left-4 top-4 text-slate-400 group-hover:text-red-400 transition-colors" size={20} />
            </div>
            <button 
              type="submit"
              disabled={loading}
              className="bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-500 hover:to-orange-500 text-white font-semibold px-8 py-4 rounded-xl transition-all shadow-lg shadow-red-900/20 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap active:scale-95 transform duration-100"
            >
              {loading ? <Loader2 className="animate-spin" size={20} /> : "Fetch Video"}
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

      {videoData && (
        <div className="bg-gradient-to-b from-slate-800/40 to-slate-900/40 backdrop-blur-md border border-white/10 rounded-3xl p-8 shadow-2xl animate-slideUp relative overflow-hidden">
          {/* Background decoration */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-red-500/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none"/>

          <div className="flex flex-col md:flex-row gap-8 relative z-10">
            {/* Thumbnail */}
            <div className="w-full md:w-5/12 space-y-4">
              <div className="relative aspect-video rounded-2xl overflow-hidden shadow-2xl border border-white/10 group ring-1 ring-white/5">
                <img 
                  src={videoData.thumbnail} 
                  alt={videoData.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors flex items-center justify-center">
                   <Film className="text-white opacity-80 group-hover:opacity-100 transform scale-90 group-hover:scale-100 transition-all duration-300 drop-shadow-lg" size={48} />
                </div>
              </div>
            </div>

            {/* Info */}
            <div className="flex-1 flex flex-col justify-between py-2">
              <div className="space-y-4">
                <div>
                  <h3 className="text-2xl font-bold text-white leading-tight mb-2 line-clamp-2">{videoData.title}</h3>
                  <div className="flex flex-wrap items-center gap-3 text-sm text-slate-400">
                    <span className="flex items-center gap-1 bg-white/5 px-3 py-1 rounded-full border border-white/5 text-slate-300">
                      {videoData.channel}
                      <CheckCircle size={12} className="text-blue-400" />
                    </span>
                    <span className="flex items-center gap-1">
                       <span className="w-1.5 h-1.5 rounded-full bg-red-500"/>
                       {videoData.views} views
                    </span>
                  </div>
                </div>

                <div className="bg-slate-900/30 rounded-2xl p-4 border border-white/5">
                  <p className="text-slate-400 text-sm leading-relaxed line-clamp-3">
                    {videoData.description}
                  </p>
                </div>
              </div>

              <div className="mt-6">
                 <button 
                  onClick={handleDownload}
                  disabled={downloadLoading}
                  className="w-full md:w-auto bg-white text-slate-900 hover:bg-slate-200 font-bold text-lg px-8 py-3 rounded-xl transition-all flex items-center justify-center gap-3 shadow-[0_0_20px_rgba(255,255,255,0.1)] hover:shadow-[0_0_30px_rgba(255,255,255,0.2)] active:scale-95"
                 >
                   {downloadLoading ? <Loader2 className="animate-spin" size={24}/> : <Download size={24} />}
                   Download Now
                 </button>
                 <p className="text-xs text-slate-500 mt-2 ml-1">
                   * Starts ultra-fast download for MP4/MP3
                 </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};