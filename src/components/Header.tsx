import React from 'react';
import { 
  BarChart2, 
  Terminal, 
  Compass, 
  GitBranch, 
  FileText,
  Languages
} from 'lucide-react';
import { Language, TRANSLATIONS } from '../i18n/translations';

export type ActiveTab = 'analytics' | 'scraper' | 'guidance' | 'ml-lab' | 'dossier';

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
    <header className="border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-md sticky top-0 z-40">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-14">
          
          {/* Minimalist Logo & Title */}
          <div className="flex items-center gap-2.5">
            <div className="h-7 w-7 rounded-lg bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-200">
              <Compass className="h-4 w-4" />
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-sm font-semibold tracking-tight text-white">
                {t.appTitle}
              </span>
              <span className="text-xs text-slate-500 hidden sm:inline">
                / {t.appSubtitle}
              </span>
            </div>
          </div>

          {/* Right side: Language Switcher and Counter */}
          <div className="flex items-center gap-3">
            <button
              onClick={onToggleLanguage}
              className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-md border border-slate-800 bg-slate-900 text-slate-300 hover:text-white hover:border-slate-700 transition cursor-pointer"
              title={lang === 'uk' ? 'Перемкнути на англійську мову' : 'Switch to Ukrainian'}
            >
              <Languages className="h-3.5 w-3.5 text-slate-400" />
              <span>{lang === 'uk' ? 'UA' : 'EN'}</span>
            </button>

            <div className="flex items-center text-xs text-slate-400 border-l border-slate-800 pl-3">
              <span className="text-slate-500 mr-1.5">{t.vacanciesCount}:</span>
              <span className="font-medium text-slate-200">{vacancyCount}</span>
            </div>
          </div>
        </div>

        {/* Minimalist Tab Navigation */}
        <nav className="flex space-x-1 overflow-x-auto pb-2 scrollbar-none">
          <button
            onClick={() => setActiveTab('analytics')}
            className={`flex items-center gap-2 px-3 py-1.5 text-xs font-medium rounded-lg transition-colors whitespace-nowrap ${
              activeTab === 'analytics'
                ? 'bg-slate-800 text-white'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
            }`}
          >
            <BarChart2 className="h-3.5 w-3.5" />
            <span>{t.tabAnalytics}</span>
          </button>

          <button
            onClick={() => setActiveTab('scraper')}
            className={`flex items-center gap-2 px-3 py-1.5 text-xs font-medium rounded-lg transition-colors whitespace-nowrap ${
              activeTab === 'scraper'
                ? 'bg-slate-800 text-white'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
            }`}
          >
            <Terminal className="h-3.5 w-3.5" />
            <span>{t.tabScraper}</span>
          </button>

          <button
            onClick={() => setActiveTab('guidance')}
            className={`flex items-center gap-2 px-3 py-1.5 text-xs font-medium rounded-lg transition-colors whitespace-nowrap ${
              activeTab === 'guidance'
                ? 'bg-slate-800 text-white'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
            }`}
          >
            <Compass className="h-3.5 w-3.5" />
            <span>{t.tabGuidance}</span>
          </button>

          <button
            onClick={() => setActiveTab('ml-lab')}
            className={`flex items-center gap-2 px-3 py-1.5 text-xs font-medium rounded-lg transition-colors whitespace-nowrap ${
              activeTab === 'ml-lab'
                ? 'bg-slate-800 text-white'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
            }`}
          >
            <GitBranch className="h-3.5 w-3.5" />
            <span>{t.tabMlLab}</span>
          </button>

          <button
            onClick={() => setActiveTab('dossier')}
            className={`flex items-center gap-2 px-3 py-1.5 text-xs font-medium rounded-lg transition-colors whitespace-nowrap ${
              activeTab === 'dossier'
                ? 'bg-slate-800 text-white'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
            }`}
          >
            <FileText className="h-3.5 w-3.5" />
            <span>{t.tabDossier}</span>
          </button>
        </nav>
      </div>
    </header>
  );
};
