import React, { useState } from 'react';
import { Header } from './components/Header';
import { CategoryShowcase } from './components/CategoryShowcase';
import { AudioStudio } from './components/AudioStudio';
import { WhatsAppSimulator } from './components/WhatsAppSimulator';
import { StorePolicies } from './components/StorePolicies';
import { Sparkles, MessageCircle, Volume2, Image as ImageIcon, ShieldCheck, Heart } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<'categories' | 'audio' | 'simulator' | 'policies'>('categories');
  const [simulatorInitialCategory, setSimulatorInitialCategory] = useState<string | null>(null);

  const handleSelectCategoryForChat = (categoryId: string) => {
    setSimulatorInitialCategory(categoryId);
    setActiveTab('simulator');
  };

  const handleLaunchSimulator = () => {
    setSimulatorInitialCategory(null);
    setActiveTab('simulator');
  };

  return (
    <div className="min-h-screen bg-[#FBF9F5] text-[#2B231D] flex flex-col selection:bg-[#8D5B4C] selection:text-white">
      
      {/* Top Bar Navigation */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onLaunchSimulator={handleLaunchSimulator}
      />

      {/* Main Content Viewport */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        
        {/* Secondary Navigation Pill Bar for Mobile / Quick Access */}
        <div className="md:hidden flex items-center gap-1 overflow-x-auto pb-2 border-b border-[#E8E1D7] text-xs">
          <button
            onClick={() => setActiveTab('categories')}
            className={`px-3 py-1.5 rounded-lg whitespace-nowrap shrink-0 flex items-center gap-1.5 ${
              activeTab === 'categories'
                ? 'bg-[#8D5B4C] text-white font-bold'
                : 'bg-white text-stone-600 border border-[#E8E1D7]'
            }`}
          >
            <ImageIcon className="w-3.5 h-3.5" />
            <span>صور التصنيفات</span>
          </button>

          <button
            onClick={() => setActiveTab('audio')}
            className={`px-3 py-1.5 rounded-lg whitespace-nowrap shrink-0 flex items-center gap-1.5 ${
              activeTab === 'audio'
                ? 'bg-[#8D5B4C] text-white font-bold'
                : 'bg-white text-stone-600 border border-[#E8E1D7]'
            }`}
          >
            <Volume2 className="w-3.5 h-3.5" />
            <span>الأصوات الإرشادية</span>
          </button>

          <button
            onClick={() => setActiveTab('simulator')}
            className={`px-3 py-1.5 rounded-lg whitespace-nowrap shrink-0 flex items-center gap-1.5 ${
              activeTab === 'simulator'
                ? 'bg-[#8D5B4C] text-white font-bold'
                : 'bg-white text-stone-600 border border-[#E8E1D7]'
            }`}
          >
            <MessageCircle className="w-3.5 h-3.5" />
            <span>محاكي واتساب</span>
          </button>

          <button
            onClick={() => setActiveTab('policies')}
            className={`px-3 py-1.5 rounded-lg whitespace-nowrap shrink-0 flex items-center gap-1.5 ${
              activeTab === 'policies'
                ? 'bg-[#8D5B4C] text-white font-bold'
                : 'bg-white text-stone-600 border border-[#E8E1D7]'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>دليل السياسات</span>
          </button>
        </div>

        {/* Tab 1: Categories Photos */}
        {activeTab === 'categories' && (
          <CategoryShowcase onSelectCategoryForChat={handleSelectCategoryForChat} />
        )}

        {/* Tab 2: Audio Studio */}
        {activeTab === 'audio' && (
          <AudioStudio />
        )}

        {/* Tab 3: Interactive WhatsApp Simulator */}
        {activeTab === 'simulator' && (
          <WhatsAppSimulator initialCategoryId={simulatorInitialCategory} />
        )}

        {/* Tab 4: Store Policies & Operational Guide */}
        {activeTab === 'policies' && (
          <StorePolicies />
        )}

      </main>

      {/* Footer */}
      <footer className="border-t border-[#E8E1D7] bg-[#FAF6EF] py-8 mt-12 text-xs text-[#7A7067]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-bold text-[#2B231D]">متجر حجاب مكة</span>
            <span aria-hidden="true">·</span>
            <span>أزياء محتشمة وراقية بالمملكة المغربية</span>
          </div>

          <div className="flex items-center gap-4 text-stone-500">
            <span>التوصيل مجاني لجميع المدن المغربية</span>
            <span aria-hidden="true">·</span>
            <span>الدفع عند الاستلام</span>
            <span aria-hidden="true">·</span>
            <span>مراجعة إدارية مباشرة</span>
          </div>

          <div className="text-[11px] text-stone-400">
            نظام المحتوى والتوجيه الصوتي عبر واتساب © {new Date().getFullYear()}
          </div>
        </div>
      </footer>

    </div>
  );
}
