import React from 'react';
import { Sparkles, MessageCircle, Volume2, Image as ImageIcon, ShieldCheck } from 'lucide-react';

interface HeaderProps {
  activeTab: 'categories' | 'audio' | 'simulator' | 'policies';
  setActiveTab: (tab: 'categories' | 'audio' | 'simulator' | 'policies') => void;
  onLaunchSimulator: () => void;
}

export const Header: React.FC<HeaderProps> = ({ activeTab, setActiveTab, onLaunchSimulator }) => {
  return (
    <header className="sticky top-0 z-40 bg-[#FBF9F5]/95 backdrop-blur-md border-b border-[#E8E1D7] transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-8 h-18">
          
          {/* Zone 1: Brand title, one line */}
          <div className="flex items-center gap-3 shrink-0">
            <div className="w-10 h-10 rounded-full bg-[#8D5B4C] text-[#FBF9F5] flex items-center justify-center font-bold text-lg shadow-sm">
              ح
            </div>
            <div>
              <span className="text-xl font-bold tracking-tight text-[#2B231D] whitespace-nowrap block leading-tight">
                حِجاب مكة
              </span>
              <span className="text-[11px] text-[#8D5B4C] font-medium block">
                المغرب · إدارة المحتوى والتجربة
              </span>
            </div>
          </div>

          {/* Zone 2: 4 clean single-line navigation links */}
          <nav className="hidden md:flex items-center gap-1 sm:gap-2 text-sm font-medium">
            <button
              onClick={() => setActiveTab('categories')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-lg transition-colors whitespace-nowrap shrink-0 ${
                activeTab === 'categories'
                  ? 'bg-[#EFE8DD] text-[#2B231D] font-semibold'
                  : 'text-[#6D635B] hover:text-[#2B231D] hover:bg-[#F3EDE3]'
              }`}
            >
              <ImageIcon className="w-4 h-4 text-[#8D5B4C]" />
              <span>صور التصنيفات</span>
            </button>

            <button
              onClick={() => setActiveTab('audio')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-lg transition-colors whitespace-nowrap shrink-0 ${
                activeTab === 'audio'
                  ? 'bg-[#EFE8DD] text-[#2B231D] font-semibold'
                  : 'text-[#6D635B] hover:text-[#2B231D] hover:bg-[#F3EDE3]'
              }`}
            >
              <Volume2 className="w-4 h-4 text-[#8D5B4C]" />
              <span>الأصوات الإرشادية</span>
            </button>

            <button
              onClick={() => setActiveTab('simulator')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-lg transition-colors whitespace-nowrap shrink-0 ${
                activeTab === 'simulator'
                  ? 'bg-[#EFE8DD] text-[#2B231D] font-semibold'
                  : 'text-[#6D635B] hover:text-[#2B231D] hover:bg-[#F3EDE3]'
              }`}
            >
              <MessageCircle className="w-4 h-4 text-[#25D366]" />
              <span>محاكي واتساب (10 خطوات)</span>
            </button>

            <button
              onClick={() => setActiveTab('policies')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-lg transition-colors whitespace-nowrap shrink-0 ${
                activeTab === 'policies'
                  ? 'bg-[#EFE8DD] text-[#2B231D] font-semibold'
                  : 'text-[#6D635B] hover:text-[#2B231D] hover:bg-[#F3EDE3]'
              }`}
            >
              <ShieldCheck className="w-4 h-4 text-[#8D5B4C]" />
              <span>دليل الإدارة والتوصيل</span>
            </button>
          </nav>

          {/* Zone 3: 1 primary action */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={onLaunchSimulator}
              className="flex items-center gap-2 px-4 py-2 text-xs sm:text-sm font-semibold text-white bg-[#8D5B4C] hover:bg-[#784A3D] rounded-lg transition-all shadow-sm active:scale-95 whitespace-nowrap shrink-0"
            >
              <Sparkles className="w-4 h-4" />
              <span>تجربة مسار الشراء</span>
            </button>
          </div>

        </div>
      </div>
    </header>
  );
};
