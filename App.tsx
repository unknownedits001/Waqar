import React, { useState } from 'react';
import { Sidebar } from './components/Sidebar';
import { WeatherTool } from './components/WeatherTool';
import { YoutubeTool } from './components/YoutubeTool';
import { TranslatorTool } from './components/TranslatorTool';
import { ChatTool } from './components/ChatTool';
import { ImageTool } from './components/ImageTool';
import { MathTool } from './components/MathTool';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState('weather');

  return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col md:flex-row overflow-hidden relative selection:bg-purple-500/30 font-sans">
      
      {/* Ambient Background Glows */}
      <div className="fixed top-[-20%] left-[-10%] w-[50%] h-[50%] bg-blue-600/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="fixed bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-purple-600/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="fixed top-[40%] left-[40%] w-[30%] h-[30%] bg-pink-600/5 rounded-full blur-[100px] pointer-events-none" />

      {/* Navigation */}
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Main Content Area */}
      <main className="flex-1 h-screen overflow-y-auto overflow-x-hidden relative scroll-smooth pb-20 md:pb-0">
        <div className="p-4 md:p-8 max-w-7xl mx-auto min-h-full">
          
          {/* Header Mobile Only */}
          <div className="md:hidden flex items-center justify-between mb-6 sticky top-0 bg-slate-950/80 backdrop-blur-xl z-40 py-4 px-2 -mx-2 border-b border-white/5">
            <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-200 to-purple-200">
              Gemini OmniTool
            </h1>
          </div>

          <div className="mt-2 md:mt-8 pb-12">
            {activeTab === 'weather' && <WeatherTool />}
            {activeTab === 'youtube' && <YoutubeTool />}
            {activeTab === 'chat' && <ChatTool />}
            {activeTab === 'image' && <ImageTool />}
            {activeTab === 'translate' && <TranslatorTool />}
            {activeTab === 'math' && <MathTool />}
          </div>

        </div>
      </main>
    </div>
  );
};

export default App;