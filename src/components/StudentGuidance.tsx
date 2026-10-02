import React, { useState } from 'react';
import { 
  RefreshCw, 
  FileText, 
  ShieldAlert, 
  CheckCircle, 
  AlertCircle, 
  GraduationCap, 
  ExternalLink,
  Award,
  BookOpen,
  Clock,
  ArrowRight,
  Sparkles,
  Plus,
  Trash2
} from 'lucide-react';
import { StudentProfile, ResumeAuditResult } from '../types/job';
import { Language, TRANSLATIONS } from '../i18n/translations';
import confetti from 'canvas-confetti';
import { motion } from 'motion/react';

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

  const availableProfessions = [
    'Менеджер з продажу (B2B/B2C)',
    'Асистент бухгалтера / Економіст',
    'Менеджер з логістики',
    'SMM-менеджер / Контент-креатор',
    'Фармацевт / Асистент лікаря',
    'Інженер-конструктор (AutoCAD)',
    'Викладач / Онлайн-репетитор',
    'Бариста / Сервіс (HoReCa)',
    'Python / AI Developer',
    'Data Analyst',
    'Frontend Developer'
  ];

  // Pre-made realistic student CV profiles across different industries for 1-click testing
  const CV_PRESETS = [
    {
      id: 'sales-preset',
      labelUk: '💼 Продажі / B2B Sales',
      labelEn: '💼 Sales & Account Management',
      profile: {
        name: lang === 'uk' ? 'Максим Бондаренко' : 'Maksym Bondarenko',
        age: 17,
        grade: lang === 'uk' ? '11 клас' : '11th Grade',
        schoolName: lang === 'uk' ? 'Київська гімназія №178' : 'Kyiv Gymnasium #178',
        favoriteSubjects: lang === 'uk' ? ['Українська мова', 'Англійська мова', 'Економіка'] : ['Ukrainian', 'English', 'Economics'],
        currentSkills: ['Ділові переговори', 'CRM (Bitrix24)', 'Робота з запереченнями', 'Презентація продукту', 'Excel / Таблиці', 'Грамотна мова'],
        englishLevel: 'B1 (Intermediate)',
        interests: lang === 'uk' ? ['B2B продажі', 'Клієнтський сервіс', 'Маркетплейси'] : ['B2B Sales', 'Client Relations', 'E-commerce'],
        workPreference: 'office' as const,
        targetProfessions: ['Менеджер з продажу (B2B/B2C)'],
        resumeText: lang === 'uk'
          ? `Максим Бондаренко, 17 років. Учень випускного 11 класу.
Навички: вільне ведення телефонних переговорів, знання базових воронок продажів у CRM, підготовка презентацій у Canva та розрахунків у Google Sheets.
Досвід:
1. Консультування клієнтів в інтернет-магазині молодіжного одягу (Instagram Direct / чат).
2. Організатор шкільного ярмарку благодійного збору для ЗСУ (зібрано понад 45 000 грн).`
          : `Maksym Bondarenko, 17 years old. 11th-grade student.
Skills: confident phone negotiations, CRM sales pipelines, presentation design in Canva, commercial calculations in Google Sheets.
Experience:
1. Customer support and direct sales for Instagram apparel store.
2. Chief organizer of school charity fair for Ukrainian defenders (raised over 45,000 UAH).`,
        githubUrl: '',
        olympiadAchievements: lang === 'uk' ? 'Призер міського турніру юних економістів' : 'Prize winner in City Young Economists Tournament'
      }
    },
    {
      id: 'finance-preset',
      labelUk: '📈 Фінанси та Бухгалтерія',
      labelEn: '📈 Finance & Accounting Trainee',
      profile: {
        name: lang === 'uk' ? 'Олена Кравчук' : 'Olena Kravchuk',
        age: 17,
        grade: lang === 'uk' ? '11 клас' : '11th Grade',
        schoolName: lang === 'uk' ? 'Київський економічний ліцей' : 'Kyiv Economics Lyceum',
        favoriteSubjects: lang === 'uk' ? ['Алгебра', 'Економіка', 'Правознавство'] : ['Algebra', 'Economics', 'Law'],
        currentSkills: ['1С / BAS Бухгалтерія', 'Excel (ВПР, зведені таблиці)', 'Первинна документація', 'Фінансовий аналіз'],
        englishLevel: 'B1 (Intermediate)',
        interests: lang === 'uk' ? ['Бухгалтерський облік', 'Банкінг', 'Податки'] : ['Accounting', 'Banking', 'Taxation'],
        workPreference: 'remote' as const,
        targetProfessions: ['Асистент бухгалтера / Економіст'],
        resumeText: lang === 'uk'
          ? `Олена Кравчук, 17 років. Учениця 11 класу економічного профілю.
Навички: робота в системі 1С:Підприємство, оформлення видаткових накладних та рахунків, складні формули в Excel (VLOOKUP, INDEX/MATCH).
Досягнення: Дослідницька робота МАН з аналізу фінансових показників малого бізнесу в умовах воєнного стану.`
          : `Olena Kravchuk, 17 years old. 11th-grade economics student.
Skills: basic 1C/BAS enterprise software, invoice processing, advanced formulas in Excel (VLOOKUP, Pivot Tables).
Achievements: JAS research paper on small business financial sustainability.`,
        githubUrl: '',
        olympiadAchievements: lang === 'uk' ? 'Переможець обласної олімпіади з економіки' : 'Winner of Regional Economics Olympiad'
      }
    },
    {
      id: 'python-ai',
      labelUk: '🐍 Python / AI Trainee',
      labelEn: '🐍 Python / AI Trainee',
      profile: {
        name: lang === 'uk' ? 'Олександр Коваленко' : 'Alex Kovalenko',
        age: 16,
        grade: lang === 'uk' ? '10 клас' : '10th Grade',
        schoolName: lang === 'uk' ? 'Київський природничо-науковий ліцей №145' : 'Kyiv Science Lyceum #145',
        favoriteSubjects: lang === 'uk' ? ['Інформатика', 'Алгебра', 'Англійська мова'] : ['Computer Science', 'Algebra', 'English'],
        currentSkills: ['Python 3', 'BeautifulSoup4 (парсинг)', 'SQL (PostgreSQL)', 'Git / GitHub', 'Pandas'],
        englishLevel: 'B1 (Intermediate)',
        interests: lang === 'uk' ? ['Штучний інтелект', 'Аналітика даних', 'Веб-парсинг'] : ['AI', 'Data Analysis', 'Web Scraping'],
        workPreference: 'remote' as const,
        targetProfessions: ['Python / AI Developer', 'Data Analyst'],
        resumeText: lang === 'uk'
          ? `Олександр Коваленко, 16 років. Учень 10 класу ліцею.
Навички: Python 3, парсинг HTML з BeautifulSoup4/requests, базовий SQL (SELECT, JOIN), Git/GitHub.
Проєкти:
1. Парсер вакансій з Work.ua та DOU на Python + BeautifulSoup з вивантаженням у CSV.
2. Телеграм-бот для шкільного розкладу з інтеграцією Google Sheets API.
Учасник ІІ етапу Всеукраїнської олімпіади з інформатики та конкурсу-захисту наукових робіт МАН України.`
          : `Alex Kovalenko, 16 years old. 10th-grade lyceum student.
Skills: Python 3, HTML scraping with BeautifulSoup4/requests, basic SQL (SELECT, JOIN), Git/GitHub.
Projects:
1. Job market scraper for Work.ua and DOU using Python + BeautifulSoup with CSV export.
2. Telegram bot for school class schedules with Google Sheets API integration.
Participant in the National Informatics Olympiad and Junior Academy of Sciences research.`,
        githubUrl: 'https://github.com/alex-kovalenko-dev',
        olympiadAchievements: lang === 'uk' ? 'Призер ІІ етапу Всеукраїнської олімпіади з інформатики, секція МАН' : 'Prize winner in National Informatics Olympiad, JAS section'
      }
    }
  ];

  // Full pupil profile state
  const [profile, setProfile] = useState<StudentProfile>(CV_PRESETS[0].profile);
  const [newSkillInput, setNewSkillInput] = useState('');
  const [isAuditing, setIsAuditing] = useState(false);
  const [auditResult, setAuditResult] = useState<ResumeAuditResult | null>(null);

  const handleApplyPreset = (presetProfile: StudentProfile) => {
    setProfile(presetProfile);
    setAuditResult(null);
  };

  const handleToggleProfession = (prof: string) => {
    setProfile(prev => {
      const current = prev.targetProfessions || [];
      const updated = current.includes(prof)
        ? current.filter(p => p !== prof)
        : [...current, prof];
      return {
        ...prev,
        targetProfessions: updated.length > 0 ? updated : [prof]
      };
    });
  };

  const handleSelectAllProfessions = () => {
    setProfile(prev => ({
      ...prev,
      targetProfessions: [...availableProfessions]
    }));
  };

  const handleClearProfessions = () => {
    setProfile(prev => ({
      ...prev,
      targetProfessions: ['Python / AI Developer']
    }));
  };

  const handleAddSkill = () => {
    if (!newSkillInput.trim()) return;
    if (!profile.currentSkills.includes(newSkillInput.trim())) {
      setProfile(prev => ({
        ...prev,
        currentSkills: [...prev.currentSkills, newSkillInput.trim()]
      }));
    }
    setNewSkillInput('');
  };

  const handleRemoveSkill = (skillToRemove: string) => {
    setProfile(prev => ({
      ...prev,
      currentSkills: prev.currentSkills.filter(s => s !== skillToRemove)
    }));
  };

  const handleRunResumeAudit = async () => {
    setIsAuditing(true);
    try {
      const response = await fetch('/api/student/audit-resume', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          profile,
          lang
        })
      });

      const res = await response.json();
      if (res.success && res.data) {
        setAuditResult(res.data);
        confetti({
          particleCount: 50,
          spread: 60,
          origin: { y: 0.6 }
        });
      }
    } catch (err) {
      console.error('Failed to run resume audit:', err);
    } finally {
      setIsAuditing(false);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Header with Quick Presets */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="space-y-1">
          <h2 className="text-lg font-bold text-white tracking-tight">
            {lang === 'uk' ? 'Комплексна профорієнтація та аудит учнівського резюме (МАН)' : 'Comprehensive Career Guidance & Student CV Audit'}
          </h2>
          <p className="text-xs text-slate-400">
            {lang === 'uk' 
              ? 'Зіставлення резюме з вимогами роботодавців, правові норми працевлаштування молоді (КЗпП України) та дорожня карта навчання'
              : 'Matching student CV against live market demands, youth labor legal compliance, and multi-track readiness scoring'}
          </p>
        </div>

        {/* Quick Presets Bar */}
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="text-[11px] text-slate-500 mr-1 font-mono">
            {lang === 'uk' ? 'Зразки:' : 'Presets:'}
          </span>
          {CV_PRESETS.map(preset => (
            <button
              key={preset.id}
              onClick={() => handleApplyPreset(preset.profile)}
              className="px-2 py-0.5 rounded text-[11px] font-medium bg-slate-800/60 hover:bg-slate-800 text-slate-300 border border-slate-700/50 transition cursor-pointer"
            >
              {lang === 'uk' ? preset.labelUk : preset.labelEn}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Form: Student Age, Profile, Professions, and CV Textarea (5 cols) */}
        <div className="lg:col-span-5 bg-slate-900/40 border border-slate-800/70 rounded-xl p-4 sm:p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800/60 pb-2">
            <h3 className="text-xs font-semibold text-white uppercase tracking-wider">
              {lang === 'uk' ? 'Анкета та резюме' : 'Candidate & CV'}
            </h3>
            <span className="text-[11px] font-mono text-slate-500">
              {profile.age} {lang === 'uk' ? 'років' : 'y.o.'}
            </span>
          </div>

          {/* Full Name & Age */}
          <div className="grid grid-cols-3 gap-2">
            <div className="col-span-2">
              <label className="block text-[11px] text-slate-400 mb-1">
                {lang === 'uk' ? 'ПІБ учня:' : 'Student Name:'}
              </label>
              <input
                type="text"
                value={profile.name}
                onChange={(e) => setProfile(prev => ({ ...prev, name: e.target.value }))}
                className="w-full px-2.5 py-1.5 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-[11px] text-slate-400 mb-1">
                {lang === 'uk' ? 'Вік (років):' : 'Age:'}
              </label>
              <input
                type="number"
                min={13}
                max={22}
                value={profile.age}
                onChange={(e) => setProfile(prev => ({ ...prev, age: Number(e.target.value) }))}
                className="w-full px-2.5 py-1.5 bg-slate-950 border border-slate-800 rounded-lg text-xs font-semibold text-indigo-400 focus:outline-none"
              />
            </div>
          </div>

          {/* Grade & Institution */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <div>
              <label className="block text-[11px] text-slate-400 mb-1">
                {lang === 'uk' ? 'Клас / Курс:' : 'Grade / Year:'}
              </label>
              <select
                value={profile.grade}
                onChange={(e) => setProfile(prev => ({ ...prev, grade: e.target.value }))}
                className="w-full px-2.5 py-1.5 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white focus:outline-none cursor-pointer"
              >
                {(lang === 'uk' 
                  ? ['8 клас', '9 клас', '10 клас', '11 клас', '1-2 курс коледжу', '1 курс ВНЗ']
                  : ['8th Grade', '9th Grade', '10th Grade', '11th Grade', 'College 1-2 Year', 'University 1st Year']
                ).map(g => (
                  <option key={g} value={g}>{g}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-[11px] text-slate-400 mb-1">
                {lang === 'uk' ? 'Заклад освіти / Ліцей:' : 'School / Lyceum:'}
              </label>
              <input
                type="text"
                value={profile.schoolName}
                onChange={(e) => setProfile(prev => ({ ...prev, schoolName: e.target.value }))}
                className="w-full px-2.5 py-1.5 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white focus:outline-none"
              />
            </div>
          </div>

          {/* Multi-Profession Selection */}
          <div className="space-y-1.5">
            <div className="flex justify-between items-center text-xs">
              <span className="text-slate-400 font-medium">
                {lang === 'uk' ? 'Цільові професії для перевірки:' : 'Target Careers to Evaluate:'}
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
              </div>
            </div>

            <div className="flex flex-wrap gap-1.5">
              {availableProfessions.map(prof => {
                const isSelected = profile.targetProfessions?.includes(prof);
                return (
                  <button
                    key={prof}
                    type="button"
                    onClick={() => handleToggleProfession(prof)}
                    className={`px-2 py-1 rounded text-xs border transition cursor-pointer ${
                      isSelected
                        ? 'bg-indigo-950/80 text-indigo-300 border-indigo-700'
                        : 'bg-slate-950 text-slate-500 border-slate-800 hover:text-slate-300'
                    }`}
                  >
                    {isSelected ? '✓ ' : '+ '}{prof}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Skills Tags List with Adder */}
          <div className="space-y-1.5">
            <label className="block text-[11px] text-slate-400">
              {lang === 'uk' ? 'Поточні навички та технології:' : 'Current Skills & Tech Stack:'}
            </label>
            <div className="flex flex-wrap gap-1 max-h-24 overflow-y-auto">
              {profile.currentSkills.map((sk, idx) => (
                <span 
                  key={idx} 
                  className="inline-flex items-center gap-1 text-[11px] px-2 py-0.5 rounded bg-slate-950 border border-slate-800 text-slate-300"
                >
                  <span>{sk}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveSkill(sk)}
                    className="text-slate-500 hover:text-rose-400 cursor-pointer"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>

            {/* Quick add skill input */}
            <div className="flex gap-1.5 pt-1">
              <input
                type="text"
                value={newSkillInput}
                onChange={(e) => setNewSkillInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleAddSkill()}
                placeholder={lang === 'uk' ? '+ Додати навичку (напр. Docker, PyTorch)...' : '+ Add skill (e.g. Docker, PyTorch)...'}
                className="flex-1 bg-slate-950 border border-slate-800 rounded px-2.5 py-1 text-xs text-white focus:outline-none"
              />
              <button
                type="button"
                onClick={handleAddSkill}
                className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-xs text-slate-300 transition cursor-pointer"
              >
                +
              </button>
            </div>
          </div>

          {/* Student CV / Resume Text Area */}
          <div className="space-y-1">
            <div className="flex justify-between items-center text-xs">
              <label className="text-slate-400 font-medium flex items-center gap-1.5">
                <FileText className="h-3.5 w-3.5 text-indigo-400" />
                <span>{lang === 'uk' ? 'Текст резюме або опис проєктів:' : 'Resume Text or Project Description:'}</span>
              </label>
              <span className="text-[11px] font-mono text-slate-500">
                {profile.resumeText?.length || 0} {lang === 'uk' ? 'символів' : 'chars'}
              </span>
            </div>
            <textarea
              rows={5}
              value={profile.resumeText}
              onChange={(e) => setProfile(prev => ({ ...prev, resumeText: e.target.value }))}
              placeholder={lang === 'uk' ? 'Вставте текст вашого резюме, опис pet-проєктів чи наукової роботи МАН...' : 'Paste your resume text or pet-projects description...'}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 font-mono text-xs text-slate-200 focus:outline-none focus:border-slate-700 leading-relaxed"
            />
          </div>

          {/* GitHub / Olympiads */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
            <div>
              <label className="text-slate-500 block mb-0.5">GitHub URL:</label>
              <input
                type="text"
                value={profile.githubUrl}
                onChange={(e) => setProfile(prev => ({ ...prev, githubUrl: e.target.value }))}
                className="w-full bg-slate-950 border border-slate-800 rounded px-2.5 py-1 text-white text-xs focus:outline-none"
              />
            </div>
            <div>
              <label className="text-slate-500 block mb-0.5">{lang === 'uk' ? 'Олімпіади / МАН:' : 'Olympiads / JAS:'}</label>
              <input
                type="text"
                value={profile.olympiadAchievements}
                onChange={(e) => setProfile(prev => ({ ...prev, olympiadAchievements: e.target.value }))}
                className="w-full bg-slate-950 border border-slate-800 rounded px-2.5 py-1 text-white text-xs focus:outline-none"
              />
            </div>
          </div>

          {/* Run Audit Button */}
          <button
            onClick={handleRunResumeAudit}
            disabled={isAuditing}
            className="w-full py-2.5 px-4 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-xs flex items-center justify-center gap-1.5 transition disabled:opacity-50 cursor-pointer shadow-sm"
          >
            {isAuditing ? (
              <>
                <RefreshCw className="h-3.5 w-3.5 animate-spin" />
                <span>{lang === 'uk' ? 'Глибокий аналіз резюме та вимог ринку...' : 'Evaluating CV & Labor Market Fit...'}</span>
              </>
            ) : (
              <>
                <Sparkles className="h-3.5 w-3.5" />
                <span>{lang === 'uk' ? 'Провести аудит резюме та розрахунок Skill-Gap' : 'Run CV Audit & Multi-Career Gap Analysis'}</span>
              </>
            )}
          </button>
        </div>

        {/* Right Output: Legal Advisory, Multi-Profession Matches, Roadmap & ATS Score (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          
          {auditResult ? (
            <motion.div 
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, ease: 'easeOut' }}
              className="space-y-4"
            >
              {/* Overall Match & Age Legal Advisory */}
              <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800/80 pb-3">
                  <div>
                    <span className="text-xs text-slate-400">
                      {lang === 'uk' ? 'Загальна готовність резюме до вимог ринку:' : 'Overall Resume Market Readiness:'}
                    </span>
                    <div className="flex items-baseline gap-2 mt-0.5">
                      <h4 className="text-2xl font-bold text-white font-mono">
                        {auditResult.matchPercentage}%
                      </h4>
                      <span className="text-xs text-slate-400">
                        {auditResult.matchPercentage >= 70 
                          ? (lang === 'uk' ? '• Висока готовність до Trainee/Junior' : '• High readiness for Trainee/Junior')
                          : (lang === 'uk' ? '• Потрібне доопрацювання стеків' : '• Skill development required')}
                      </span>
                    </div>
                  </div>

                  <div className="text-xs text-slate-400 sm:text-right">
                    <span className="block font-medium text-slate-200">
                      {profile.name} ({profile.age} {lang === 'uk' ? 'років' : 'y.o.'})
                    </span>
                    <span className="text-[11px] text-slate-500">{profile.schoolName} • {profile.grade}</span>
                  </div>
                </div>

                {/* Progress bar */}
                <div className="w-full bg-slate-950 h-2 rounded-full overflow-hidden">
                  <div 
                    className={`h-full rounded-full transition-all duration-500 ${
                      auditResult.matchPercentage >= 70 ? 'bg-emerald-500' : 'bg-indigo-500'
                    }`}
                    style={{ width: `${auditResult.matchPercentage}%` }}
                  ></div>
                </div>

                {/* Legal Advisory Note (Ukrainian Labor Code) */}
                <div className="p-3.5 rounded-lg bg-slate-950 border border-slate-800 text-xs text-slate-300 space-y-1">
                  <div className="font-semibold text-slate-200 flex items-center gap-1.5">
                    <ShieldAlert className="h-4 w-4 text-amber-400" />
                    <span>{lang === 'uk' ? 'Правовий супровід працевлаштування неповнолітніх (КЗпП України):' : 'Labor Code Legal Guidance for Youth (Ukraine):'}</span>
                  </div>
                  <p className="text-slate-400 leading-relaxed text-[11px]">
                    {auditResult.ageLegalAdvice}
                  </p>
                </div>
              </div>

              {/* Multi-Profession Match Matrix */}
              <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-3">
                <div className="flex justify-between items-center">
                  <h4 className="text-xs font-semibold text-white uppercase tracking-wider">
                    {lang === 'uk' ? 'Відповідність вимогам за обраними професіями' : 'Multi-Career Compatibility Matrix'}
                  </h4>
                  <span className="text-[11px] text-slate-500 font-mono">
                    {auditResult.professionMatches.length} {lang === 'uk' ? 'напрямків' : 'tracks'}
                  </span>
                </div>

                <div className="space-y-2.5">
                  {auditResult.professionMatches.map((pm, idx) => (
                    <div key={idx} className="p-3 rounded-lg bg-slate-950 border border-slate-800 text-xs space-y-2">
                      <div className="flex justify-between items-baseline">
                        <span className="font-semibold text-white">{pm.profession}</span>
                        <span className="font-mono font-bold text-indigo-400">{pm.matchScore}% {lang === 'uk' ? 'збіг' : 'match'}</span>
                      </div>

                      <div className="w-full bg-slate-900 h-1.5 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-indigo-500 rounded-full"
                          style={{ width: `${pm.matchScore}%` }}
                        ></div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1 text-[11px]">
                        <div>
                          <span className="text-emerald-400 block mb-0.5">
                            ✓ {lang === 'uk' ? 'Виявлені навички:' : 'Detected Skills:'}
                          </span>
                          <span className="text-slate-300">{pm.matchedSkills.join(', ') || (lang === 'uk' ? 'Базові' : 'Foundational')}</span>
                        </div>
                        <div>
                          <span className="text-amber-400 block mb-0.5">
                            ▲ {lang === 'uk' ? 'Критично бракує:' : 'Missing Critical:'}
                          </span>
                          <span className="text-slate-400">{pm.missingSkills.join(', ')}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Strengths & Weaknesses */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-2 text-xs">
                  <span className="font-semibold text-emerald-400 block">
                    {lang === 'uk' ? 'Сильні сторони резюме:' : 'CV Strengths:'}
                  </span>
                  <div className="space-y-1">
                    {auditResult.cvStrengths.map((st, i) => (
                      <div key={i} className="text-slate-300 text-[11px] leading-relaxed">• {st}</div>
                    ))}
                  </div>
                </div>

                <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-2 text-xs">
                  <span className="font-semibold text-amber-400 block">
                    {lang === 'uk' ? 'Зони росту та покращення:' : 'Areas to Improve:'}
                  </span>
                  <div className="space-y-1">
                    {auditResult.cvWeaknesses.map((w, i) => (
                      <div key={i} className="text-slate-300 text-[11px] leading-relaxed">• {w}</div>
                    ))}
                  </div>
                </div>
              </div>

              {/* ATS Screening Advice */}
              <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 text-xs text-slate-300 space-y-1.5">
                <div className="flex items-center gap-1.5 font-semibold text-white">
                  <CheckCircle className="h-4 w-4 text-indigo-400" />
                  <span>{lang === 'uk' ? 'Порада технічного рекрутера (ATS Screening):' : 'Recruiter & ATS Screening Advice:'}</span>
                </div>
                <p className="text-slate-400 leading-relaxed text-[11px]">
                  {auditResult.atsFeedback}
                </p>
              </div>

              {/* Educational Roadmap & Milestones */}
              {auditResult.recommendedRoadmap && auditResult.recommendedRoadmap.length > 0 && (
                <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-3">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                    <div className="flex items-center gap-1.5">
                      <Clock className="h-4 w-4 text-indigo-400" />
                      <h4 className="text-xs font-semibold text-white uppercase tracking-wider">
                        {lang === 'uk' ? 'Покрокова дорожня карта навчання' : 'Personalized Learning Roadmap'}
                      </h4>
                    </div>
                    {auditResult.estimatedStudyHours && (
                      <span className="text-[11px] text-slate-400 font-mono">
                        ~{auditResult.estimatedStudyHours} {lang === 'uk' ? 'годин підготовки' : 'study hours'}
                      </span>
                    )}
                  </div>

                  <div className="space-y-3 pt-1">
                    {auditResult.recommendedRoadmap.map((stage, sIdx) => (
                      <div key={sIdx} className="p-3 rounded-lg bg-slate-950 border border-slate-800 text-xs space-y-1.5">
                        <div className="flex justify-between items-baseline">
                          <span className="font-semibold text-indigo-300">{stage.stage}</span>
                          <span className="text-[11px] text-slate-500 font-mono">{stage.duration}</span>
                        </div>
                        <p className="text-slate-400 text-[11px]">{stage.goal}</p>
                        
                        {stage.milestones && stage.milestones.length > 0 && (
                          <div className="space-y-0.5 pt-1">
                            {stage.milestones.map((m, mIdx) => (
                              <div key={mIdx} className="text-slate-300 text-[11px] flex items-center gap-1.5">
                                <span className="text-indigo-400">•</span>
                                <span>{m}</span>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Recommended Free Courses */}
              {auditResult.recommendedCourses && auditResult.recommendedCourses.length > 0 && (
                <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-2 text-xs">
                  <div className="flex items-center gap-1.5 font-semibold text-white">
                    <BookOpen className="h-4 w-4 text-emerald-400" />
                    <span>{lang === 'uk' ? 'Рекомендовані безкоштовні курси для заповнення прогалин:' : 'Recommended Free Courses to Bridge Skill Gaps:'}</span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                    {auditResult.recommendedCourses.map((c, cIdx) => (
                      <a
                        key={cIdx}
                        href={c.url}
                        target="_blank"
                        rel="noreferrer"
                        className="p-2.5 rounded-lg bg-slate-950 border border-slate-800 hover:border-slate-700 transition flex items-center justify-between group"
                      >
                        <div className="space-y-0.5">
                          <span className="font-medium text-slate-200 group-hover:text-indigo-300 transition text-[11px] block">
                            {c.title}
                          </span>
                          <span className="text-[10px] text-slate-500">{c.provider}</span>
                        </div>
                        <ExternalLink className="h-3 w-3 text-slate-600 group-hover:text-slate-400 shrink-0" />
                      </a>
                    ))}
                  </div>
                </div>
              )}

            </motion.div>
          ) : (
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-8 text-center text-xs text-slate-400 space-y-3">
              <GraduationCap className="h-8 w-8 text-slate-600 mx-auto" />
              <div className="space-y-1">
                <p className="text-slate-300 font-medium">
                  {lang === 'uk' ? 'Аудит учнівського резюме та портфоліо' : 'Student Resume & Portfolio Audit'}
                </p>
                <p className="max-w-md mx-auto text-[11px] leading-relaxed">
                  {lang === 'uk' 
                    ? 'Заповніть анкету, оберіть декілька професій або натисніть один із готових зразків угорі. Система оцінить відповідність реальним вимогам роботодавців та сформує правовий висновок за КЗпП України.'
                    : 'Fill in the questionnaire, select multiple careers, or apply one of the presets above. The system evaluates readiness against live employer criteria and provides labor law guidelines.'}
                </p>
              </div>

              <div className="pt-2">
                <button
                  type="button"
                  onClick={handleRunResumeAudit}
                  className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-xs transition cursor-pointer"
                >
                  {lang === 'uk' ? 'Запустити аудит резюме' : 'Run CV Audit'}
                </button>
              </div>
            </div>
          )}

        </div>

      </div>

    </div>
  );
};
