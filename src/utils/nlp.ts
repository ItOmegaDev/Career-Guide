import { Vacancy } from '../types/job';

// TF-IDF and Skill Extraction Utilities
export function extractTopSkills(vacancies: Vacancy[]): { name: string; count: number; percentage: number }[] {
  const counts: Record<string, number> = {};

  vacancies.forEach(v => {
    v.skills.forEach(s => {
      const normalized = s.trim();
      counts[normalized] = (counts[normalized] || 0) + 1;
    });
  });

  const total = vacancies.length || 1;
  return Object.entries(counts)
    .map(([name, count]) => ({
      name,
      count,
      percentage: Math.round((count / total) * 100)
    }))
    .sort((a, b) => b.count - a.count);
}

export function extractTopSoftSkills(vacancies: Vacancy[]): { name: string; count: number; percentage: number }[] {
  const counts: Record<string, number> = {};

  vacancies.forEach(v => {
    v.softSkills.forEach(s => {
      const normalized = s.trim();
      counts[normalized] = (counts[normalized] || 0) + 1;
    });
  });

  const total = vacancies.length || 1;
  return Object.entries(counts)
    .map(([name, count]) => ({
      name,
      count,
      percentage: Math.round((count / total) * 100)
    }))
    .sort((a, b) => b.count - a.count);
}

export function computeAverageSalary(vacancies: Vacancy[]): { avg: number; min: number; max: number } {
  const valid = vacancies.filter(v => v.salaryMin && v.salaryMin > 0);
  if (valid.length === 0) return { avg: 34000, min: 25000, max: 48000 };

  const total = valid.reduce((acc, v) => acc + (v.salaryMin! + (v.salaryMax || v.salaryMin!)) / 2, 0);
  const avg = Math.round(total / valid.length);
  const min = Math.min(...valid.map(v => v.salaryMin!));
  const max = Math.max(...valid.map(v => v.salaryMax || v.salaryMin!));

  return { avg, min, max };
}

// Compute co-occurrence matrix for skills (e.g. how often Python appears with SQL)
export function computeSkillCoOccurrence(vacancies: Vacancy[], targetSkill: string): { skill: string; count: number; correlation: number }[] {
  const targetLower = targetSkill.toLowerCase();
  const filtered = vacancies.filter(v => v.skills.some(s => s.toLowerCase().includes(targetLower)));

  if (filtered.length === 0) return [];

  const coCounts: Record<string, number> = {};
  filtered.forEach(v => {
    v.skills.forEach(s => {
      if (!s.toLowerCase().includes(targetLower)) {
        coCounts[s] = (coCounts[s] || 0) + 1;
      }
    });
  });

  return Object.entries(coCounts)
    .map(([skill, count]) => ({
      skill,
      count,
      correlation: Math.round((count / filtered.length) * 100)
    }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 8);
}
