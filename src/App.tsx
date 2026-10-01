import React, { useState, useEffect } from 'react';
import { Header, ActiveTab } from './components/Header';
import { AnalyticsDashboard } from './components/AnalyticsDashboard';
import { ScraperStudio } from './components/ScraperStudio';
import { StudentGuidance } from './components/StudentGuidance';
import { MLTrendsLab } from './components/MLTrendsLab';
import { INITIAL_VACANCIES } from './data/mockVacancies';
import { Vacancy } from './types/job';
import { Language, TRANSLATIONS } from './i18n/translations';
import { 
  Database, 
  Layers, 
  Sparkles, 
  ExternalLink,
  Code2,
  Server
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function App() {
  // Standard default language set to English (EN) per user request
  const [lang, setLang] = useState<Language>('en');
  const [activeTab, setActiveTab] = useState<ActiveTab>('analytics');
  const [vacancies, setVacancies] = useState<Vacancy[]>(INITIAL_VACANCIES);
  const [selectedGuidanceProfession, setSelectedGuidanceProfession] = useState<string>('Python / AI Developer');

  const t = TRANSLATIONS[lang];

  // Sync with Express backend REST API on component mount
  useEffect(() => {
    fetch('/api/vacancies')
      .then(res => res.json())
      .then(json => {
        if (json.success && Array.isArray(json.data) && json.data.length > 0) {
          setVacancies(prev => {
            const existingIds = new Set(prev.map(v => v.id));
            const newOnes = json.data.filter((v: Vacancy) => !existingIds.has(v.id));
            return [...prev, ...newOnes];
          });
        }
      })
      .catch(err => console.log('REST API vacancies fetch notice:', err));
  }, []);

  const handleToggleLanguage = () => {
    setLang(prev => (prev === 'uk' ? 'en' : 'uk'));
  };

  const handleAddVacancies = async (newVacancies: Vacancy[]) => {
    setVacancies(prev => [...newVacancies, ...prev]);
    try {
      await fetch('/api/vacancies', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newVacancies)
      });
    } catch (e) {
      console.log('Vacancy persistence notice:', e);
    }
  };

  const handleSelectTrackForGuidance = (professionName: string) => {
    setSelectedGuidanceProfession(professionName);
    setActiveTab('guidance');
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-slate-700 selection:text-white">
      {/* Website Top Navbar */}
      <Header 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        vacancyCount={vacancies.length}
        lang={lang}
        onToggleLanguage={handleToggleLanguage}
      />

      {/* Main Website Container */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 py-6 space-y-6">
        
        {/* Minimal Website Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 pb-3 border-b border-slate-800/80">
          <div>
            <h1 className="text-base sm:text-lg font-semibold text-white tracking-tight">
              {t.heroTitle}
            </h1>
            <p className="text-xs text-slate-400 mt-0.5 max-w-2xl leading-relaxed">
              {t.heroSubtitle}
            </p>
          </div>

          <div className="flex items-center gap-3 text-xs text-slate-500 shrink-0 font-mono">
            <span>{vacancies.length} {lang === 'uk' ? 'вакансій' : 'vacancies'}</span>
            <span>•</span>
            <span>Work.ua, DOU, Djinni, Robota</span>
          </div>
        </div>

        {/* Tab Switching with Smooth Motion Animation */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.22, ease: 'easeOut' }}
          >
            {/* Tab 1: Market Analytics & Catalogue */}
            {activeTab === 'analytics' && (
              <AnalyticsDashboard 
                vacancies={vacancies}
                onSelectTrackForGuidance={handleSelectTrackForGuidance}
                lang={lang}
              />
            )}

            {/* Tab 2: Web Scraping & BS4 Studio */}
            {activeTab === 'scraper' && (
              <ScraperStudio 
                onAddVacancies={handleAddVacancies}
                lang={lang}
              />
            )}

            {/* Tab 3: Career Guidance & Student Resume Audit */}
            {activeTab === 'guidance' && (
              <StudentGuidance 
                initialProfession={selectedGuidanceProfession}
                onNavigateToScraper={() => setActiveTab('scraper')}
                lang={lang}
              />
            )}

            {/* Tab 4: Machine Learning & NLP Lab */}
            {activeTab === 'ml-lab' && (
              <MLTrendsLab 
                vacancies={vacancies}
                lang={lang}
              />
            )}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Website Footer */}
      <footer className="border-t border-slate-800/80 bg-slate-950 py-8 mt-12 text-xs text-slate-500">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 space-y-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="space-y-1 text-center sm:text-left">
              <div className="flex items-center justify-center sm:justify-start gap-2">
                <span className="font-semibold text-slate-200">
                  {t.appTitle} — {t.appSubtitle}
                </span>
                <span className="text-[10px] px-1.5 py-0.2 rounded bg-slate-900 border border-slate-800 text-slate-400 font-mono">
                  v2.5
                </span>
              </div>
              <p className="text-slate-400 text-[11px]">
                {t.footerSystemDesc}
              </p>
            </div>

            <div className="flex items-center gap-4 text-slate-400">
              <a 
                href="https://truetech.dev/ua/posts/parsing-saitov-bs4.html" 
                target="_blank" 
                rel="noreferrer"
                className="hover:text-slate-200 transition flex items-center gap-1"
              >
                <span>{t.footerTutorialLink}</span>
                <ExternalLink className="h-3 w-3" />
              </a>

              <button
                onClick={() => setActiveTab('ml-lab')}
                className="hover:text-slate-200 transition cursor-pointer"
              >
                {t.footerMlLink}
              </button>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
