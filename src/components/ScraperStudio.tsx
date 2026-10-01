import React, { useState } from 'react';
import { 
  Play, 
  Check, 
  Copy, 
  Plus, 
  ExternalLink,
  Layers,
  Globe,
  GitCompare
} from 'lucide-react';
import { Vacancy, ParseResult } from '../types/job';
import { BEAUTIFUL_SOUP_LESSONS } from '../data/mockVacancies';
import { Language, TRANSLATIONS } from '../i18n/translations';
import { VacancyComparisonModal } from './VacancyComparisonModal';

interface ScraperStudioProps {
  onAddVacancies: (newVacancies: Vacancy[]) => void;
  lang: Language;
}

export const ScraperStudio: React.FC<ScraperStudioProps> = ({ onAddVacancies, lang }) => {
  const t = TRANSLATIONS[lang];
  const [subTab, setSubTab] = useState<'batch-parser' | 'single-parser' | 'bs4-methods' | 'selector-tester' | 'python-code'>('batch-parser');
  
  // Multi-site batch scraping options
  const allSources: ('Work.ua' | 'Robota.ua' | 'DOU.ua' | 'Djinni' | 'Jooble.ua')[] = [
    'Work.ua', 'Robota.ua', 'DOU.ua', 'Djinni', 'Jooble.ua'
  ];
  const allProfessions = [
    'Python / AI Developer',
    'Data Analyst',
    'Frontend',
    'Cybersecurity',
    'QA Automation',
    'DevOps',
    'Embedded / Robotics'
  ];

  const [selectedSources, setSelectedSources] = useState<('Work.ua' | 'Robota.ua' | 'DOU.ua' | 'Djinni' | 'Jooble.ua')[]>([
    'Work.ua', 'Robota.ua', 'DOU.ua', 'Djinni'
  ]);
  const [selectedProfessions, setSelectedProfessions] = useState<string[]>([
    'Python / AI Developer',
    'Data Analyst'
  ]);
  const [scrapeDepth, setScrapeDepth] = useState<number>(3);
  const [isBatchParsing, setIsBatchParsing] = useState(false);
  const [batchLogs, setBatchLogs] = useState<string[]>([]);
  const [batchExtractedVacancies, setBatchExtractedVacancies] = useState<Vacancy[]>([]);
  const [perSourceCount, setPerSourceCount] = useState<Record<string, number>>({});
  const [batchAddedSuccess, setBatchAddedSuccess] = useState(false);

  // Single URL Parser State
  const [targetUrl, setTargetUrl] = useState('https://www.work.ua/jobs-kyiv-python/');
  const [singleSource, setSingleSource] = useState('Work.ua');
  const [customSelector, setCustomSelector] = useState('');
  const [isSingleParsing, setIsSingleParsing] = useState(false);
  const [singleResult, setSingleResult] = useState<ParseResult | null>(null);
  const [singleAddedSuccess, setSingleAddedSuccess] = useState(false);

  // Comparison State
  const [selectedForCompareIds, setSelectedForCompareIds] = useState<string[]>([]);
  const [showCompareModal, setShowCompareModal] = useState(false);

  // Selector Tester State
  const [sampleHtml, setSampleHtml] = useState(`<div class="job-list">
  <div class="card job-link" data-id="101">
    <h2 class="title">Junior Python / ML Developer</h2>
    <div class="company">Genesis Tech</div>
    <span class="salary">35 000 – 48 000 грн</span>
    <p class="description">Вимоги: Python, BeautifulSoup4, SQL, PyTorch, робота з даними.</p>
    <div class="skills">
      <span class="badge">Python</span>
      <span class="badge">BS4</span>
      <span class="badge">SQL</span>
    </div>
  </div>
</div>`);
  const [testSelector, setTestSelector] = useState('.card.job-link');
  const [inspectorMatches, setInspectorMatches] = useState<string[]>([]);
  const [copiedCode, setCopiedCode] = useState(false);

  const [batchSearchQuery, setBatchSearchQuery] = useState('');

  // Toggle and bulk helpers
  const handleToggleSource = (src: 'Work.ua' | 'Robota.ua' | 'DOU.ua' | 'Djinni' | 'Jooble.ua') => {
    setSelectedSources(prev => 
      prev.includes(src) ? prev.filter(s => s !== src) : [...prev, src]
    );
  };

  const handleSelectAllSources = () => setSelectedSources([...allSources]);
  const handleClearSources = () => setSelectedSources(['Work.ua']);

  const handleToggleProfession = (prof: string) => {
    setSelectedProfessions(prev =>
      prev.includes(prof) ? prev.filter(p => p !== prof) : [...prev, prof]
    );
  };

  const handleSelectAllProfessions = () => setSelectedProfessions([...allProfessions]);
  const handleClearProfessions = () => setSelectedProfessions(['Python / AI Developer']);

  const handleToggleSelectForCompare = (id: string) => {
    setSelectedForCompareIds(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  // Run Batch Multi-Site Scraping
  const handleRunBatchScrape = async () => {
    if (selectedSources.length === 0 || selectedProfessions.length === 0) return;
    setIsBatchParsing(true);
    setBatchAddedSuccess(false);
    setBatchLogs([
      lang === 'uk' ? 'Ініціалізація багатопотокового підключення до порталів...' : 'Initializing multi-threaded scraping pipeline...'
    ]);

    try {
      const response = await fetch('/api/parse/batch-scrape', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sources: selectedSources,
          professions: selectedProfessions,
          limitPerSource: scrapeDepth
        })
      });

      const data = await response.json();
      if (data.success) {
        setBatchExtractedVacancies(data.extractedVacancies);
        setPerSourceCount(data.perSourceCount || {});
        setBatchLogs(data.logs || []);
      }
    } catch (err) {
      console.error('Batch scrape failed:', err);
    } finally {
      setIsBatchParsing(false);
    }
  };

  // Run Single Scraping
  const handleRunSingleParser = async () => {
    setIsSingleParsing(true);
    setSingleResult(null);
    setSingleAddedSuccess(false);

    try {
      const response = await fetch('/api/parse/scrape-url', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          url: targetUrl,
          source: singleSource,
          customCardSelector: customSelector || undefined
        })
      });

      const data = await response.json();
      setSingleResult(data);
    } catch (err) {
      console.error('Error during scraping:', err);
    } finally {
      setIsSingleParsing(false);
    }
  };

  const handleTestSelector = () => {
    try {
      const parser = new DOMParser();
      const doc = parser.parseFromString(sampleHtml, 'text/html');
      const nodes = doc.querySelectorAll(testSelector);
      const matches: string[] = [];
      nodes.forEach((n, idx) => {
        matches.push(`[${lang === 'uk' ? 'Збіг' : 'Match'} #${idx + 1}]: ${n.textContent?.replace(/\s+/g, ' ').trim()}`);
      });
      setInspectorMatches(matches);
    } catch {
      setInspectorMatches([lang === 'uk' ? 'Помилка синтаксису CSS селектора' : 'CSS selector syntax error']);
    }
  };

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  // Get selected vacancies for comparison
  const vacanciesToCompare = batchExtractedVacancies.filter(v => selectedForCompareIds.includes(v.id));

  return (
    <div className="space-y-6">
      
      {/* Subtabs Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2.5 border-b border-slate-800/70">
        <div className="flex gap-1 overflow-x-auto">
          <button
            onClick={() => setSubTab('batch-parser')}
            className={`px-3 py-1 rounded text-xs font-medium transition cursor-pointer ${
              subTab === 'batch-parser'
                ? 'bg-slate-800 text-white'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
            }`}
          >
            {lang === 'uk' ? 'Масовий парсер' : 'Batch Parser'}
          </button>

          <button
            onClick={() => setSubTab('single-parser')}
            className={`px-3 py-1 rounded text-xs font-medium transition cursor-pointer ${
              subTab === 'single-parser'
                ? 'bg-slate-800 text-white'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
            }`}
          >
            {lang === 'uk' ? 'Парсер URL' : 'Single URL'}
          </button>

          <button
            onClick={() => setSubTab('bs4-methods')}
            className={`px-3 py-1 rounded text-xs font-medium transition cursor-pointer ${
              subTab === 'bs4-methods'
                ? 'bg-slate-800 text-white'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
            }`}
          >
            {t.bs4MethodsTab}
          </button>

          <button
            onClick={() => setSubTab('selector-tester')}
            className={`px-3 py-1 rounded text-xs font-medium transition cursor-pointer ${
              subTab === 'selector-tester'
                ? 'bg-slate-800 text-white'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
            }`}
          >
            {t.selectorTesterTab}
          </button>

          <button
            onClick={() => setSubTab('python-code')}
            className={`px-3 py-1 rounded text-xs font-medium transition cursor-pointer ${
              subTab === 'python-code'
                ? 'bg-slate-800 text-white'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
            }`}
          >
            {t.pythonCodeTab}
          </button>
        </div>

        <div className="flex items-center gap-3 text-xs text-slate-500 font-mono">
          <a 
            href="https://truetech.dev/ua/posts/parsing-saitov-bs4.html" 
            target="_blank" 
            rel="noreferrer"
            className="hover:text-slate-300 transition flex items-center gap-1"
          >
            <span>TrueTech BS4</span>
            <ExternalLink className="h-3 w-3" />
          </a>
        </div>
      </div>

      {/* Subtab 1: BATCH MULTI-SITE SCRAPER */}
      {subTab === 'batch-parser' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Controls: Select Multiple Sites & Multiple Professions */}
          <div className="lg:col-span-5 bg-slate-900/40 border border-slate-800/70 rounded-xl p-4 sm:p-5 space-y-4">
            <div>
              <h3 className="text-sm font-semibold text-white">
                {lang === 'uk' ? 'Багатопотоковий збір даних' : 'Multi-Source Job Aggregator'}
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                {lang === 'uk' 
                  ? 'Оберіть декілька сайтів та спеціальностей для синхронного парсингу'
                  : 'Select multiple portals and roles for concurrent scraping'}
              </p>
            </div>

            {/* Multiple Sites Checkboxes */}
            <div className="space-y-1.5">
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-400 font-medium">
                  {lang === 'uk' ? 'Сайти для парсингу:' : 'Target Portals:'}
                </span>
                <div className="flex items-center gap-2 text-[11px]">
                  <button
                    type="button"
                    onClick={handleSelectAllSources}
                    className="text-indigo-400 hover:text-indigo-300 transition cursor-pointer"
                  >
                    {lang === 'uk' ? 'Всі' : 'All'}
                  </button>
                  <span className="text-slate-700">|</span>
                  <button
                    type="button"
                    onClick={handleClearSources}
                    className="text-slate-500 hover:text-slate-300 transition cursor-pointer"
                  >
                    {lang === 'uk' ? 'Скинути' : 'Reset'}
                  </button>
                  <span className="text-[11px] text-slate-500 font-mono ml-1">
                    {selectedSources.length}/{allSources.length}
                  </span>
                </div>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5">
                {allSources.map(src => {
                  const isChecked = selectedSources.includes(src);
                  return (
                    <button
                      key={src}
                      type="button"
                      onClick={() => handleToggleSource(src)}
                      className={`px-2.5 py-1.5 rounded-lg text-xs font-medium border text-left flex items-center justify-between transition cursor-pointer ${
                        isChecked
                          ? 'bg-slate-800 text-white border-slate-600'
                          : 'bg-slate-950 text-slate-500 border-slate-800 hover:text-slate-300'
                      }`}
                    >
                      <span>{src}</span>
                      {isChecked && <Check className="h-3 w-3 text-emerald-400" />}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Multiple Professions Checkboxes */}
            <div className="space-y-1.5">
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-400 font-medium">
                  {lang === 'uk' ? 'Спеціальності для аналізу:' : 'Target Professions:'}
                </span>
                <div className="flex items-center gap-2 text-[11px]">
                  <button
                    type="button"
                    onClick={handleSelectAllProfessions}
                    className="text-indigo-400 hover:text-indigo-300 transition cursor-pointer"
                  >
                    {lang === 'uk' ? 'Всі' : 'All'}
                  </button>
                  <span className="text-slate-700">|</span>
                  <button
                    type="button"
                    onClick={handleClearProfessions}
                    className="text-slate-500 hover:text-slate-300 transition cursor-pointer"
                  >
                    {lang === 'uk' ? 'Скинути' : 'Reset'}
                  </button>
                  <span className="text-[11px] text-slate-500 font-mono ml-1">
                    {selectedProfessions.length}
                  </span>
                </div>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {allProfessions.map(prof => {
                  const isChecked = selectedProfessions.includes(prof);
                  return (
                    <button
                      key={prof}
                      type="button"
                      onClick={() => handleToggleProfession(prof)}
                      className={`px-2 py-1 rounded text-xs border transition cursor-pointer ${
                        isChecked
                          ? 'bg-indigo-950/70 text-indigo-300 border-indigo-800'
                          : 'bg-slate-950 text-slate-500 border-slate-800 hover:text-slate-300'
                      }`}
                    >
                      {isChecked ? '✓ ' : '+ '}{prof}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Scrape Depth Slider */}
            <div>
              <div className="flex justify-between text-xs text-slate-400 mb-1">
                <span>{lang === 'uk' ? 'Глибина вибірки на пару:' : 'Batch depth per pair:'}</span>
                <span className="text-white font-mono">{scrapeDepth} {lang === 'uk' ? 'вакансій' : 'vacancies'}</span>
              </div>
              <input
                type="range"
                min={2}
                max={5}
                value={scrapeDepth}
                onChange={(e) => setScrapeDepth(Number(e.target.value))}
                className="w-full h-1.5 bg-slate-950 rounded-lg appearance-none cursor-pointer accent-indigo-500"
              />
            </div>

            {/* Run Button */}
            <button
              onClick={handleRunBatchScrape}
              disabled={isBatchParsing || selectedSources.length === 0 || selectedProfessions.length === 0}
              className="w-full py-2.5 px-4 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-xs flex items-center justify-center gap-1.5 transition disabled:opacity-50 cursor-pointer"
            >
              {isBatchParsing ? (
                <>
                  <div className="h-3.5 w-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  <span>{lang === 'uk' ? 'Багатопотоковий збір даних...' : 'Running batch scrape...'}</span>
                </>
              ) : (
                <>
                  <Play className="h-3.5 w-3.5" />
                  <span>{lang === 'uk' ? `Спарсити з ${selectedSources.length} сайтів одночасно` : `Scrape from ${selectedSources.length} portals`}</span>
                </>
              )}
            </button>
          </div>

          {/* Output: Logs & Batch Results Table with Checkbox Selection */}
          <div className="lg:col-span-7 space-y-4">
            
            {/* Terminal logs */}
            <div className="bg-slate-950 border border-slate-800 rounded-xl overflow-hidden">
              <div className="bg-slate-900/60 px-3.5 py-2 border-b border-slate-800 flex items-center justify-between text-xs text-slate-400">
                <span>{lang === 'uk' ? 'Термінал збору даних' : 'Scraping Console Output'}</span>
                {batchExtractedVacancies.length > 0 && (
                  <span className="font-mono text-emerald-400">
                    {batchExtractedVacancies.length} {lang === 'uk' ? 'записів' : 'records'}
                  </span>
                )}
              </div>

              <div className="p-3 font-mono text-xs text-slate-400 space-y-1 max-h-40 overflow-y-auto">
                {isBatchParsing ? (
                  <p className="text-slate-300 animate-pulse">
                    &gt; {lang === 'uk' ? 'Виконуються синхронні HTTP запити до Work.ua, Robota.ua, DOU, Djinni...' : 'Executing concurrent requests across portals...'}
                  </p>
                ) : batchLogs.length > 0 ? (
                  batchLogs.map((log, i) => (
                    <p key={i} className={log.includes('[Завершено]') ? 'text-emerald-400' : 'text-slate-400'}>
                      &gt; {log}
                    </p>
                  ))
                ) : (
                  <p className="text-slate-600">
                    {lang === 'uk' ? 'Оберіть сайти та натисніть запуск для старту збору...' : 'Select portals and launch to view real-time logs...'}
                  </p>
                )}
              </div>
            </div>

            {/* Results List */}
            {batchExtractedVacancies.length > 0 && (
              <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <h4 className="text-xs font-semibold text-white">
                      {lang === 'uk' ? 'Спарсені вакансії' : 'Scraped Vacancies'} ({batchExtractedVacancies.length})
                    </h4>
                    <span className="text-[11px] text-slate-400">
                      {lang === 'uk' ? 'Позначте вакансії прапорцями для порівняння' : 'Select items to compare side-by-side'}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    {selectedForCompareIds.length >= 2 && (
                      <button
                        onClick={() => setShowCompareModal(true)}
                        className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-medium transition cursor-pointer"
                      >
                        <GitCompare className="h-3.5 w-3.5" />
                        <span>{lang === 'uk' ? `Порівняти (${selectedForCompareIds.length})` : `Compare (${selectedForCompareIds.length})`}</span>
                      </button>
                    )}

                    <button
                      onClick={() => {
                        onAddVacancies(batchExtractedVacancies);
                        setBatchAddedSuccess(true);
                      }}
                      disabled={batchAddedSuccess}
                      className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium border border-slate-700 transition disabled:opacity-50 cursor-pointer"
                    >
                      <Plus className="h-3.5 w-3.5" />
                      <span>{batchAddedSuccess ? (lang === 'uk' ? 'Додано до бази' : 'Added') : (lang === 'uk' ? 'Додати всі до бази' : 'Add all to DB')}</span>
                    </button>
                  </div>
                </div>

                {/* Per source count badges */}
                <div className="flex flex-wrap gap-1.5 pb-1 border-b border-slate-800/80 text-[11px]">
                  {Object.entries(perSourceCount).map(([src, cnt]) => (
                    <span key={src} className="px-2 py-0.5 rounded bg-slate-950 border border-slate-800 text-slate-300">
                      {src}: <strong className="text-white">{cnt}</strong>
                    </span>
                  ))}
                </div>

                {/* Quick filter input */}
                <div className="relative">
                  <input
                    type="text"
                    value={batchSearchQuery}
                    onChange={(e) => setBatchSearchQuery(e.target.value)}
                    placeholder={lang === 'uk' ? 'Фільтр за компанією, навичкою чи посадою...' : 'Filter by company, skill, or role...'}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-slate-700"
                  />
                  {batchSearchQuery && (
                    <button
                      onClick={() => setBatchSearchQuery('')}
                      className="absolute right-2.5 top-1.5 text-slate-500 hover:text-white text-xs cursor-pointer"
                    >
                      ×
                    </button>
                  )}
                </div>

                {/* List with Checkbox Selection */}
                <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
                  {batchExtractedVacancies
                    .filter(v => {
                      if (!batchSearchQuery) return true;
                      const q = batchSearchQuery.toLowerCase();
                      return (
                        v.title.toLowerCase().includes(q) ||
                        v.company.toLowerCase().includes(q) ||
                        v.source.toLowerCase().includes(q) ||
                        v.skills.some(s => s.toLowerCase().includes(q))
                      );
                    })
                    .map((vac) => {
                    const isSelected = selectedForCompareIds.includes(vac.id);
                    return (
                      <div 
                        key={vac.id} 
                        className={`p-2.5 rounded-lg border transition flex items-start gap-2.5 ${
                          isSelected 
                            ? 'bg-slate-950 border-indigo-500/60' 
                            : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => handleToggleSelectForCompare(vac.id)}
                          className="mt-1 h-3.5 w-3.5 rounded border-slate-700 bg-slate-900 text-indigo-600 focus:ring-0 cursor-pointer"
                        />
                        <div className="flex-1 space-y-1">
                          <div className="flex justify-between items-baseline">
                            <span className="text-xs font-semibold text-white">{vac.title}</span>
                            <span className="text-[11px] font-mono text-slate-400">
                              {vac.salaryMin ? `${vac.salaryMin.toLocaleString()} – ${vac.salaryMax?.toLocaleString()} ${vac.salaryCurrency}` : ''}
                            </span>
                          </div>
                          <div className="flex justify-between items-baseline text-[11px] text-slate-400">
                            <span>{vac.company} • {vac.source}</span>
                            <span>{vac.city}</span>
                          </div>
                          <div className="flex flex-wrap gap-1 pt-0.5">
                            {vac.skills.slice(0, 4).map((s, idx) => (
                              <span key={idx} className="text-[10px] px-1 py-0.2 rounded bg-slate-900 text-slate-400 border border-slate-800">
                                {s}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

          </div>

        </div>
      )}

      {/* Subtab 2: Single URL Parser */}
      {subTab === 'single-parser' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-5 bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4">
            <h3 className="text-sm font-semibold text-white">
              {lang === 'uk' ? 'Точковий парсинг конкретної сторінки' : 'Single URL Scraper'}
            </h3>

            <div>
              <label className="block text-xs text-slate-400 mb-1">{t.sourceLabel}</label>
              <select
                value={singleSource}
                onChange={(e) => setSingleSource(e.target.value)}
                className="w-full px-3 py-1.5 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white focus:outline-none"
              >
                {allSources.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>

            <div>
              <label className="block text-xs text-slate-400 mb-1">{t.targetUrlLabel}</label>
              <input
                type="text"
                value={targetUrl}
                onChange={(e) => setTargetUrl(e.target.value)}
                className="w-full px-3 py-1.5 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs text-slate-400 mb-1">{t.cssSelectorLabel}</label>
              <input
                type="text"
                value={customSelector}
                onChange={(e) => setCustomSelector(e.target.value)}
                placeholder={t.cssSelectorPlaceholder}
                className="w-full px-3 py-1.5 bg-slate-950 border border-slate-800 rounded-lg text-xs font-mono text-slate-300 focus:outline-none"
              />
            </div>

            <button
              onClick={handleRunSingleParser}
              disabled={isSingleParsing}
              className="w-full py-2.5 px-4 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-xs flex items-center justify-center gap-1.5 transition disabled:opacity-50 cursor-pointer"
            >
              {isSingleParsing ? (
                <>
                  <div className="h-3.5 w-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  <span>{t.scrapingInProgress}</span>
                </>
              ) : (
                <>
                  <Play className="h-3.5 w-3.5" />
                  <span>{t.runScrapingBtn}</span>
                </>
              )}
            </button>
          </div>

          <div className="lg:col-span-7 space-y-4">
            {singleResult && (
              <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-semibold text-white">
                    {t.collectedVacancies} {singleResult.vacanciesFound}
                  </h4>
                  <button
                    onClick={() => {
                      onAddVacancies(singleResult.extractedVacancies as unknown as Vacancy[]);
                      setSingleAddedSuccess(true);
                    }}
                    disabled={singleAddedSuccess}
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium border border-slate-700 transition disabled:opacity-50 cursor-pointer"
                  >
                    <Plus className="h-3.5 w-3.5" />
                    <span>{singleAddedSuccess ? t.addedSuccessBtn : t.addToBaseBtn}</span>
                  </button>
                </div>

                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {singleResult.extractedVacancies.map((vac) => (
                    <div key={vac.id} className="p-2.5 rounded-lg bg-slate-950 border border-slate-800/80 text-xs space-y-1">
                      <div className="flex justify-between items-baseline">
                        <span className="font-medium text-white">{vac.title}</span>
                        <span className="text-slate-400">{vac.company}</span>
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {vac.skills.slice(0, 4).map((s, idx) => (
                          <span key={idx} className="text-[10px] px-1.5 py-0.5 rounded bg-slate-900 text-slate-400 border border-slate-800">
                            {s}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Subtab 3: BS4 Methods */}
      {subTab === 'bs4-methods' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {BEAUTIFUL_SOUP_LESSONS.map((lesson) => (
            <div key={lesson.id} className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-3">
              <div>
                <span className="text-[11px] text-slate-500 font-mono block">{lesson.concept}</span>
                <h4 className="text-sm font-semibold text-white mt-0.5">{lesson.title}</h4>
                <p className="text-xs text-slate-400 mt-1 leading-relaxed">{lesson.summary}</p>
              </div>

              <div className="relative">
                <pre className="bg-slate-950 p-3 rounded-lg text-xs font-mono text-slate-300 overflow-x-auto border border-slate-800">
                  <code>{lesson.pythonCode}</code>
                </pre>
                <button
                  onClick={() => handleCopyCode(lesson.pythonCode)}
                  className="absolute top-2 right-2 p-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-400 transition cursor-pointer"
                  title={t.copyCodeBtn}
                >
                  <Copy className="h-3.5 w-3.5" />
                </button>
              </div>

              <div className="space-y-1 text-xs text-slate-400">
                {lesson.keyPoints.map((kp, idx) => (
                  <p key={idx}>• {kp}</p>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Subtab 4: Selector Tester */}
      {subTab === 'selector-tester' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-2">
            <h4 className="text-xs font-semibold text-white">{t.inputHtmlLabel}</h4>
            <textarea
              rows={10}
              value={sampleHtml}
              onChange={(e) => setSampleHtml(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 font-mono text-xs text-slate-300 focus:outline-none"
            />
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-3">
            <h4 className="text-xs font-semibold text-white">{t.testSelectorLabel}</h4>
            <div className="flex gap-2">
              <input
                type="text"
                value={testSelector}
                onChange={(e) => setTestSelector(e.target.value)}
                className="flex-1 bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-xs font-mono text-white focus:outline-none"
              />
              <button
                onClick={handleTestSelector}
                className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-white text-xs rounded-lg transition cursor-pointer"
              >
                {t.findBtn}
              </button>
            </div>

            <div className="bg-slate-950 border border-slate-800 rounded-lg p-3 max-h-48 overflow-y-auto space-y-1">
              {inspectorMatches.length > 0 ? (
                inspectorMatches.map((m, idx) => (
                  <div key={idx} className="text-xs font-mono text-slate-300">
                    {m}
                  </div>
                ))
              ) : (
                <p className="text-xs text-slate-500 font-mono">{t.noMatches}</p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Subtab 5: Python Code */}
      {subTab === 'python-code' && (
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-semibold text-white">
                {t.pythonScriptTitle}
              </h3>
              <p className="text-xs text-slate-400">
                {t.pythonScriptDesc}
              </p>
            </div>

            <button
              onClick={() => handleCopyCode(singleResult?.bs4EquivalentCode || BEAUTIFUL_SOUP_LESSONS[1].pythonCode)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-white text-xs font-medium border border-slate-700 transition cursor-pointer"
            >
              {copiedCode ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
              <span>{copiedCode ? t.copiedCodeBtn : t.copyCodeBtn}</span>
            </button>
          </div>

          <pre className="bg-slate-950 p-4 rounded-lg text-xs font-mono text-slate-300 overflow-x-auto border border-slate-800 max-h-96">
            <code>{singleResult?.bs4EquivalentCode || BEAUTIFUL_SOUP_LESSONS[1].pythonCode}</code>
          </pre>
        </div>
      )}

      {/* Multi-Vacancy Comparison Modal */}
      {showCompareModal && (
        <VacancyComparisonModal
          vacancies={vacanciesToCompare}
          onClose={() => setShowCompareModal(false)}
          lang={lang}
        />
      )}

    </div>
  );
};
