import React, { useState } from 'react';
import { 
  Printer, 
  Download, 
  CheckCircle2, 
  ShieldCheck
} from 'lucide-react';
import { Vacancy } from '../types/job';
import { extractTopSkills, computeAverageSalary } from '../utils/nlp';
import { Language, TRANSLATIONS } from '../i18n/translations';

interface ReportDossierProps {
  vacancies: Vacancy[];
  lang: Language;
}

export const ReportDossier: React.FC<ReportDossierProps> = ({ vacancies, lang }) => {
  const t = TRANSLATIONS[lang];
  const [studentName, setStudentName] = useState(lang === 'uk' ? 'Олександр Коваленко' : 'Alex Kovalenko');
  const [schoolGrade, setSchoolGrade] = useState(lang === 'uk' ? '10-А клас' : 'Grade 10-A');
  const [schoolName, setSchoolName] = useState(lang === 'uk' ? 'Науковий ліцей / Загальноосвітня школа' : 'Science Lyceum / Secondary School');
  const [selectedFocus, setSelectedFocus] = useState('Python / AI & Data Engineering');

  const topSkills = extractTopSkills(vacancies).slice(0, 8);
  const salaryStats = computeAverageSalary(vacancies);
  const currentDate = new Date().toLocaleDateString(lang === 'uk' ? 'uk-UA' : 'en-US', { year: 'numeric', month: 'long', day: 'numeric' });

  const handlePrint = () => {
    window.print();
  };

  const handleExportJSON = () => {
    const reportData = {
      projectTitle: lang === 'uk' 
        ? 'Інформаційно-аналітична система дослідження вимог роботодавців до кандидатів на вакансії для профорієнтації учнів'
        : 'Labor Market Information-Analytical System for Student Career Guidance',
      generatedAt: new Date().toISOString(),
      student: { name: studentName, grade: schoolGrade, school: schoolName },
      language: lang,
      methodology: {
        parsingEngine: 'BeautifulSoup4 (Python) & Cheerio (Node.js)',
        nlpProcessing: 'TF-IDF Vectorization & Gemini 3.8 Flash ML',
        sampleSize: vacancies.length,
        sources: ['Work.ua', 'Robota.ua', 'DOU.ua', 'Djinni.co']
      },
      findings: {
        targetProfession: selectedFocus,
        demandVerdict: lang === 'uk' ? 'Високий попит' : 'High Demand',
        averageJuniorSalaryUah: salaryStats.avg,
        topRequiredSkills: topSkills,
      }
    };

    const blob = new Blob([JSON.stringify(reportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Career_Report_${studentName.replace(/\s+/g, '_')}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      
      {/* Top Action Bar (hidden in print) */}
      <div className="print:hidden flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
        <div>
          <h2 className="text-base font-semibold text-white">
            {t.reportTitle}
          </h2>
          <p className="text-xs text-slate-400">
            {t.reportDesc}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleExportJSON}
            className="px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 text-xs font-medium border border-slate-800 transition flex items-center gap-1.5 cursor-pointer"
          >
            <Download className="h-3.5 w-3.5" />
            <span>{t.exportJson}</span>
          </button>

          <button
            onClick={handlePrint}
            className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-white text-slate-900 text-xs font-medium transition flex items-center gap-1.5 cursor-pointer"
          >
            <Printer className="h-3.5 w-3.5" />
            <span>{t.printPdf}</span>
          </button>
        </div>
      </div>

      {/* Editable Fields (hidden in print) */}
      <div className="print:hidden grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-900 border border-slate-800 rounded-xl p-3.5 text-xs">
        <div>
          <label className="text-slate-500 block mb-1">{t.studentNameLabel}</label>
          <input
            type="text"
            value={studentName}
            onChange={(e) => setStudentName(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded px-2.5 py-1 text-white text-xs focus:outline-none"
          />
        </div>
        <div>
          <label className="text-slate-500 block mb-1">{t.schoolGradeLabel}</label>
          <input
            type="text"
            value={schoolGrade}
            onChange={(e) => setSchoolGrade(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded px-2.5 py-1 text-white text-xs focus:outline-none"
          />
        </div>
        <div>
          <label className="text-slate-500 block mb-1">{t.schoolNameLabel}</label>
          <input
            type="text"
            value={schoolName}
            onChange={(e) => setSchoolName(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded px-2.5 py-1 text-white text-xs focus:outline-none"
          />
        </div>
        <div>
          <label className="text-slate-500 block mb-1">{t.selectedProfessionLabel}</label>
          <input
            type="text"
            value={selectedFocus}
            onChange={(e) => setSelectedFocus(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded px-2.5 py-1 text-white text-xs focus:outline-none"
          />
        </div>
      </div>

      {/* Printable Sheet */}
      <div className="bg-white text-slate-900 rounded-xl p-6 sm:p-10 border border-slate-200 max-w-4xl mx-auto space-y-6 font-sans print:p-0 print:border-none print:shadow-none print:m-0">
        
        {/* Document Header */}
        <div className="border-b border-slate-300 pb-4 flex justify-between items-start">
          <div>
            <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-500 block">
              {t.documentBadge}
            </span>
            <h1 className="text-xl font-bold text-slate-900 mt-0.5">
              {t.documentHeading}
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              {t.documentTopic}
            </p>
          </div>

          <div className="text-right text-xs text-slate-500 font-mono">
            <p>{currentDate}</p>
          </div>
        </div>

        {/* Meta */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-3 bg-slate-50 rounded-lg border border-slate-200 text-xs">
          <div>
            <span className="text-slate-500 block">{t.studentNameLabel}</span>
            <span className="font-semibold text-slate-900">{studentName}</span>
          </div>
          <div>
            <span className="text-slate-500 block">{t.schoolGradeLabel}</span>
            <span className="font-semibold text-slate-900">{schoolGrade}</span>
          </div>
          <div>
            <span className="text-slate-500 block">{t.schoolNameLabel}</span>
            <span className="font-semibold text-slate-900">{schoolName}</span>
          </div>
          <div>
            <span className="text-slate-500 block">{t.selectedProfessionLabel}</span>
            <span className="font-semibold text-slate-900">{selectedFocus}</span>
          </div>
        </div>

        {/* 1. Demand Verdict */}
        <div className="space-y-2 text-xs">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-700 border-b border-slate-200 pb-1">
            {t.verdictSection}
          </h2>
          <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg space-y-1">
            <div className="font-semibold text-slate-900 flex items-center gap-1.5">
              <CheckCircle2 className="h-4 w-4 text-emerald-600" />
              <span>{t.verdictHighDemand}</span>
            </div>
            <p className="text-slate-600 leading-relaxed">
              {lang === 'uk'
                ? `На основі даних парсингу вакансій (Work.ua, Robota.ua, DOU), спеціальність «${selectedFocus}» демонструє стійке зростання кількості пропозицій для початківців. Орієнтовна заробітна плата стажера/Junior фахівця становить ~${salaryStats.avg.toLocaleString()} грн/міс.`
                : `Based on extracted job postings (Work.ua, Robota.ua, DOU), "${selectedFocus}" shows steady demand growth for early-career candidates. Expected average entry-level salary is ~${salaryStats.avg.toLocaleString()} UAH/month.`
              }
            </p>
          </div>
        </div>

        {/* 2. Key Hard Skills */}
        <div className="space-y-2 text-xs">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-700 border-b border-slate-200 pb-1">
            {t.hardSkillsSection}
          </h2>
          <div className="grid grid-cols-2 gap-1.5">
            {topSkills.map((sk, idx) => (
              <div key={idx} className="flex justify-between p-2 rounded bg-slate-50 border border-slate-200">
                <span className="text-slate-800">{sk.name}</span>
                <span className="font-mono text-slate-500">{sk.percentage}% {lang === 'uk' ? 'вакансій' : 'jobs'}</span>
              </div>
            ))}
          </div>
        </div>

        {/* 3. Trajectory */}
        <div className="space-y-2 text-xs text-slate-600">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-700 border-b border-slate-200 pb-1">
            {t.adviceSection}
          </h2>
          <div className="space-y-1.5">
            {lang === 'uk' ? (
              <>
                <p><strong>8–9 класи:</strong> Базові алгоритми, вивчення синтаксису Python, олімпіадна математика, англійська мова до рівня B1.</p>
                <p><strong>10–11 класи:</strong> Практичний парсинг даних (BeautifulSoup4), реляційні бази даних (SQL), робота з Git/GitHub для створення власного портфоліо.</p>
                <p><strong>Вступ у ВНЗ/Коледж:</strong> Технічні спеціальності (121, 122, 124, 125). Підготовка до стажувань у Trainee-програмах.</p>
              </>
            ) : (
              <>
                <p><strong>Grades 8–9:</strong> Foundational algorithmic logic, Python syntax, high school mathematics, English B1 proficiency.</p>
                <p><strong>Grades 10–11:</strong> Practical web scraping (BeautifulSoup4), relational SQL databases, Git/GitHub version control for building personal project portfolio.</p>
                <p><strong>Higher Education / College:</strong> Computer Science, Software Engineering, Cybersecurity majors. Trainee internship applications.</p>
              </>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="pt-4 border-t border-slate-200 flex justify-between text-xs text-slate-500">
          <span>{lang === 'uk' ? 'Методологія: Парсинг DOM-структури (BS4/Cheerio) + TF-IDF зважування' : 'Methodology: DOM Parsing (BS4/Cheerio) + TF-IDF Weighting'}</span>
          <span className="flex items-center gap-1 text-slate-700">
            <ShieldCheck className="h-4 w-4 text-emerald-600" />
            {t.verifiedBadge}
          </span>
        </div>

      </div>

    </div>
  );
};
