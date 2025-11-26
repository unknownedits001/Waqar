import React from 'react';
import { CloudRain, Youtube, Languages, Command, MessageSquare, Calculator, Image as ImageIcon } from 'lucide-react';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab }) => {
  const menuItems = [
    { id: 'weather', icon: CloudRain, label: 'Weather' },
    { id: 'youtube', icon: Youtube, label: 'Downloader' },
    { id: 'chat', icon: MessageSquare, label: 'Gemini Chat' },
    { id: 'image', icon: ImageIcon, label: 'Imagine' },
    { id: 'translate', icon: Languages, label: 'Translator' },
    { id: 'math', icon: Calculator, label: 'Math Genius' },
  ];

  return (
    <div className="fixed md:static bottom-0 left-0 w-full md:w-24 md:h-screen bg-slate-900/90 md:bg-slate-900/50 backdrop-blur-xl border-t md:border-r border-white/10 z-50 flex md:flex-col items-center justify-between md:justify-start py-2 md:py-8 px-6 md:px-0 transition-all">
      
      {/* Logo Area */}
      <div className="hidden md:flex flex-col items-center mb-12">
        <div className="w-12 h-12 bg-gradient-to-tr from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg shadow-purple-500/20 ring-1 ring-white/10 group cursor-pointer hover:scale-105 transition-transform">
          <Command className="text-white group-hover:rotate-12 transition-transform duration-500" size={24} />
        </div>
      </div>

      {/* Nav Items */}
      <div className="flex md:flex-col w-full justify-around md:justify-start gap-1 md:gap-4">
        {menuItems.map((item) => {
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`
                group relative flex flex-col md:flex-row items-center justify-center md:w-16 md:h-16 rounded-2xl transition-all duration-300
                ${isActive 
                  ? 'text-white bg-white/10 shadow-[0_0_20px_rgba(255,255,255,0.1)]' 
                  : 'text-slate-500 hover:text-slate-200 hover:bg-white/5'}
              `}
            >
              <item.icon 
                size={22} 
                className={`mb-1 md:mb-0 transition-all duration-300 ${isActive ? 'scale-110 text-blue-400' : 'group-hover:scale-110'}`} 
              />
              <span className="text-[10px] md:hidden font-medium">{item.label}</span>
              
              {/* Tooltip for desktop */}
              <div className="hidden md:block absolute left-full ml-4 px-3 py-1.5 bg-slate-800 text-white text-xs font-medium rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-200 translate-x-2 group-hover:translate-x-0 pointer-events-none whitespace-nowrap border border-white/10 z-50 shadow-xl">
                {item.label}
              </div>
              
              {/* Active Indicator Line */}
              {isActive && (
                <div className="absolute top-0 left-0 w-full h-0.5 md:w-1 md:h-full bg-gradient-to-r md:bg-gradient-to-b from-blue-400 to-purple-400 rounded-full shadow-[0_0_10px_rgba(59,130,246,0.5)]" />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};