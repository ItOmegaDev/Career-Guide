import React from 'react';
import { Languages, Compass } from 'lucide-react';
import { Language, TRANSLATIONS } from '../i18n/translations';

export type ActiveTab = 'analytics' | 'scraper' | 'guidance' | 'ml-lab';

interface HeaderProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  vacancyCount: number;
  lang: Language;
  onToggleLanguage: () => void;
}

export const Header: React.FC<HeaderProps> = ({ 
  activeTab, 
  setActiveTab, 
  vacancyCount,
  lang,
  onToggleLanguage
}) => {
  const t = TRANSLATIONS[lang];

  return (
    <header className="border-b border-slate-800/80 bg-slate-950/95 sticky top-0 z-40">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-13">
          
          {/* Minimal Brand */}
          <div className="flex items-center gap-2.5">
            <div className="h-6 w-6 rounded bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-300">
              <Compass className="h-3.5 w-3.5" />
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-sm font-semibold tracking-tight text-white">
                {t.appTitle}
              </span>
              <span className="text-[11px] text-slate-500 hidden sm:inline">
                {t.appSubtitle}
              </span>
            </div>
          </div>

          {/* Desktop Minimal Navigation Tabs */}
          <nav className="hidden md:flex items-center gap-1">
            <button
              onClick={() => setActiveTab('analytics')}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition cursor-pointer ${
                activeTab === 'analytics'
                  ? 'bg-slate-800 text-white'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {t.tabAnalytics}
            </button>

            <button
              onClick={() => setActiveTab('scraper')}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition cursor-pointer ${
                activeTab === 'scraper'
                  ? 'bg-slate-800 text-white'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {t.tabScraper}
            </button>

            <button
              onClick={() => setActiveTab('guidance')}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition cursor-pointer ${
                activeTab === 'guidance'
                  ? 'bg-slate-800 text-white'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {t.tabGuidance}
            </button>

            <button
              onClick={() => setActiveTab('ml-lab')}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition cursor-pointer ${
                activeTab === 'ml-lab'
                  ? 'bg-slate-800 text-white'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {t.tabMlLab}
            </button>
          </nav>

          {/* Right side: Language Switcher & Vacancy Counter */}
          <div className="flex items-center gap-3">
            <button
              onClick={onToggleLanguage}
              className="inline-flex items-center gap-1.5 px-2 py-1 text-[11px] font-medium rounded border border-slate-800 bg-slate-900/80 text-slate-300 hover:text-white hover:border-slate-700 transition cursor-pointer font-mono"
              title={lang === 'uk' ? 'Switch to English' : 'Перемкнути на українську'}
            >
              <Languages className="h-3 w-3 text-slate-400" />
              <span className={lang === 'uk' ? 'font-bold text-white' : 'text-slate-500'}>UA</span>
              <span className="text-slate-700">/</span>
              <span className={lang === 'en' ? 'font-bold text-white' : 'text-slate-500'}>EN</span>
            </button>

            <div className="text-xs text-slate-500 font-mono hidden sm:block">
              <span className="text-slate-300 font-medium">{vacancyCount}</span> {t.vacanciesCount.toLowerCase()}
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        <nav className="flex md:hidden space-x-1 overflow-x-auto pb-2 scrollbar-none border-t border-slate-900 pt-1.5">
          <button
            onClick={() => setActiveTab('analytics')}
            className={`px-2.5 py-1 text-xs font-medium rounded whitespace-nowrap transition cursor-pointer ${
              activeTab === 'analytics' ? 'bg-slate-800 text-white' : 'text-slate-400'
            }`}
          >
            {t.tabAnalytics}
          </button>

          <button
            onClick={() => setActiveTab('scraper')}
            className={`px-2.5 py-1 text-xs font-medium rounded whitespace-nowrap transition cursor-pointer ${
              activeTab === 'scraper' ? 'bg-slate-800 text-white' : 'text-slate-400'
            }`}
          >
            {t.tabScraper}
          </button>

          <button
            onClick={() => setActiveTab('guidance')}
            className={`px-2.5 py-1 text-xs font-medium rounded whitespace-nowrap transition cursor-pointer ${
              activeTab === 'guidance' ? 'bg-slate-800 text-white' : 'text-slate-400'
            }`}
          >
            {t.tabGuidance}
          </button>

          <button
            onClick={() => setActiveTab('ml-lab')}
            className={`px-2.5 py-1 text-xs font-medium rounded whitespace-nowrap transition cursor-pointer ${
              activeTab === 'ml-lab' ? 'bg-slate-800 text-white' : 'text-slate-400'
            }`}
          >
            {t.tabMlLab}
          </button>
        </nav>
      </div>
    </header>
  );
};
