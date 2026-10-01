import React, { useState } from 'react';
import { 
  RefreshCw 
} from 'lucide-react';
import { StudentProfile, SkillGapResult } from '../types/job';
import { CAREER_TRACKS } from '../data/mockVacancies';
import { Language, TRANSLATIONS } from '../i18n/translations';

interface StudentGuidanceProps {
  initialProfession?: string;
  onNavigateToScraper: () => void;
  lang: Language;
}

export const StudentGuidance: React.FC<StudentGuidanceProps> = ({ 
  initialProfession = 'Python / AI Developer',
  lang
}) => {
  const t = TRANSLATIONS[lang];

  const defaultSkills = lang === 'uk'
    ? ['Базовий Python (цикли, списки)', 'Англійська (рівень B1)', 'HTML/CSS основи']
    : ['Basic Python (loops, lists)', 'English (B1 level)', 'HTML/CSS basics'];

  const [profile, setProfile] = useState<StudentProfile>({
    name: lang === 'uk' ? 'Олександр' : 'Alex',
    grade: lang === 'uk' ? '10 клас' : 'Grade 10',
    favoriteSubjects: lang === 'uk' ? ['Інформатика', 'Математика', 'Англійська мова'] : ['Computer Science', 'Mathematics', 'English'],
    currentSkills: defaultSkills,
    englishLevel: 'B1 (Intermediate)',
    interests: lang === 'uk' ? ['Штучний інтелект', 'Аналіз даних'] : ['Artificial Intelligence', 'Data Analysis'],
    workPreference: 'remote',
    targetProfession: initialProfession || 'Python / AI Developer'
  });

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [guidanceResult, setGuidanceResult] = useState<SkillGapResult & { encouragementMessage?: string } | null>(null);

  const availableSubjects = lang === 'uk' 
    ? ['Інформатика', 'Математика (Алгебра)', 'Геометрія', 'Фізика', 'Англійська мова', 'Українська мова', 'Економіка', 'Креслення/Дизайн']
    : ['Computer Science', 'Algebra', 'Geometry', 'Physics', 'English', 'Economics', 'Design'];

  const skillsPool = lang === 'uk'
    ? [
        'Базовий Python (цикли, списки)',
        'Англійська (рівень B1)',
        'HTML/CSS основи',
        'Робота з Excel / Google Sheets',
        'Основи баз даних (SQL)',
        'Парсинг даних (BeautifulSoup4)',
        'Git та GitHub',
        'Створення ботів для Telegram',
        'Графічний дизайн у Figma',
        'Основи C / C++'
      ]
    : [
        'Basic Python (loops, lists)',
        'English (B1 level)',
        'HTML/CSS basics',
        'Excel / Google Sheets',
        'Databases & SQL basics',
        'Web Scraping (BeautifulSoup4)',
        'Git & GitHub',
        'Telegram bot scripting',
        'Figma UI Design',
        'C / C++ basics'
      ];

  const handleToggleSubject = (sub: string) => {
    setProfile(prev => ({
      ...prev,
      favoriteSubjects: prev.favoriteSubjects.includes(sub)
        ? prev.favoriteSubjects.filter(s => s !== sub)
        : [...prev.favoriteSubjects, sub]
    }));
  };

  const handleToggleSkill = (sk: string) => {
    setProfile(prev => ({
      ...prev,
      currentSkills: prev.currentSkills.includes(sk)
        ? prev.currentSkills.filter(s => s !== sk)
        : [...prev.currentSkills, sk]
    }));
  };

  const handleGenerateGuidance = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/student/guidance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          studentProfile: profile,
          lang 
        })
      });

      const res = await response.json();
      if (res.success && res.data) {
        setGuidanceResult(res.data);
      }
    } catch (err) {
      console.error('Error generating student roadmap:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const grades = lang === 'uk'
    ? ['8 клас', '9 клас', '10 клас', '11 клас', '1-2 курс']
    : ['Grade 8', 'Grade 9', 'Grade 10', 'Grade 11', 'College'];

  return (
    <div className="space-y-6">
      
      {/* Minimal Header */}
      <div className="space-y-1">
        <h2 className="text-lg font-bold text-white tracking-tight">
          {t.guidanceTitle}
        </h2>
        <p className="text-xs text-slate-400">
          {t.guidanceDesc}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Profile Inputs (5 cols) */}
        <div className="lg:col-span-5 bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4">
          <h3 className="text-sm font-semibold text-white">
            {t.formTitle}
          </h3>

          <div>
            <label className="block text-xs text-slate-400 mb-1">{t.gradeLabel}</label>
            <div className="flex gap-1.5 overflow-x-auto pb-1">
              {grades.map((g) => (
                <button
                  key={g}
                  type="button"
                  onClick={() => setProfile(prev => ({ ...prev, grade: g }))}
                  className={`px-2.5 py-1 rounded-md text-xs font-medium border transition cursor-pointer ${
                    profile.grade === g
                      ? 'bg-slate-100 text-slate-900 border-slate-100'
                      : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-slate-200'
                  }`}
                >
                  {g}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs text-slate-400 mb-1">{t.targetProfessionLabel}</label>
            <select
              value={profile.targetProfession}
              onChange={(e) => setProfile(prev => ({ ...prev, targetProfession: e.target.value }))}
              className="w-full px-3 py-1.5 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white focus:outline-none cursor-pointer"
            >
              {CAREER_TRACKS.map(tr => (
                <option key={tr.id} value={tr.title}>{tr.title}</option>
              ))}
              <option value="Data Analyst">Data Analyst</option>
              <option value="Python Web Scraper & ML">Python Web Scraper & ML</option>
              <option value="Cybersecurity Analyst">{lang === 'uk' ? 'Кібербезпека (SOC)' : 'Cybersecurity Analyst'}</option>
            </select>
          </div>

          <div>
            <label className="block text-xs text-slate-400 mb-1">{t.favSubjectsLabel}</label>
            <div className="flex flex-wrap gap-1">
              {availableSubjects.map((sub) => {
                const isSelected = profile.favoriteSubjects.includes(sub);
                return (
                  <button
                    key={sub}
                    type="button"
                    onClick={() => handleToggleSubject(sub)}
                    className={`px-2 py-0.5 rounded text-xs border transition cursor-pointer ${
                      isSelected
                        ? 'bg-slate-800 text-white border-slate-700'
                        : 'bg-slate-950 text-slate-500 border-slate-800 hover:text-slate-300'
                    }`}
                  >
                    {sub}
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <label className="block text-xs text-slate-400 mb-1">{t.currentSkillsLabel}</label>
            <div className="flex flex-wrap gap-1 max-h-36 overflow-y-auto">
              {skillsPool.map((sk) => {
                const isSelected = profile.currentSkills.includes(sk);
                return (
                  <button
                    key={sk}
                    type="button"
                    onClick={() => handleToggleSkill(sk)}
                    className={`px-2 py-0.5 rounded text-xs border transition cursor-pointer ${
                      isSelected
                        ? 'bg-emerald-950/60 text-emerald-300 border-emerald-800/40'
                        : 'bg-slate-950 text-slate-500 border-slate-800 hover:text-slate-300'
                    }`}
                  >
                    {isSelected ? '✓ ' : '+ '}{sk}
                  </button>
                );
              })}
            </div>
          </div>

          <button
            onClick={handleGenerateGuidance}
            disabled={isLoading}
            className="w-full py-2.5 px-4 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-xs flex items-center justify-center gap-1.5 transition disabled:opacity-50 cursor-pointer"
          >
            {isLoading ? (
              <>
                <RefreshCw className="h-3.5 w-3.5 animate-spin" />
                <span>{t.calculatingBtn}</span>
              </>
            ) : (
              <span>{t.calculateBtn}</span>
            )}
          </button>
        </div>

        {/* Results (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          {guidanceResult ? (
            <>
              {/* Readiness bar */}
              <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-xs text-slate-400">{t.readinessScore}</span>
                    <h4 className="text-lg font-bold text-white">{guidanceResult.matchPercentage}%</h4>
                  </div>
                  <div className="text-right text-xs text-slate-400">
                    <span className="block">{t.estimatedHours}</span>
                    <span className="font-semibold text-slate-200">~{guidanceResult.estimatedStudyHours} {t.hours}</span>
                  </div>
                </div>

                <div className="w-full bg-slate-950 h-2 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-emerald-500 rounded-full transition-all"
                    style={{ width: `${guidanceResult.matchPercentage}%` }}
                  ></div>
                </div>

                {guidanceResult.encouragementMessage && (
                  <p className="text-xs text-slate-300 pt-1 leading-relaxed">
                    {guidanceResult.encouragementMessage}
                  </p>
                )}
              </div>

              {/* Acquired vs Missing */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-2">
                  <span className="text-xs font-semibold text-emerald-400 block">
                    {t.alreadyMatches}
                  </span>
                  <div className="space-y-1">
                    {guidanceResult.acquiredSkills.map((sk, i) => (
                      <div key={i} className="text-xs text-slate-300 py-0.5">
                        • {sk}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-2">
                  <span className="text-xs font-semibold text-amber-400 block">
                    {t.needToLearn}
                  </span>
                  <div className="space-y-1.5">
                    {guidanceResult.missingCriticalSkills.map((sk, i) => (
                      <div key={i} className="text-xs text-slate-300">
                        <span className="font-medium text-white">{sk.name}</span>
                        <p className="text-[11px] text-slate-400">{sk.descriptionUk}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Roadmap */}
              <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-3">
                <h4 className="text-sm font-semibold text-white">
                  {t.stepByStepRoadmap}
                </h4>

                <div className="space-y-3">
                  {guidanceResult.recommendedRoadmap.map((stage, idx) => (
                    <div key={idx} className="border-l-2 border-slate-700 pl-3.5 space-y-1">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-semibold text-white">{stage.stage}</span>
                        <span className="text-slate-500">{stage.duration}</span>
                      </div>
                      <p className="text-xs text-slate-300">{stage.goal}</p>
                      <div className="space-y-0.5 pt-1 text-xs text-slate-400">
                        {stage.milestones.map((m, mIdx) => (
                          <div key={mIdx}>- {m}</div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          ) : (
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-8 text-center text-xs text-slate-400">
              {t.fillFormHint}
            </div>
          )}
        </div>

      </div>

    </div>
  );
};
