import React from 'react';
import { X, Check, ArrowRight, DollarSign, MapPin, Briefcase } from 'lucide-react';
import { Vacancy } from '../types/job';
import { Language } from '../i18n/translations';

interface VacancyComparisonModalProps {
  vacancies: Vacancy[];
  onClose: () => void;
  lang: Language;
}

export const VacancyComparisonModal: React.FC<VacancyComparisonModalProps> = ({
  vacancies,
  onClose,
  lang
}) => {
  if (vacancies.length === 0) return null;

  // Compute common skills across all selected vacancies
  const commonSkills = vacancies.length > 1
    ? vacancies[0].skills.filter(sk => vacancies.every(v => v.skills.some(s => s.toLowerCase() === sk.toLowerCase())))
    : vacancies[0].skills;

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-5xl w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
        
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-white">
              {lang === 'uk' ? 'Порівняльний аналіз обраних вакансій' : 'Comparative Analysis of Selected Vacancies'} ({vacancies.length})
            </h3>
            <p className="text-xs text-slate-400">
              {lang === 'uk' 
                ? 'Диференційний аналіз вимог роботодавців, заробітних плат та необхідного стеку'
                : 'Differential breakdown of employer requirements, salary ranges, and technical stacks'}
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition cursor-pointer"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-6 overflow-y-auto space-y-6">
          
          {/* Shared Common Stack */}
          {vacancies.length > 1 && (
            <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 text-xs space-y-1.5">
              <span className="font-semibold text-slate-200 block">
                {lang === 'uk' ? 'Спільні вимоги (перетинаються в усіх обраних вакансіях):' : 'Common requirements across all selected jobs:'}
              </span>
              <div className="flex flex-wrap gap-1.5">
                {commonSkills.length > 0 ? (
                  commonSkills.map((sk, idx) => (
                    <span key={idx} className="px-2 py-0.5 rounded bg-emerald-950/60 border border-emerald-800/40 text-emerald-300 font-medium">
                      ✓ {sk}
                    </span>
                  ))
                ) : (
                  <span className="text-slate-500">
                    {lang === 'uk' ? 'Прямих однакових технологій не виявлено (різний профіль).' : 'No identical tech overlap found (different stacks).'}
                  </span>
                )}
              </div>
            </div>
          )}

          {/* Grid columns */}
          <div className={`grid grid-cols-1 md:grid-cols-${Math.min(vacancies.length, 3)} gap-4`}>
            {vacancies.map((vac) => (
              <div 
                key={vac.id}
                className="bg-slate-950 border border-slate-800 rounded-xl p-4 flex flex-col justify-between space-y-3"
              >
                <div className="space-y-2">
                  <div>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-slate-400">
                      {vac.source}
                    </span>
                    <h4 className="text-sm font-bold text-white mt-1.5">{vac.title}</h4>
                    <p className="text-xs text-slate-400">{vac.company} • {vac.city}</p>
                  </div>

                  {/* Salary & Remote */}
                  <div className="pt-2 border-t border-slate-900 flex justify-between items-baseline text-xs">
                    <span className="text-slate-500">{lang === 'uk' ? 'Рівень з/п:' : 'Salary:'}</span>
                    <span className="font-bold text-white">
                      {vac.salaryMin ? `${vac.salaryMin.toLocaleString()} – ${vac.salaryMax?.toLocaleString()} ${vac.salaryCurrency}` : (lang === 'uk' ? 'За домовленістю' : 'Negotiable')}
                    </span>
                  </div>

                  <div className="flex justify-between items-baseline text-xs text-slate-400">
                    <span>{lang === 'uk' ? 'Формат:' : 'Format:'}</span>
                    <span>{vac.isRemote ? (lang === 'uk' ? 'Дистанційно' : 'Remote') : (lang === 'uk' ? 'Офіс' : 'Office')}</span>
                  </div>

                  <div className="flex justify-between items-baseline text-xs text-slate-400">
                    <span>{lang === 'uk' ? 'Досвід:' : 'Experience:'}</span>
                    <span>{vac.experienceLevel}</span>
                  </div>

                  {/* Skills */}
                  <div className="pt-2 border-t border-slate-900 space-y-1.5">
                    <span className="text-[11px] font-semibold text-slate-400 block">
                      {lang === 'uk' ? 'Вимоги до знань:' : 'Required Skills:'}
                    </span>
                    <div className="flex flex-wrap gap-1">
                      {vac.skills.map((s, idx) => (
                        <span key={idx} className="text-[10px] px-1.5 py-0.5 rounded bg-slate-900 text-slate-300 border border-slate-800">
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Soft skills */}
                  {vac.softSkills && vac.softSkills.length > 0 && (
                    <div className="pt-1 text-[11px] text-slate-400">
                      <span className="text-slate-500 block">{lang === 'uk' ? 'Soft Skills:' : 'Soft Skills:'}</span>
                      <p>{vac.softSkills.slice(0, 3).join(', ')}</p>
                    </div>
                  )}
                </div>

                <div className="pt-2 border-t border-slate-900 text-[11px] text-slate-500">
                  {lang === 'uk' ? 'Дата публікації:' : 'Posted:'} {vac.postedDate}
                </div>
              </div>
            ))}
          </div>

        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3 border-t border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-white text-xs font-medium transition cursor-pointer"
          >
            {lang === 'uk' ? 'Закрити' : 'Close'}
          </button>
        </div>

      </div>
    </div>
  );
};
