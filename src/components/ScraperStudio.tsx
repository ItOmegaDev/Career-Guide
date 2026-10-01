import React, { useState } from 'react';
import { 
  Play, 
  Check, 
  Copy, 
  Plus, 
  ExternalLink 
} from 'lucide-react';
import { Vacancy, ParseResult } from '../types/job';
import { BEAUTIFUL_SOUP_LESSONS } from '../data/mockVacancies';
import { Language, TRANSLATIONS } from '../i18n/translations';

interface ScraperStudioProps {
  onAddVacancies: (newVacancies: Vacancy[]) => void;
  lang: Language;
}

export const ScraperStudio: React.FC<ScraperStudioProps> = ({ onAddVacancies, lang }) => {
  const t = TRANSLATIONS[lang];
  const [subTab, setSubTab] = useState<'live-parser' | 'bs4-methods' | 'selector-tester' | 'python-code'>('live-parser');
  
  const [selectedPreset, setSelectedPreset] = useState<'work_ua' | 'robota_ua' | 'dou' | 'djinni' | 'custom'>('work_ua');
  const [targetUrl, setTargetUrl] = useState('https://www.work.ua/jobs-kyiv-python/');
  const [customSelector, setCustomSelector] = useState('');
  const [isParsing, setIsParsing] = useState(false);
  const [parseResult, setParseResult] = useState<ParseResult | null>(null);
  const [addedSuccess, setAddedSuccess] = useState(false);

  const [sampleHtml, setSampleHtml] = useState(`<div class="job-list">
  <div class="card job-link" data-id="101">
    <h2 class="title">Junior Python / ML Developer</h2>
    <div class="company">Genesis Tech</div>
    <span class="salary text-emerald">32 000 – 48 000 грн</span>
    <p class="description">Вимоги: Python, BeautifulSoup4, SQL та алгоритми машинного навчання.</p>
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

  const handlePresetSelect = (preset: 'work_ua' | 'robota_ua' | 'dou' | 'djinni' | 'custom') => {
    setSelectedPreset(preset);
    if (preset === 'work_ua') {
      setTargetUrl('https://www.work.ua/jobs-kyiv-python/');
      setCustomSelector('.job-link, .card-hover');
    } else if (preset === 'robota_ua') {
      setTargetUrl('https://robota.ua/zapros/junior-python/ukraine');
      setCustomSelector('alliance-vacancy-card, .card');
    } else if (preset === 'dou') {
      setTargetUrl('https://jobs.dou.ua/vacancies/?category=Python');
      setCustomSelector('.vacancy, .l-vacancy');
    } else if (preset === 'djinni') {
      setTargetUrl('https://djinni.co/jobs/?primary_keyword=Python');
      setCustomSelector('.list-jobs__item');
    }
  };

  const handleRunParser = async () => {
    setIsParsing(true);
    setParseResult(null);
    setAddedSuccess(false);

    try {
      const sourceName = 
        selectedPreset === 'work_ua' ? 'Work.ua' :
        selectedPreset === 'robota_ua' ? 'Robota.ua' :
        selectedPreset === 'dou' ? 'DOU.ua' :
        selectedPreset === 'djinni' ? 'Djinni' : 'Custom Scrape';

      const response = await fetch('/api/parse/scrape-url', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          url: targetUrl,
          source: sourceName,
          customCardSelector: customSelector || undefined
        })
      });

      const data = await response.json();
      setParseResult(data);
    } catch (err) {
      console.error('Error during scraping:', err);
    } finally {
      setIsParsing(false);
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

  return (
    <div className="space-y-6">
      
      {/* Clean Navigation Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
        <div className="flex gap-1.5 overflow-x-auto">
          <button
            onClick={() => setSubTab('live-parser')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
              subTab === 'live-parser'
                ? 'bg-slate-800 text-white'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            {t.liveScraperTab}
          </button>
          <button
            onClick={() => setSubTab('bs4-methods')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
              subTab === 'bs4-methods'
                ? 'bg-slate-800 text-white'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            {t.bs4MethodsTab}
          </button>
          <button
            onClick={() => setSubTab('selector-tester')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
              subTab === 'selector-tester'
                ? 'bg-slate-800 text-white'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            {t.selectorTesterTab}
          </button>
          <button
            onClick={() => setSubTab('python-code')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
              subTab === 'python-code'
                ? 'bg-slate-800 text-white'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            {t.pythonCodeTab}
          </button>
        </div>

        <div className="flex items-center gap-3 text-xs text-slate-500">
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

      {/* Subtab 1: Live Parser */}
      {subTab === 'live-parser' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Controls */}
          <div className="lg:col-span-5 bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4">
            <h3 className="text-sm font-semibold text-white">
              {lang === 'uk' ? 'Параметри збору вакансій' : 'Scraping Configuration'}
            </h3>

            {/* Presets */}
            <div>
              <span className="text-xs text-slate-400 block mb-1.5">{t.sourceLabel}</span>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { id: 'work_ua', label: 'Work.ua' },
                  { id: 'robota_ua', label: 'Robota.ua' },
                  { id: 'dou', label: 'DOU.ua' },
                  { id: 'djinni', label: 'Djinni' }
                ].map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => handlePresetSelect(item.id as 'work_ua' | 'robota_ua' | 'dou' | 'djinni')}
                    className={`py-2 px-3 rounded-lg text-xs font-medium text-left border transition cursor-pointer ${
                      selectedPreset === item.id
                        ? 'bg-slate-800 text-white border-slate-700'
                        : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-slate-200'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs text-slate-400 mb-1">{t.targetUrlLabel}</label>
              <input
                type="text"
                value={targetUrl}
                onChange={(e) => {
                  setTargetUrl(e.target.value);
                  setSelectedPreset('custom');
                }}
                className="w-full px-3 py-1.5 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white focus:outline-none focus:border-slate-700"
              />
            </div>

            <div>
              <label className="block text-xs text-slate-400 mb-1">{t.cssSelectorLabel}</label>
              <input
                type="text"
                value={customSelector}
                onChange={(e) => setCustomSelector(e.target.value)}
                placeholder={t.cssSelectorPlaceholder}
                className="w-full px-3 py-1.5 bg-slate-950 border border-slate-800 rounded-lg text-xs font-mono text-slate-300 focus:outline-none focus:border-slate-700"
              />
            </div>

            <button
              onClick={handleRunParser}
              disabled={isParsing}
              className="w-full py-2.5 px-4 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-xs flex items-center justify-center gap-1.5 transition disabled:opacity-50 cursor-pointer"
            >
              {isParsing ? (
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

          {/* Terminal & Output */}
          <div className="lg:col-span-7 space-y-4">
            
            <div className="bg-slate-950 border border-slate-800 rounded-xl overflow-hidden">
              <div className="bg-slate-900/60 px-3.5 py-2 border-b border-slate-800 flex items-center justify-between text-xs text-slate-500">
                <span>{t.scrapingLogs}</span>
                {parseResult && (
                  <span className="text-slate-400">{parseResult.timeTakenMs} ms</span>
                )}
              </div>

              <div className="p-3.5 font-mono text-xs text-slate-300 space-y-1 max-h-48 overflow-y-auto">
                {isParsing ? (
                  <p className="text-slate-400">{lang === 'uk' ? 'Виконується HTTP запит та аналіз DOM-дерева...' : 'Executing HTTP request and DOM analysis...'}</p>
                ) : parseResult ? (
                  parseResult.logs.map((log, i) => (
                    <p key={i} className="text-slate-400">
                      {log}
                    </p>
                  ))
                ) : (
                  <p className="text-slate-600">{lang === 'uk' ? 'Натисніть «Запустити збір даних» для початку роботи парсера...' : 'Click "Start Data Scraping" to run the parser...'}</p>
                )}
              </div>
            </div>

            {/* Results */}
            {parseResult && parseResult.extractedVacancies.length > 0 && (
              <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-semibold text-white">
                    {t.collectedVacancies} {parseResult.vacanciesFound}
                  </h4>
                  <button
                    onClick={() => {
                      onAddVacancies(parseResult.extractedVacancies as unknown as Vacancy[]);
                      setAddedSuccess(true);
                    }}
                    disabled={addedSuccess}
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium border border-slate-700 transition disabled:opacity-50 cursor-pointer"
                  >
                    <Plus className="h-3.5 w-3.5" />
                    <span>{addedSuccess ? t.addedSuccessBtn : t.addToBaseBtn}</span>
                  </button>
                </div>

                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {parseResult.extractedVacancies.map((vac) => (
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

      {/* Subtab 2: BS4 Methods */}
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

      {/* Subtab 3: CSS Selector Tester */}
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

      {/* Subtab 4: Python Code */}
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
              onClick={() => handleCopyCode(parseResult?.bs4EquivalentCode || BEAUTIFUL_SOUP_LESSONS[1].pythonCode)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-white text-xs font-medium border border-slate-700 transition cursor-pointer"
            >
              {copiedCode ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
              <span>{copiedCode ? t.copiedCodeBtn : t.copyCodeBtn}</span>
            </button>
          </div>

          <pre className="bg-slate-950 p-4 rounded-lg text-xs font-mono text-slate-300 overflow-x-auto border border-slate-800 max-h-96">
            <code>{parseResult?.bs4EquivalentCode || BEAUTIFUL_SOUP_LESSONS[1].pythonCode}</code>
          </pre>
        </div>
      )}

    </div>
  );
};
