import React, { useState } from 'react';
import { Header, ActiveTab } from './components/Header';
import { AnalyticsDashboard } from './components/AnalyticsDashboard';
import { ScraperStudio } from './components/ScraperStudio';
import { StudentGuidance } from './components/StudentGuidance';
import { MLTrendsLab } from './components/MLTrendsLab';
import { ReportDossier } from './components/ReportDossier';
import { INITIAL_VACANCIES } from './data/mockVacancies';
import { Vacancy } from './types/job';
import { Language, TRANSLATIONS } from './i18n/translations';
import { ExternalLink } from 'lucide-react';

export default function App() {
  const [lang, setLang] = useState<Language>('uk');
  const [activeTab, setActiveTab] = useState<ActiveTab>('analytics');
  const [vacancies, setVacancies] = useState<Vacancy[]>(INITIAL_VACANCIES);
  const [selectedGuidanceProfession, setSelectedGuidanceProfession] = useState<string>('Python / AI Developer');

  const t = TRANSLATIONS[lang];

  const handleToggleLanguage = () => {
    setLang(prev => (prev === 'uk' ? 'en' : 'uk'));
  };

  const handleAddVacancies = (newVacancies: Vacancy[]) => {
    setVacancies(prev => [...newVacancies, ...prev]);
  };

  const handleSelectTrackForGuidance = (professionName: string) => {
    setSelectedGuidanceProfession(professionName);
    setActiveTab('guidance');
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-slate-700 selection:text-white">
      {/* Navigation Header */}
      <Header 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        vacancyCount={vacancies.length}
        lang={lang}
        onToggleLanguage={handleToggleLanguage}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 py-6">
        {activeTab === 'analytics' && (
          <AnalyticsDashboard 
            vacancies={vacancies}
            onSelectTrackForGuidance={handleSelectTrackForGuidance}
            lang={lang}
          />
        )}

        {activeTab === 'scraper' && (
          <ScraperStudio 
            onAddVacancies={handleAddVacancies}
            lang={lang}
          />
        )}

        {activeTab === 'guidance' && (
          <StudentGuidance 
            initialProfession={selectedGuidanceProfession}
            onNavigateToScraper={() => setActiveTab('scraper')}
            lang={lang}
          />
        )}

        {activeTab === 'ml-lab' && (
          <MLTrendsLab 
            vacancies={vacancies}
            lang={lang}
          />
        )}

        {activeTab === 'dossier' && (
          <ReportDossier 
            vacancies={vacancies}
            lang={lang}
          />
        )}
      </main>

      {/* Minimal Footer (hidden in print) */}
      <footer className="print:hidden border-t border-slate-800/60 py-6 mt-12 text-xs text-slate-500">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p>
            {t.footerSystemDesc}
          </p>

          <div className="flex items-center gap-4">
            <a 
              href="https://truetech.dev/ua/posts/parsing-saitov-bs4.html" 
              target="_blank" 
              rel="noreferrer"
              className="hover:text-slate-300 transition flex items-center gap-1"
            >
              <span>{t.footerTutorialLink}</span>
              <ExternalLink className="h-3 w-3" />
            </a>
            <a 
              href="https://habr.com/ru/articles/986284/" 
              target="_blank" 
              rel="noreferrer"
              className="hover:text-slate-300 transition flex items-center gap-1"
            >
              <span>{t.footerMlLink}</span>
              <ExternalLink className="h-3 w-3" />
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
