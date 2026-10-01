import React, { useState, useMemo } from 'react';
import { Vacancy } from '../types/job';
import { computeSkillCoOccurrence, extractTopSkills } from '../utils/nlp';
import { CAREER_TRACKS } from '../data/mockVacancies';
import { Language, TRANSLATIONS } from '../i18n/translations';

interface MLTrendsLabProps {
  vacancies: Vacancy[];
  lang: Language;
}

export const MLTrendsLab: React.FC<MLTrendsLabProps> = ({ vacancies, lang }) => {
  const t = TRANSLATIONS[lang];
  const [selectedSkillForGraph, setSelectedSkillForGraph] = useState<string>('Python');
  const [compareProfessionA, setCompareProfessionA] = useState<string>('ai-ml');
  const [compareProfessionB, setCompareProfessionB] = useState<string>('data-analytics');

  const coOccurringSkills = useMemo(() => {
    return computeSkillCoOccurrence(vacancies, selectedSkillForGraph);
  }, [vacancies, selectedSkillForGraph]);

  const topSkillsList = useMemo(() => {
    return extractTopSkills(vacancies).slice(0, 10);
  }, [vacancies]);

  const trackA = CAREER_TRACKS.find(tr => tr.id === compareProfessionA) || CAREER_TRACKS[0];
  const trackB = CAREER_TRACKS.find(tr => tr.id === compareProfessionB) || CAREER_TRACKS[1];

  const sharedSkills = useMemo(() => {
    return trackA.keySkills.filter(s => trackB.keySkills.includes(s));
  }, [trackA, trackB]);

  return (
    <div className="space-y-6">
      
      {/* Clean Header */}
      <div className="space-y-1">
        <h2 className="text-lg font-bold text-white tracking-tight">
          {t.mlLabTitle}
        </h2>
        <p className="text-xs text-slate-400">
          {t.mlLabDesc}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Co-occurrence (7 cols) */}
        <div className="lg:col-span-7 bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-white">
              {t.coOccurrenceTitle}
            </h3>
            
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-500">{t.skillLabel}</span>
              <select
                value={selectedSkillForGraph}
                onChange={(e) => setSelectedSkillForGraph(e.target.value)}
                className="bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1 text-xs text-white focus:outline-none cursor-pointer"
              >
                {topSkillsList.map(s => (
                  <option key={s.name} value={s.name}>{s.name}</option>
                ))}
              </select>
            </div>
          </div>

          <p className="text-xs text-slate-400">
            {t.ifEmployerNeeds} <strong>{selectedSkillForGraph}</strong>, {t.simultaneouslyRequired}
          </p>

          <div className="space-y-2">
            {coOccurringSkills.map((co) => (
              <div key={co.skill} className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-200">{co.skill}</span>
                  <span className="text-slate-400 font-mono">{co.correlation}% {lang === 'uk' ? 'вакансій' : 'jobs'}</span>
                </div>
                <div className="w-full bg-slate-950 h-1.5 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-slate-400 rounded-full"
                    style={{ width: `${co.correlation}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>

          <p className="text-xs text-slate-500 pt-2 border-t border-slate-800/80">
            💡 {t.bundleNote}
          </p>
        </div>

        {/* Pipeline steps (5 cols) */}
        <div className="lg:col-span-5 bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-3">
          <h3 className="text-sm font-semibold text-white">
            {t.pipelineTitle}
          </h3>

          <div className="space-y-2.5 text-xs text-slate-300">
            <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 space-y-0.5">
              <strong className="text-white block">
                {lang === 'uk' ? '1. Парсинг розмітки (BS4)' : '1. Markup Scraping (BS4)'}
              </strong>
              <p className="text-slate-400">
                {lang === 'uk' ? 'Вилучення сирого тексту карток вакансій за CSS-селекторами.' : 'Extracting raw vacancy text using CSS selectors.'}
              </p>
            </div>

            <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 space-y-0.5">
              <strong className="text-white block">
                {lang === 'uk' ? '2. Токенізація та очищення (NLP)' : '2. Tokenization & Cleaning (NLP)'}
              </strong>
              <p className="text-slate-400">
                {lang === 'uk' ? 'Видалення стоп-слів, приведення до нормальної форми.' : 'Stop-word removal and text normalization.'}
              </p>
            </div>

            <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 space-y-0.5">
              <strong className="text-white block">
                {lang === 'uk' ? '3. TF-IDF & N-грами' : '3. TF-IDF & N-grams'}
              </strong>
              <p className="text-slate-400">
                {lang === 'uk' ? 'Розрахунок ваги двослівних термінів («REST API», «Machine Learning»).' : 'Scoring compound technical keywords ("REST API", "Machine Learning").'}
              </p>
            </div>

            <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 space-y-0.5">
              <strong className="text-white block">
                {lang === 'uk' ? '4. Нейромережева оцінка' : '4. Neural Assessment'}
              </strong>
              <p className="text-slate-400">
                {lang === 'uk' ? 'Класифікація затребуваності та рекомендації для школярів.' : 'Demand classification and tailored student recommendations.'}
              </p>
            </div>
          </div>
        </div>

      </div>

      {/* Comparison tool */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <h3 className="text-sm font-semibold text-white">
            {t.compareTitle}
          </h3>

          <div className="flex items-center gap-2">
            <select
              value={compareProfessionA}
              onChange={(e) => setCompareProfessionA(e.target.value)}
              className="bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1 text-xs text-white focus:outline-none cursor-pointer"
            >
              {CAREER_TRACKS.map(tr => (
                <option key={tr.id} value={tr.id}>{tr.title}</option>
              ))}
            </select>

            <span className="text-xs text-slate-500">vs</span>

            <select
              value={compareProfessionB}
              onChange={(e) => setCompareProfessionB(e.target.value)}
              className="bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1 text-xs text-white focus:outline-none cursor-pointer"
            >
              {CAREER_TRACKS.map(tr => (
                <option key={tr.id} value={tr.id}>{tr.title}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div className="p-3.5 rounded-lg bg-slate-950 border border-slate-800 space-y-2">
            <div className="flex justify-between items-baseline">
              <span className="font-semibold text-white">{trackA.title}</span>
              <span className="text-slate-400">{t.demandScore} {trackA.demandScore}%</span>
            </div>
            <p className="text-slate-400">{trackA.description}</p>
            <div className="pt-2 border-t border-slate-800 flex justify-between text-slate-400">
              <span>{t.juniorSalary}</span>
              <span className="text-white font-medium">~{trackA.avgSalary.toLocaleString()} {lang === 'uk' ? 'грн' : 'UAH'}</span>
            </div>
          </div>

          <div className="p-3.5 rounded-lg bg-slate-950 border border-slate-800 space-y-2">
            <div className="flex justify-between items-baseline">
              <span className="font-semibold text-white">{trackB.title}</span>
              <span className="text-slate-400">{t.demandScore} {trackB.demandScore}%</span>
            </div>
            <p className="text-slate-400">{trackB.description}</p>
            <div className="pt-2 border-t border-slate-800 flex justify-between text-slate-400">
              <span>{t.juniorSalary}</span>
              <span className="text-white font-medium">~{trackB.avgSalary.toLocaleString()} {lang === 'uk' ? 'грн' : 'UAH'}</span>
            </div>
          </div>
        </div>

        {sharedSkills.length > 0 && (
          <div className="text-xs text-slate-400 flex items-center gap-2">
            <span className="text-slate-500">{t.sharedFoundation}</span>
            <div className="flex flex-wrap gap-1">
              {sharedSkills.map((s, i) => (
                <span key={i} className="text-slate-300 bg-slate-950 px-1.5 py-0.5 rounded border border-slate-800">
                  {s}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

    </div>
  );
};
