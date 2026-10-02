import React, { useState, useMemo } from 'react';
import { 
  CheckCircle, 
  RefreshCw,
  ArrowRight,
  Search,
  RotateCcw,
  GitCompare
} from 'lucide-react';
import { Vacancy, ProfessionAnalysis } from '../types/job';
import { extractTopSkills, extractTopSoftSkills, computeAverageSalary } from '../utils/nlp';
import { CAREER_TRACKS } from '../data/mockVacancies';
import { Language, TRANSLATIONS } from '../i18n/translations';
import { VacancyComparisonModal } from './VacancyComparisonModal';
import { motion } from 'motion/react';

interface AnalyticsDashboardProps {
  vacancies: Vacancy[];
  onSelectTrackForGuidance: (professionName: string) => void;
  lang: Language;
}

export const AnalyticsDashboard: React.FC<AnalyticsDashboardProps> = ({ 
  vacancies, 
  onSelectTrackForGuidance,
  lang
}) => {
  const t = TRANSLATIONS[lang];
  const [selectedTrack, setSelectedTrack] = useState<string>('ai-ml');
  const [experienceFilter, setExperienceFilter] = useState<string>('all');
  const [remoteOnly, setRemoteOnly] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isAiAnalyzing, setIsAiAnalyzing] = useState<boolean>(false);
  const [aiAnalysisResult, setAiAnalysisResult] = useState<ProfessionAnalysis | null>(null);

  // Comparison State
  const [selectedForCompareIds, setSelectedForCompareIds] = useState<string[]>([]);
  const [showCompareModal, setShowCompareModal] = useState(false);

  const currentTrackConfig = useMemo(() => {
    return CAREER_TRACKS.find(tr => tr.id === selectedTrack) || CAREER_TRACKS[0];
  }, [selectedTrack]);

  const filteredVacancies = useMemo(() => {
    return vacancies.filter(v => {
      const trackKeywords: Record<string, string[]> = {
        'all': [],
        'sales-track': ['продаж', 'sales', 'клієнт', 'account', 'crm', 'b2b', 'b2c', 'менеджер'],
        'finance-track': ['бухгалтер', 'фінанс', 'облік', '1с', 'bas', 'аудит', 'банк', 'економіст'],
        'logistics-track': ['логіст', 'перевезен', 'склад', 'експедитор', 'lardi', 'cmr', 'ттн', 'wms'],
        'medicine-track': ['фармацевт', 'лікар', 'медич', 'провізор', 'аптек', 'сестра', 'helsi'],
        'marketing-track': ['маркетинг', 'smm', 'дизайн', 'контент', 'tiktok', 'reels', 'таргет', 'реклам', 'креатив'],
        'engineering-track': ['інженер', 'електрик', 'виробництв', 'autocad', 'solidworks', 'чпк', 'монтаж', 'механік'],
        'education-track': ['викладач', 'вчитель', 'репетитор', 'освіт', 'урок', 'нмт', 'педагог'],
        'horeca-track': ['бариста', 'готел', 'рецепшн', 'кухар', 'офіціант', 'horeca', 'кава', 'ресторан'],
        'hr-track': ['hr', 'рекрутер', 'персонал', 'найм', 'hurma', 'recruiter'],
        'ai-ml': ['python', ' ml ', 'machine learning', 'штучний інтелект', 'pandas', ' ai '],
        'frontend': ['frontend', 'react', 'javascript', 'typescript', 'html', 'css', 'веб']
      };

      const keywords = trackKeywords[selectedTrack] || [];
      const titleLower = ` ${v.title.toLowerCase()} `;
      const descLower = ` ${v.description.toLowerCase()} `;
      const industryLower = v.industry ? ` ${v.industry.toLowerCase()} ` : '';
      const skillsLower = v.skills.map(s => s.toLowerCase());

      const matchTrack = selectedTrack === 'all' || 
        (v.industry && currentTrackConfig.title.toLowerCase().includes(v.industry.toLowerCase())) ||
        keywords.some(k => 
          titleLower.includes(k.trim()) || 
          industryLower.includes(k.trim()) ||
          descLower.includes(k.trim()) ||
          skillsLower.some(s => s.includes(k.trim()))
        );

      const matchExp = experienceFilter === 'all' || v.experienceLevel === experienceFilter;
      const matchRemote = !remoteOnly || v.isRemote;
      const matchSearch = !searchQuery || (
        v.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        v.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (v.industry && v.industry.toLowerCase().includes(searchQuery.toLowerCase())) ||
        v.skills.some(s => s.toLowerCase().includes(searchQuery.toLowerCase()))
      );

      return matchTrack && matchExp && matchRemote && matchSearch;
    });
  }, [vacancies, selectedTrack, experienceFilter, remoteOnly, searchQuery, currentTrackConfig]);

  const topHardSkills = useMemo(() => extractTopSkills(filteredVacancies.length > 0 ? filteredVacancies : vacancies), [filteredVacancies, vacancies]);
  const topSoftSkills = useMemo(() => extractTopSoftSkills(filteredVacancies.length > 0 ? filteredVacancies : vacancies), [filteredVacancies, vacancies]);
  const salaryStats = useMemo(() => computeAverageSalary(filteredVacancies.length > 0 ? filteredVacancies : vacancies), [filteredVacancies, vacancies]);

  const remotePercentage = useMemo(() => {
    const list = filteredVacancies.length > 0 ? filteredVacancies : vacancies;
    if (list.length === 0) return 0;
    const remoteCount = list.filter(v => v.isRemote).length;
    return Math.round((remoteCount / list.length) * 100);
  }, [filteredVacancies, vacancies]);

  const traineeRatio = useMemo(() => {
    const list = filteredVacancies.length > 0 ? filteredVacancies : vacancies;
    if (list.length === 0) return 0;
    const count = list.filter(v => v.experienceLevel === 'Trainee/No Exp' || v.experienceLevel === 'Junior').length;
    return Math.round((count / list.length) * 100);
  }, [filteredVacancies, vacancies]);

  const handleResetFilters = () => {
    setExperienceFilter('all');
    setRemoteOnly(false);
    setSearchQuery('');
  };

  const handleToggleSelectForCompare = (id: string) => {
    setSelectedForCompareIds(prev =>
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const vacanciesToCompare = vacancies.filter(v => selectedForCompareIds.includes(v.id));

  const handleRunAiAnalysis = async () => {
    setIsAiAnalyzing(true);
    try {
      const response = await fetch('/api/analyze/market', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          profession: currentTrackConfig.title,
          vacancyCount: filteredVacancies.length,
          lang
        })
      });

      const resData = await response.json();
      if (resData.success && resData.data) {
        setAiAnalysisResult(resData.data);
      }
    } catch (err) {
      console.error('Failed to run AI market analysis:', err);
    } finally {
      setIsAiAnalyzing(false);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Minimal Profession Selector Tabs */}
      <div className="flex gap-1 overflow-x-auto pb-1 scrollbar-none">
        <button
          onClick={() => {
            setSelectedTrack('all');
            setAiAnalysisResult(null);
          }}
          className={`px-3 py-1 rounded text-xs font-medium transition cursor-pointer whitespace-nowrap ${
            selectedTrack === 'all'
              ? 'bg-slate-800 text-white'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
          }`}
        >
          {lang === 'uk' ? 'Усі напрямки' : 'All Roles'}
        </button>

        {CAREER_TRACKS.map((track) => (
          <button
            key={track.id}
            onClick={() => {
              setSelectedTrack(track.id);
              setAiAnalysisResult(null);
            }}
            className={`px-3 py-1 rounded text-xs font-medium transition cursor-pointer whitespace-nowrap ${
              selectedTrack === track.id
                ? 'bg-slate-800 text-white'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
            }`}
          >
            {track.title}
          </button>
        ))}
      </div>

      {/* Clean Verdict Card */}
      <div className="bg-slate-900/40 border border-slate-800/70 rounded-xl p-4 sm:p-5 space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 text-xs font-medium text-emerald-400 bg-emerald-950/30 border border-emerald-800/30 px-2 py-0.5 rounded">
              <CheckCircle className="h-3 w-3" />
              {aiAnalysisResult?.demandStatus || currentTrackConfig.status}
            </span>
            <span className="text-xs text-slate-400">
              {t.demandScoreLabel} <strong className="text-white font-mono">{aiAnalysisResult?.demandScore || currentTrackConfig.demandScore}/100</strong>
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleRunAiAnalysis}
              disabled={isAiAnalyzing}
              className="text-xs text-slate-300 hover:text-white bg-slate-800/80 hover:bg-slate-800 px-2.5 py-1 rounded border border-slate-700/60 transition flex items-center gap-1.5 disabled:opacity-50 cursor-pointer"
            >
              <RefreshCw className={`h-3 w-3 text-slate-400 ${isAiAnalyzing ? 'animate-spin' : ''}`} />
              <span>{isAiAnalyzing ? t.analyzing : t.refreshAnalysis}</span>
            </button>

            <button
              onClick={() => onSelectTrackForGuidance(currentTrackConfig.title)}
              className="text-xs text-white bg-indigo-600 hover:bg-indigo-500 px-3 py-1 rounded transition flex items-center gap-1 cursor-pointer font-medium"
            >
              <span>{t.planForStudent}</span>
              <ArrowRight className="h-3 w-3" />
            </button>
          </div>
        </div>

        <div>
          <h2 className="text-base sm:text-lg font-semibold text-white tracking-tight">
            {t.isProfessionInDemand} «{currentTrackConfig.title}»?
          </h2>
          <p className="text-xs text-slate-300 mt-1 leading-relaxed max-w-4xl">
            {aiAnalysisResult?.verdictSummary || (
              lang === 'uk'
                ? `Професія має стабільно високий попит на ринку праці. За даними зібраних вакансій, роботодавці активно залучають початківців із міцною теоретичною базою та першими практичними проєктами.`
                : `The profession is in consistently high demand. Based on aggregated job openings, employers actively hire junior talent with a solid theoretical foundation and early practical projects.`
            )}
          </p>
        </div>

        {/* School Subjects */}
        <div className="pt-2.5 border-t border-slate-800/60 flex flex-wrap items-center gap-2 text-xs text-slate-400">
          <span className="text-slate-500">{t.schoolSubjectsLabel}</span>
          {currentTrackConfig.schoolSubjects.map((sub, i) => (
            <span key={i} className="text-slate-300 bg-slate-950 px-2 py-0.5 rounded border border-slate-800/80 text-[11px]">
              {sub}
            </span>
          ))}
        </div>
      </div>

      {/* Minimal Metric Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
        <motion.div whileHover={{ y: -1 }} className="bg-slate-900/40 border border-slate-800/70 rounded-lg p-3">
          <span className="text-[11px] text-slate-500 block">{t.avgSalaryJunior}</span>
          <span className="text-base font-semibold text-white mt-0.5 block font-mono">
            ~{salaryStats.avg.toLocaleString()} {salaryStats.avg > 0 ? (lang === 'uk' ? 'грн' : 'UAH') : ''}
          </span>
          <span className="text-[10px] text-slate-400 block mt-0.5 font-mono">
            {salaryStats.min.toLocaleString()} – {salaryStats.max.toLocaleString()} {lang === 'uk' ? 'грн' : 'UAH'}
          </span>
        </motion.div>

        <motion.div whileHover={{ y: -1 }} className="bg-slate-900/40 border border-slate-800/70 rounded-lg p-3">
          <span className="text-[11px] text-slate-500 block">{t.remoteWork}</span>
          <span className="text-base font-semibold text-white mt-0.5 block font-mono">
            {remotePercentage}%
          </span>
          <span className="text-[10px] text-slate-400 block mt-0.5">
            {t.allUkraine}
          </span>
        </motion.div>

        <motion.div whileHover={{ y: -1 }} className="bg-slate-900/40 border border-slate-800/70 rounded-lg p-3">
          <span className="text-[11px] text-slate-500 block">{t.availableForPupils}</span>
          <span className="text-base font-semibold text-white mt-0.5 block font-mono">
            {traineeRatio}%
          </span>
          <span className="text-[10px] text-slate-400 block mt-0.5">
            {t.traineeAndJunior}
          </span>
        </motion.div>

        <motion.div whileHover={{ y: -1 }} className="bg-slate-900/40 border border-slate-800/70 rounded-lg p-3">
          <span className="text-[11px] text-slate-500 block">{t.competition}</span>
          <span className="text-base font-semibold text-white mt-0.5 block">
            {t.competitionLevel}
          </span>
          <span className="text-[10px] text-slate-400 block mt-0.5">
            {lang === 'uk' ? 'сприятливо з портфоліо' : 'favorable with portfolio'}
          </span>
        </motion.div>
      </div>

      {/* Main Grid: Hard Skills & Soft Skills */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Hard Skills */}
        <div className="md:col-span-2 bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-white">
              {t.hardSkillsTitle}
            </h3>
            <span className="text-xs text-slate-500">
              {t.mentionFrequency}
            </span>
          </div>

          <div className="space-y-2.5">
            {topHardSkills.slice(0, 7).map((skill, index) => (
              <div key={skill.name} className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span className="text-slate-500 font-mono text-[11px] w-4">{index + 1}.</span>
                    <span className="text-slate-200 font-medium">{skill.name}</span>
                  </div>
                  <span className="text-slate-400 font-mono">{skill.percentage}%</span>
                </div>
                <div className="w-full bg-slate-950 h-1.5 rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${Math.min(100, Math.max(8, skill.percentage))}%` }}
                    transition={{ duration: 0.6, ease: 'easeOut', delay: index * 0.05 }}
                    className="h-full bg-indigo-500 rounded-full"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Soft Skills & AI Notes */}
        <div className="space-y-4">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-3">
            <h3 className="text-sm font-semibold text-white">
              {t.softSkillsTitle}
            </h3>
            <div className="space-y-2 text-xs">
              {topSoftSkills.slice(0, 5).map((ss) => (
                <div key={ss.name} className="flex justify-between text-slate-300 py-1 border-b border-slate-800/60 last:border-none">
                  <span>{ss.name}</span>
                  <span className="text-slate-500">{ss.percentage}%</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 text-xs text-slate-400 leading-relaxed">
            <strong className="text-slate-200 block mb-1">{t.aiImpactTitle}</strong>
            {aiAnalysisResult?.aiImpactAnalysis || t.aiImpactDefault}
          </div>
        </div>

      </div>

      {/* Filter and Clean Vacancies List with Multi-Selection Checkboxes */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <h3 className="text-sm font-semibold text-white">
              {t.vacanciesTitle} ({filteredVacancies.length})
            </h3>

            {selectedForCompareIds.length >= 2 && (
              <button
                onClick={() => setShowCompareModal(true)}
                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-medium transition cursor-pointer"
              >
                <GitCompare className="h-3.5 w-3.5" />
                <span>{lang === 'uk' ? `Порівняти обрані (${selectedForCompareIds.length})` : `Compare Selected (${selectedForCompareIds.length})`}</span>
              </button>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <div className="relative">
              <Search className="h-3 w-3 text-slate-500 absolute left-2.5 top-2.5" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={t.searchPlaceholder}
                className="pl-7 pr-3 py-1 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white placeholder-slate-500 focus:outline-none focus:border-slate-700 w-44"
              />
            </div>

            <select
              value={experienceFilter}
              onChange={(e) => setExperienceFilter(e.target.value)}
              className="px-2 py-1 bg-slate-950 border border-slate-800 rounded-lg text-xs text-slate-300 focus:outline-none cursor-pointer"
            >
              <option value="all">{t.allLevels}</option>
              <option value="Trainee/No Exp">{t.traineeNoExp}</option>
              <option value="Junior">{t.juniorLevel}</option>
            </select>

            <button
              onClick={() => setRemoteOnly(!remoteOnly)}
              className={`px-2.5 py-1 rounded-lg text-xs border transition cursor-pointer ${
                remoteOnly 
                  ? 'bg-slate-100 text-slate-900 border-slate-100' 
                  : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
              }`}
            >
              {t.remoteBtn}
            </button>
          </div>
        </div>

        {/* Clean list with Selection Checkboxes */}
        {filteredVacancies.length > 0 ? (
          <div className="divide-y divide-slate-800/80 max-h-96 overflow-y-auto">
            {filteredVacancies.map((vac) => {
              const isChecked = selectedForCompareIds.includes(vac.id);
              return (
                <div key={vac.id} className="py-3 first:pt-0 last:pb-0 flex items-start gap-3">
                  <input
                    type="checkbox"
                    checked={isChecked}
                    onChange={() => handleToggleSelectForCompare(vac.id)}
                    className="mt-1 h-3.5 w-3.5 rounded border-slate-700 bg-slate-900 text-indigo-600 focus:ring-0 cursor-pointer"
                    title={lang === 'uk' ? 'Обрати для порівняння' : 'Select to compare'}
                  />
                  <div className="flex-1 space-y-1">
                    <div className="flex items-baseline justify-between gap-2">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h4 className="text-xs font-semibold text-white">{vac.title}</h4>
                        {vac.industry && (
                          <span className="text-[10px] px-1.5 py-0.2 rounded bg-slate-800 text-slate-300 border border-slate-700 font-mono">
                            {vac.industry}
                          </span>
                        )}
                        <span className="text-[11px] text-slate-500 font-mono">{vac.source}</span>
                      </div>
                      <span className="text-xs font-medium text-slate-200 shrink-0">
                        {vac.salaryMin ? `${vac.salaryMin.toLocaleString()} – ${vac.salaryMax?.toLocaleString()} ${vac.salaryCurrency}` : t.salaryNotSpecified}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-xs text-slate-400">
                      <span>{vac.company} • {vac.city}</span>
                      <span className="text-[11px] text-slate-500">{vac.experienceLevel}</span>
                    </div>
                    <div className="flex flex-wrap gap-1 pt-1">
                      {vac.skills.slice(0, 5).map((s, idx) => (
                        <span key={idx} className="text-[10px] px-1.5 py-0.5 rounded bg-slate-950 text-slate-300 border border-slate-800">
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="p-6 text-center text-xs text-slate-400 space-y-2">
            <p>{t.noVacanciesFound}</p>
            <button
              onClick={handleResetFilters}
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs transition cursor-pointer"
            >
              <RotateCcw className="h-3 w-3" />
              <span>{t.resetFilters}</span>
            </button>
          </div>
        )}
      </div>

      {/* Vacancy Comparison Modal */}
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
