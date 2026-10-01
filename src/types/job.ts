export interface Vacancy {
  id: string;
  title: string;
  company: string;
  source: 'Work.ua' | 'Robota.ua' | 'DOU.ua' | 'Djinni' | 'LinkedIn' | 'Custom Scrape';
  url?: string;
  city: string;
  isRemote: boolean;
  salaryMin?: number;
  salaryMax?: number;
  salaryCurrency: string;
  experienceLevel: 'Trainee/No Exp' | 'Junior' | 'Middle' | 'Senior';
  description: string;
  skills: string[];
  softSkills: string[];
  educationRequirement?: string;
  englishLevel?: string;
  postedDate: string;
}

export interface SkillStats {
  name: string;
  category: 'Hard Skill' | 'Soft Skill' | 'Tool/Framework' | 'Language' | 'Certification';
  count: number;
  percentage: number;
  importance: 'Критична' | 'Бажана' | 'Бонусна';
  trend: 'Зростає' | 'Стабільний' | 'Спадає';
  trendPercentage: number;
  descriptionUk: string;
  difficultyForPupil: 'Легко освоїти в школі' | 'Потрібна база 10-11 кл' | 'Потрібен ВНЗ/Курси';
  recommendedCourses: { title: string; provider: string; url: string; isFree: boolean }[];
}

export interface ProfessionAnalysis {
  profession: string;
  demandStatus: 'Дуже високий попит' | 'Високий попит' | 'Помірний попит' | 'Згасаючий попит' | 'Трансформується через AI';
  demandScore: number; // 0 - 100
  isRecommendedForPupil: boolean;
  verdictSummary: string;
  averageSalaryUah: number;
  salaryRange: { min: number; max: number };
  juniorEntryBarrier: 'Низький' | 'Середній' | 'Високий';
  competitionIndex: string; // e.g. "12 резюме на вакансію"
  forecast2026_2030: string;
  topHardSkills: SkillStats[];
  topSoftSkills: string[];
  topTools: string[];
  aiImpactAnalysis: string;
  schoolAdvice: {
    targetSubjects: string[]; // e.g. Математика, Інформатика, Англійська
    schoolProjects: string[];
    gradePlan: { grade: string; focus: string }[];
  };
}

export interface StudentProfile {
  name: string;
  grade: string; // "8 клас", "9 клас", "10 клас", "11 клас", "Студент 1-2 курсу"
  favoriteSubjects: string[];
  currentSkills: string[];
  englishLevel: string;
  interests: string[];
  workPreference: 'remote' | 'office' | 'hybrid' | 'any';
  targetProfession?: string;
}

export interface SkillGapResult {
  matchPercentage: number;
  acquiredSkills: string[];
  missingCriticalSkills: SkillStats[];
  missingOptionalSkills: SkillStats[];
  estimatedStudyHours: number;
  recommendedRoadmap: {
    stage: string;
    duration: string;
    goal: string;
    milestones: string[];
    resources: { title: string; url: string; platform: string; isFree: boolean }[];
  }[];
}

export interface ParseResult {
  success: boolean;
  url?: string;
  parsedAt: string;
  timeTakenMs: number;
  vacanciesFound: number;
  extractedVacancies: Vacancy[];
  bs4EquivalentCode: string;
  selectorsUsed: {
    cardSelector: string;
    titleSelector: string;
    companySelector: string;
    salarySelector: string;
    skillsSelector: string;
    descSelector: string;
  };
  htmlSamplePreview?: string;
  logs: string[];
}
