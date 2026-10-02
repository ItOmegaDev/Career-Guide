import { Vacancy } from '../types/job';

export const INITIAL_VACANCIES: Vacancy[] = [
  // 1. Sales & Customer Relations (Продажі та робота з клієнтами)
  {
    id: 'vac-sales-1',
    title: 'Менеджер з продажу B2B (початківець / Trainee)',
    company: 'Нова Пошта',
    industry: 'Продажі та робота з клієнтами',
    source: 'Work.ua',
    url: 'https://www.work.ua/jobs/novaposhta-b2b-sales',
    city: 'Київ',
    isRemote: false,
    salaryMin: 28000,
    salaryMax: 45000,
    salaryCurrency: 'UAH',
    experienceLevel: 'Trainee/No Exp',
    description: 'Команда продажів бізнес-послуг «Нова Пошта» шукає активного початківця. Обов\'язки: консультування корпоративних клієнтів, укладання договорів на логістичне обслуговування, ведення клієнтської бази в CRM (Bitrix24), підготовка комерційних пропозицій.',
    skills: ['B2B продажі', 'CRM (Bitrix24)', 'Переговори', 'Ділове листування', 'Робота з запереченнями', 'Презентація продукту', 'Excel'],
    softSkills: ['Комунікабельність', 'Стресостійкість', 'Орієнтація на результат', 'Швидка навчуваність'],
    educationRequirement: 'Середня спеціальна або вища (розглядаємо випускників шкіл та студентів)',
    englishLevel: 'A2 (базовий)',
    postedDate: '2026-10-01'
  },
  {
    id: 'vac-sales-2',
    title: 'Менеджер по роботі з клієнтами / Account Manager',
    company: 'Rozetka.ua',
    industry: 'Продажі та робота з клієнтами',
    source: 'Work.ua',
    url: 'https://www.work.ua/jobs/rozetka-account-manager',
    city: 'Київ',
    isRemote: true,
    salaryMin: 25000,
    salaryMax: 38000,
    salaryCurrency: 'UAH',
    experienceLevel: 'Junior',
    description: 'Супровід мерчантів маркетплейсу Rozetka: онбординг нових партнерів, допомога в завантаженні товарів, контроль фінансових розрахунків та документообігу, аналіз продажів партнерів.',
    skills: ['Клієнтський сервіс', 'CRM', '1C / BAS', 'Аналітика продажів', 'Excel', 'Google Таблиці'],
    softSkills: ['Емпатія', 'Уважність до деталей', 'Грамотна українська мова', 'Тайм-менеджмент'],
    educationRequirement: 'Економіка, маркетинг або суміжні спеціальності',
    englishLevel: 'A2-B1',
    postedDate: '2026-10-01'
  },

  // 2. Finance & Accounting (Бухгалтерія та фінанси)
  {
    id: 'vac-fin-1',
    title: 'Асистент бухгалтера / Помічник головного бухгалтера',
    company: 'АТ «Укрпошта»',
    industry: 'Бухгалтерія та фінанси',
    source: 'Work.ua',
    url: 'https://www.work.ua/jobs/ukrposhta-assistant-accountant',
    city: 'Київ',
    isRemote: false,
    salaryMin: 22000,
    salaryMax: 32000,
    salaryCurrency: 'UAH',
    experienceLevel: 'Trainee/No Exp',
    description: 'Облік первинної бухгалтерської документації, введення рахунків, накладних та актів виконаних робіт у систему 1С/BAS, проведення звірок взаєморозрахунків із контрагентами, допомога у підготовці звітності.',
    skills: ['1С:Підприємство / BAS', 'Первинна документація', 'Excel', 'Податковий кодекс України', 'Акти звірки', 'Касові операції'],
    softSkills: ['Педантичність', 'Уважність до цифр', 'Посидючість', 'Відповідальність'],
    educationRequirement: 'Економічна, облікова або фінансова освіта (готові взяти студента)',
    englishLevel: 'Не вимагається',
    postedDate: '2026-09-30'
  },
  {
    id: 'vac-fin-2',
    title: 'Молодший фінансовий аналітик / Економіст',
    company: 'ПриватБанк',
    industry: 'Бухгалтерія та фінанси',
    source: 'Work.ua',
    url: 'https://www.work.ua/jobs/privatbank-financial-analyst',
    city: 'Дніпро',
    isRemote: true,
    salaryMin: 27000,
    salaryMax: 40000,
    salaryCurrency: 'UAH',
    experienceLevel: 'Junior',
    description: 'Аналіз фінансово-господарської діяльності відділень та продуктів банку, побудова бюджетних моделей, підготовка звітів для керівництва, оцінка прибутковості кредитно-депозитних програм.',
    skills: ['Фінансовий аналіз', 'Excel (ВПР, зведені таблиці)', 'SQL (базовий)', 'Бюджетування', 'Power BI', 'Економіка'],
    softSkills: ['Аналітичний склад розуму', 'Логіка', 'Критичне мислення'],
    educationRequirement: 'Банківська справа, фінанси, прикладна математика',
    englishLevel: 'B1 (читання фінансових звітів)',
    postedDate: '2026-10-02'
  },

  // 3. Logistics & Supply Chain (Логістика та транспорт)
  {
    id: 'vac-log-1',
    title: 'Менеджер з транспортної логістики (експедитор)',
    company: 'Raben Ukraine',
    industry: 'Логістика та транспорт',
    source: 'Robota.ua',
    url: 'https://robota.ua/company/raben-logistics-coordinator',
    city: 'Львів',
    isRemote: false,
    salaryMin: 26000,
    salaryMax: 42000,
    salaryCurrency: 'UAH',
    experienceLevel: 'Junior',
    description: 'Організація вантажних автомобільних перевезень по Україні та країнах ЄС. Пошук перевізників на платформах Lardi-Trans та Della, розрахунок вартості маршрутів, контроль руху вантажів та документообігу (CMR, ТТН).',
    skills: ['Транспортна логістика', 'Lardi-Trans', 'Della', 'CMR / ТТН', 'Управління маршрутами', '1С Логістика', 'Інкотермс'],
    softSkills: ['Швидкість прийняття рішень', 'Переговорні навички', 'Стресостійкість', 'Багатозадачність'],
    educationRequirement: 'Логістика, транспортні технології, міжнародна економіка',
    englishLevel: 'B1 (листування з іноземними перевізниками)',
    postedDate: '2026-10-01'
  },
  {
    id: 'vac-log-2',
    title: 'Диспетчер логістичного терміналу / Координатор складських потоків',
    company: 'Meest Пошта',
    industry: 'Логістика та транспорт',
    source: 'OLX Робота',
    url: 'https://www.olx.ua/rabota/meest-dispatcher',
    city: 'Київ',
    isRemote: false,
    salaryMin: 22000,
    salaryMax: 30000,
    salaryCurrency: 'UAH',
    experienceLevel: 'Trainee/No Exp',
    description: 'Оперативний контроль завантаження та розвантаження магістральних авто, розподіл вантажів по напрямках, робота зі сканерами штрих-кодів (WMS система), ведення змінного журналу обліку.',
    skills: ['WMS системи', 'Складська логістика', 'Облік вантажів', 'Сканери штрих-кодів', 'Excel'],
    softSkills: ['Пунктуальність', 'Дисциплінованість', 'Командна взаємодія'],
    educationRequirement: 'Розглядаємо кандидатів без досвіду з навчанням на терміналі',
    englishLevel: 'Не вимагається',
    postedDate: '2026-10-02'
  },

  // 4. Medicine & Healthcare (Медицина та фармація)
  {
    id: 'vac-med-1',
    title: 'Фармацевт-інтерн / Помічник провізора',
    company: 'Аптечна мережа «АНЦ»',
    industry: 'Медицина та фармація',
    source: 'Work.ua',
    url: 'https://www.work.ua/jobs/anc-pharmacist-intern',
    city: 'Одеса',
    isRemote: false,
    salaryMin: 23000,
    salaryMax: 34000,
    salaryCurrency: 'UAH',
    experienceLevel: 'Trainee/No Exp',
    description: 'Консультування клієнтів щодо лікарських засобів, відпуск медикаментів за рецептами та без них, контроль термінів придатності препаратів, викладка товару за фармакологічними групами, робота за касою.',
    skills: ['Фармакологія', 'Фармацевтична опіка', 'Касова дисципліна', '1С Аптека', 'Умови зберігання препаратів'],
    softSkills: ['Ввічливість', 'Емпатія', 'Уважність', 'Терплячість'],
    educationRequirement: 'Фармацевтична освіта (студент або випускник коледжу/університету)',
    englishLevel: 'Латина (базова професійна)',
    postedDate: '2026-09-29'
  },
  {
    id: 'vac-med-2',
    title: 'Асистент лікаря / Медична сестра (маніпуляційний кабінет)',
    company: 'Медична мережа «Добробут»',
    industry: 'Медицина та фармація',
    source: 'Robota.ua',
    url: 'https://robota.ua/company/dobrobut-nurse',
    city: 'Київ',
    isRemote: false,
    salaryMin: 25000,
    salaryMax: 35000,
    salaryCurrency: 'UAH',
    experienceLevel: 'Junior',
    description: 'Виконання лікарських призначень, проведення ін\'єкцій та забору аналізів, дотримання правил асептики та антисептики, робота з медичною електронною системою Helsi/Doctor Eleks.',
    skills: ['Маніпуляційні навички', 'Асептика та антисептика', 'Невідкладна допомога', 'Helsi / Doctor Eleks', 'Медична документація'],
    softSkills: ['Охайність', 'Доброзичливість', 'Психологічна стійкість'],
    educationRequirement: 'Середня спеціальна медична освіта («Сестринська справа», «Лікувальна справа»)',
    englishLevel: 'A1-A2',
    postedDate: '2026-10-01'
  },

  // 5. Marketing, SMM & Creative (Маркетинг, SMM та дизайн)
  {
    id: 'vac-mkt-1',
    title: 'SMM-менеджер та контент-креатор',
    company: 'Comfy',
    industry: 'Маркетинг та реклама',
    source: 'Robota.ua',
    url: 'https://robota.ua/company/comfy-smm-creator',
    city: 'Дніпро',
    isRemote: true,
    salaryMin: 24000,
    salaryMax: 36000,
    salaryCurrency: 'UAH',
    experienceLevel: 'Junior',
    description: 'Ведення TikTok та Instagram акаунтів бренду: генерація ідей для reels, зйомка та базовий монтаж на смартфон (CapCut), написання живих текстів, модерація коментарів, взаємодія з інфлюенсерами.',
    skills: ['TikTok & Instagram алгоритми', 'CapCut / InShot', 'Canva / Photoshop', 'Копірайтинг', 'Таргетинг (Meta Ads)', 'Аналітика охоплень'],
    softSkills: ['Креативність', 'Почуття гумору', 'Швидке реагування на тренди (ситуативний маркетинг)'],
    educationRequirement: 'Маркетинг, журналістика, PR або практичне портфоліо',
    englishLevel: 'B1',
    postedDate: '2026-10-02'
  },
  {
    id: 'vac-mkt-2',
    title: 'Графічний дизайнер / Візуалізатор (Junior Designer)',
    company: 'Banda Agency',
    industry: 'Маркетинг та реклама',
    source: 'Robota.ua',
    url: 'https://robota.ua/company/banda-junior-designer',
    city: 'Київ',
    isRemote: true,
    salaryMin: 26000,
    salaryMax: 40000,
    salaryCurrency: 'UAH',
    experienceLevel: 'Junior',
    description: 'Розробка креативних матеріалів для соцмереж, банерів, презентацій, верстка каталогів та поліграфії, підготовка брендової айдентики під керівництвом арт-директора.',
    skills: ['Adobe Photoshop', 'Adobe Illustrator', 'Figma', 'Типографіка', 'Композиція', 'Теорія кольору', 'Підготовка до друку'],
    softSkills: ['Візуальний смак', 'Сприйняття конструктивної критики', 'Командна робота'],
    educationRequirement: 'Обов\'язкова наявність портфоліо на Behance або Dribbble',
    englishLevel: 'B1',
    postedDate: '2026-09-30'
  },

  // 6. Engineering, Manufacturing & Technical (Інженерія та виробництво)
  {
    id: 'vac-eng-1',
    title: 'Інженер-конструктор (початківець, AutoCAD/SolidWorks)',
    company: 'ДП «Антонов»',
    industry: 'Інженерія та виробництво',
    source: 'Work.ua',
    url: 'https://www.work.ua/jobs/antonov-junior-engineer',
    city: 'Київ',
    isRemote: false,
    salaryMin: 26000,
    salaryMax: 38000,
    salaryCurrency: 'UAH',
    experienceLevel: 'Junior',
    description: 'Розробка 3D-моделей вузлів та деталей авіаційної техніки, оформлення складальних креслень за стандартами ЕСКД, участь у випробуваннях та авторському нагляді за виробництвом.',
    skills: ['AutoCAD', 'SolidWorks / Компас-3D', 'ЕСКД', 'Технічна механіка', 'Матеріалознавство', 'Читання креслень'],
    softSkills: ['Просторове мислення', 'Точність розрахунків', 'Відповідальність'],
    educationRequirement: 'Вища технічна/інженерна освіта (КПІ, ХАІ, НАУ або випускний курс)',
    englishLevel: 'A2-B1 (технічна англійська)',
    postedDate: '2026-10-01'
  },
  {
    id: 'vac-eng-2',
    title: 'Електромонтер сонячних електростанцій (стажер)',
    company: 'ДТЕК Відновлювана Енергетика',
    industry: 'Інженерія та виробництво',
    source: 'OLX Робота',
    url: 'https://www.olx.ua/rabota/dtek-electrician-intern',
    city: 'Вінниця',
    isRemote: false,
    salaryMin: 24000,
    salaryMax: 35000,
    salaryCurrency: 'UAH',
    experienceLevel: 'Trainee/No Exp',
    description: 'Монтаж та регламентне обслуговування фотоелектричних панелей, кабельних трас та інверторного обладнання. Проведення контрольних вимірів напруги та опору ізоляції з дотриманням ПТЕЕС.',
    skills: ['Електромонтаж', 'Правила безпечної експлуатації електроустановок (ПБЕЕС)', 'Вимірювальні прилади (мультиметр, мегомметр)', 'Схемотехніка'],
    softSkills: ['Дотримання техніки безпеки', 'Фізична витривалість', 'Акуратність'],
    educationRequirement: 'Технічний ліцей, ПТУ або коледж (група допуску з електробезпеки бажана)',
    englishLevel: 'Не вимагається',
    postedDate: '2026-10-02'
  },

  // 7. Education, Science & Tutoring (Освіта та репетиторство)
  {
    id: 'vac-edu-1',
    title: 'Онлайн-викладач математики для школярів (5-11 класи)',
    company: 'All Right Academy',
    industry: 'Освіта та наука',
    source: 'Work.ua',
    url: 'https://www.work.ua/jobs/allright-math-tutor',
    city: 'Київ / Вся Україна',
    isRemote: true,
    salaryMin: 22000,
    salaryMax: 38000,
    salaryCurrency: 'UAH',
    experienceLevel: 'Junior',
    description: 'Проведення індивідуальних онлайн-уроків з математики (алгебра, геометрія, підготовка до НМТ) за готовими інтерактивними методичними матеріалами на платформі. Моніторинг успішності учнів.',
    skills: ['Шкільна програма математики', 'Методика викладання', 'Підготовка до НМТ/ЗНО', 'Miro / Zoom', 'Інтерактивні дошки'],
    softSkills: ['Педагогічний такт', 'Вміння пояснювати складне просто', 'Терплячість', 'Енергійність'],
    educationRequirement: 'Математична, педагогічна освіта (розглядаємо успішних студентів-відмінників)',
    englishLevel: 'Не вимагається',
    postedDate: '2026-10-02'
  },

  // 8. Service, Hospitality & HoReCa (Сфера обслуговування та HoReCa)
  {
    id: 'vac-horeca-1',
    title: 'Бариста (спешелті-кава та кавові напої)',
    company: 'Aroma Kava',
    industry: 'HoReCa та сфера обслуговування',
    source: 'Work.ua',
    url: 'https://www.work.ua/jobs/aromakava-barista',
    city: 'Київ',
    isRemote: false,
    salaryMin: 20000,
    salaryMax: 30000,
    salaryCurrency: 'UAH',
    experienceLevel: 'Trainee/No Exp',
    description: 'Приготування класичних та авторських кавових напоїв, робота з професійною еспресо-машиною та кавомолкою, налаштування помолу, обслуговування гостей за касою (Poster POS), підтримання чистоти робочої зони.',
    skills: ['Приготування кави (еспресо, капучино)', 'Налаштування помолу', 'Робота з касою (Poster POS)', 'Стандарти гігієни (HACCP)', 'Лате-арт'],
    softSkills: ['Доброзичливість', 'Енергійність', 'Охайність', 'Комунікабельність'],
    educationRequirement: 'Готові навчати з нуля учнів від 16-18 років',
    englishLevel: 'Базовий (вітається для центру міста)',
    postedDate: '2026-10-02'
  },
  {
    id: 'vac-horeca-2',
    title: 'Адміністратор готелю (Front Desk / Receptionist)',
    company: 'Reikartz Hotel Group',
    industry: 'HoReCa та сфера обслуговування',
    source: 'Robota.ua',
    url: 'https://robota.ua/company/reikartz-front-desk',
    city: 'Львів',
    isRemote: false,
    salaryMin: 22000,
    salaryMax: 32000,
    salaryCurrency: 'UAH',
    experienceLevel: 'Junior',
    description: 'Зустріч та поселення гостей готелю, робота з системою бронювання Opera PMS, телефонні дзвінки, координація роботи служб покоївок та ресторану, вирішення нестандартних ситуацій під час проживання.',
    skills: ['Системи бронювання (Opera PMS)', 'Стандарти готельного сервісу', 'Касова дисципліна', 'Ділове листування'],
    softSkills: ['Гостинність', 'Дипломатичність', 'Презентабельний вигляд', 'Стресостійкість'],
    educationRequirement: 'Готельно-ресторанна справа, туризм або філологія',
    englishLevel: 'B1-B2 (вільне спілкування з іноземними гостями)',
    postedDate: '2026-10-01'
  },

  // 9. HR, Recruiting & Talent (HR та управління персоналом)
  {
    id: 'vac-hr-1',
    title: 'Junior Recruiter / Помічник HR-менеджера',
    company: 'Kernel',
    industry: 'HR та управління персоналом',
    source: 'Robota.ua',
    url: 'https://robota.ua/company/kernel-junior-recruiter',
    city: 'Полтава',
    isRemote: true,
    salaryMin: 24000,
    salaryMax: 35000,
    salaryCurrency: 'UAH',
    experienceLevel: 'Junior',
    description: 'Пошук кандидатів на джоб-порталах (Work.ua, Robota.ua, LinkedIn), первинний скринінг резюме, координація співбесід з керівниками підрозділів, ведення бази кандидатів в ATS системі (HURMA / PeopleForce).',
    skills: ['Скринінг резюме', 'ATS системи (HURMA, PeopleForce)', 'LinkedIn пошук', 'Проведення телефонних інтерв\'ю', 'Ділова комунікація'],
    softSkills: ['Психологічна чутливість', 'Вміння слухати', 'Організованість'],
    educationRequirement: 'Психологія, соціологія, філологія, менеджмент',
    englishLevel: 'B1',
    postedDate: '2026-10-02'
  },

  // 10. IT, Software & Artificial Intelligence (IT, веб-розробка та ШІ)
  {
    id: 'vac-it-1',
    title: 'Junior Python / ML Developer (Trainee/Junior)',
    company: 'Genesis Tech',
    industry: 'IT, веб-розробка та ШІ',
    source: 'DOU.ua',
    url: 'https://jobs.dou.ua/vacancies/genesis-python-ml',
    city: 'Київ',
    isRemote: true,
    salaryMin: 32000,
    salaryMax: 48000,
    salaryCurrency: 'UAH',
    experienceLevel: 'Junior',
    description: 'Шукаємо починаючого Python розробника для роботи з алгоритмами машинного навчання, збору та обробки датасетів, парсингу веб-даних за допомогою BeautifulSoup4 та Scrapy, побудови прогнозних моделей на базі PyTorch та scikit-learn.',
    skills: ['Python', 'Machine Learning', 'BeautifulSoup4', 'Pandas', 'NumPy', 'SQL', 'Git', 'scikit-learn', 'PyTorch', 'FastAPI'],
    softSkills: ['Аналітичне мислення', 'Уважність до деталей', 'Командна робота', 'Бажання швидко вчитися'],
    educationRequirement: 'Технічна або математична освіта (студент або випускник)',
    englishLevel: 'B1 (Intermediate)',
    postedDate: '2026-09-28'
  },
  {
    id: 'vac-it-2',
    title: 'Data Analyst / Молодший аналітик даних',
    company: 'Rozetka.ua',
    industry: 'IT, веб-розробка та ШІ',
    source: 'Work.ua',
    url: 'https://www.work.ua/jobs/rozetka-data-analyst',
    city: 'Київ',
    isRemote: true,
    salaryMin: 28000,
    salaryMax: 42000,
    salaryCurrency: 'UAH',
    experienceLevel: 'Junior',
    description: 'В команду аналітики електронної комерції потрібен Junior Data Analyst. Завдання: збір вимог, написання SQL-запитів, побудова інтерактивних дашбордів у Power BI/Tableau, статистичний аналіз поведінки користувачів.',
    skills: ['SQL', 'PostgreSQL', 'Excel / Google Sheets', 'Power BI', 'Python', 'Tableau', 'Статистика', 'A/B тестування'],
    softSkills: ['Критичне мислення', 'Презентаційні навички', 'Ініціативність'],
    educationRequirement: 'Бажано вища (економіка, статистика, кібернетика, прикладна математика)',
    englishLevel: 'A2-B1',
    postedDate: '2026-09-29'
  },
  {
    id: 'vac-it-3',
    title: 'Trainee / Junior Frontend Developer (React, TypeScript)',
    company: 'SoftServe',
    industry: 'IT, веб-розробка та ШІ',
    source: 'DOU.ua',
    url: 'https://jobs.dou.ua/vacancies/softserve-react-junior',
    city: 'Львів',
    isRemote: true,
    salaryMin: 25000,
    salaryMax: 38000,
    salaryCurrency: 'UAH',
    experienceLevel: 'Trainee/No Exp',
    description: 'SoftServe Academy відкриває набір на позицію Trainee Frontend Engineer. Ви навчитесь будувати сучасні веб-додатки з використанням React 19, TypeScript, Tailwind CSS, працювати з REST API та GraphQL.',
    skills: ['JavaScript', 'TypeScript', 'React', 'HTML5', 'CSS3', 'Tailwind CSS', 'Git', 'REST API', 'Figma'],
    softSkills: ['Комунікабельність', 'Тайм-менеджмент', 'Самоорганізація'],
    educationRequirement: 'Розглядаємо учнів випускних класів та студентів з міцною базою',
    englishLevel: 'B1+ (письмова та розмовна)',
    postedDate: '2026-09-30'
  },
  {
    id: 'vac-it-4',
    title: 'Junior QA Engineer (Manual & Basic API Testing)',
    company: 'EPAM Systems',
    industry: 'IT, веб-розробка та ШІ',
    source: 'DOU.ua',
    url: 'https://jobs.dou.ua/vacancies/epam-junior-qa',
    city: 'Харків / Вся Україна',
    isRemote: true,
    salaryMin: 24000,
    salaryMax: 36000,
    salaryCurrency: 'UAH',
    experienceLevel: 'Junior',
    description: 'Тестування функціоналу клієнтських додатків, написання тест-кейсів, складання баг-репортів у Jira, перевірка REST API за допомогою Postman, регресійне тестування перед релізом.',
    skills: ['Теорія тестування', 'Тест-дизайн', 'Jira / Confluence', 'Postman / REST API', 'SQL (SELECT queries)', 'DevTools'],
    softSkills: ['Уважність до дрібниць', 'Терплячість', 'Вміння описувати дефекти'],
    educationRequirement: 'Технічна або суміжна освіта',
    englishLevel: 'B1-B2 (проєктна документація англійською)',
    postedDate: '2026-10-01'
  }
];

// Multi-Industry Career Tracks covering ALL fields of the labor market
export const CAREER_TRACKS = [
  {
    id: 'all',
    title: 'Усі напрямки (Весь ринок праці)',
    category: 'Загальний ринок',
    demandScore: 95,
    status: 'Стабільно високий попит',
    avgSalary: 28500,
    icon: 'Layers',
    schoolSubjects: ['Українська мова', 'Математика', 'Англійська мова', 'Інформатика'],
    description: 'Зведений аналіз усіх професій ринку праці України: продажі, логістика, фінанси, медицина, інженерія, освіта, сервіс та IT.',
    keySkills: ['Комунікація', 'Цифрова грамотність', 'Критичне мислення', 'Excel / Комп\'ютер', 'Командна робота']
  },
  {
    id: 'sales-track',
    title: 'Продажі, робота з клієнтами та акаунтинг',
    category: 'Продажі та клієнти',
    demandScore: 97,
    status: 'Надвисокий попит роботодавців',
    avgSalary: 32000,
    icon: 'Briefcase',
    schoolSubjects: ['Українська мова', 'Іноземна мова', 'Психологія / Суспільствознавство', 'Економіка'],
    description: 'Найбільша кількість відкритих вакансій в Україні. Вміння вести переговори, закривати угоди та утримувати клієнтів затребуване в будь-якому бізнесі.',
    keySkills: ['B2B / B2C продажі', 'CRM системи', 'Переговори', 'Ділове листування', 'Презентація продукту', 'Робота з запереченнями']
  },
  {
    id: 'finance-track',
    title: 'Бухгалтерія, фінанси, аудит та банкінг',
    category: 'Фінанси та облік',
    demandScore: 91,
    status: 'Високий попит',
    avgSalary: 29000,
    icon: 'DollarSign',
    schoolSubjects: ['Математика (Алгебра)', 'Економіка', 'Правознавство', 'Інформатика'],
    description: 'Основа будь-якого підприємства: фінансовий контроль, сплата податків, нарахування заробітних плат, ведення звітності та інвестиційний аналіз.',
    keySkills: ['1С / BAS Бухгалтерія', 'Excel (Advanced)', 'Податкове законодавство', 'Первинна документація', 'Фінансовий аналіз']
  },
  {
    id: 'logistics-track',
    title: 'Логістика, ЗЕД, склад та ланцюги постачання',
    category: 'Логістика та транспорт',
    demandScore: 94,
    status: 'Високий попит',
    avgSalary: 30000,
    icon: 'Truck',
    schoolSubjects: ['Географія', 'Англійська мова', 'Математика', 'Економіка'],
    description: 'Критична галузь для економіки України: координація міжнародних та внутрішніх вантажопотоків, митне оформлення, експедирування.',
    keySkills: ['Транспортна логістика', 'Lardi-Trans / Della', 'CMR / ТТН', 'Митні правила (Інкотермс)', 'WMS системи']
  },
  {
    id: 'medicine-track',
    title: 'Медицина, охорона здоров’я та фармація',
    category: 'Медицина та фармакологія',
    demandScore: 96,
    status: 'Критично високий попит',
    avgSalary: 27000,
    icon: 'HeartPulse',
    schoolSubjects: ['Біологія', 'Хімія', 'Основи здоров’я', 'Латинська мова'],
    description: 'Постійно зростаюча потреба в лікарях, фармацевтах, реабілітологах та медичних сестрах. Стабільна сфера з державною та приватною практикою.',
    keySkills: ['Фармакологія', 'Медичні протоколи', 'Асептика', 'eHealth / Helsi', 'Долікарська допомога', 'Фармацевтична опіка']
  },
  {
    id: 'marketing-track',
    title: 'Маркетинг, SMM, контент та реклама',
    category: 'Маркетинг та медіа',
    demandScore: 89,
    status: 'Високий попит',
    avgSalary: 28000,
    icon: 'Megaphone',
    schoolSubjects: ['Українська мова та література', 'Англійська мова', 'Мистецтво', 'Інформатика'],
    description: 'Залучення уваги аудиторії через цифрові канали: створення вірусного відеоконтенту, робота з інфлюенсерами, таргетована реклама та SEO.',
    keySkills: ['Meta Ads (Facebook/Instagram)', 'CapCut / Відеомонтаж', 'Canva / Photoshop', 'Копірайтинг', 'Google Analytics', 'TikTok']
  },
  {
    id: 'engineering-track',
    title: 'Інженерія, виробництво, енергетика та ЧПК',
    category: 'Інженерія та промисловість',
    demandScore: 95,
    status: 'Дефіцит кваліфікованих кадрів',
    avgSalary: 31000,
    icon: 'Wrench',
    schoolSubjects: ['Фізика (Механіка, Електрика)', 'Геометрія / Креслення', 'Хімія', 'Трудове навчання'],
    description: 'Відновлення інфраструктури, робота на сучасних заводах, конструювання техніки, обслуговування енергомереж та програмування верстатів ЧПК.',
    keySkills: ['AutoCAD / SolidWorks', 'Читання креслень', 'Електробезпека', 'Технічна механіка', 'Верстати з ЧПК', 'Метрологія']
  },
  {
    id: 'education-track',
    title: 'Освіта, репетиторство та онлайн-навчання',
    category: 'Освіта та викладання',
    demandScore: 88,
    status: 'Стабільний попит',
    avgSalary: 25000,
    icon: 'GraduationCap',
    schoolSubjects: ['Профільний шкільний предмет', 'Педагогіка', 'Психологія', 'Українська мова'],
    description: 'Підготовка дітей та школярів до НМТ/ДПА, онлайн-репетиторство з точних та гуманітарних дисциплін, створення інтерактивних навчальних курсів.',
    keySkills: ['Методика викладання', 'Підготовка до НМТ', 'Інтерактивні платформи (Miro, Kahoot)', 'Педагогічна комунікація', 'Zoom']
  },
  {
    id: 'horeca-track',
    title: 'Готельно-ресторанний бізнес, сервіс та HoReCa',
    category: 'HoReCa та сервіс',
    demandScore: 92,
    status: 'Швидкий старт для молоді',
    avgSalary: 24000,
    icon: 'Coffee',
    schoolSubjects: ['Іноземна мова', 'Трудове навчання / Кулінарія', 'Хімія', 'Українська мова'],
    description: 'Ідеальна галузь для першого заробітку учнів та студентів: бариста, адміністратори рецепції, кухарі, помічники шефа.',
    keySkills: ['Приготування кави / лате-арт', 'Касова дисципліна (Poster POS)', 'HACCP стандарти', 'Клієнтоорієнтованість', 'Opera PMS']
  },
  {
    id: 'hr-track',
    title: 'HR, рекрутинг та управління талантами',
    category: 'HR та управління',
    demandScore: 87,
    status: 'Високий попит',
    avgSalary: 27000,
    icon: 'Users',
    schoolSubjects: ['Психологія', 'Українська мова', 'Англійська мова', 'Суспільствознавство'],
    description: 'Пошук людей у компанії, оцінка навичок, проведення перших співбесід, підтримка корпоративної культури та мотивація команди.',
    keySkills: ['Скринінг резюме', 'ATS системи (HURMA, Workable)', 'Проведення інтерв\'ю', 'LinkedIn пошук', 'Трудове право']
  },
  {
    id: 'ai-ml',
    title: 'IT: Штучний інтелект, Python & Data Science',
    category: 'IT та технології',
    demandScore: 98,
    status: 'Дуже високий попит',
    avgSalary: 38000,
    icon: 'Brain',
    schoolSubjects: ['Математика (Алгебра/Аналіз)', 'Інформатика', 'Англійська мова'],
    description: 'Розробка алгоритмів машинного навчання, збір та парсинг датасетів, автоматизація бізнес-процесів за допомогою AI.',
    keySkills: ['Python', 'Machine Learning', 'Pandas', 'BeautifulSoup4', 'SQL', 'Git', 'FastAPI']
  },
  {
    id: 'frontend',
    title: 'IT: Frontend Web Developer (React, JS)',
    category: 'IT та технології',
    demandScore: 89,
    status: 'Високий попит',
    avgSalary: 31000,
    icon: 'Layout',
    schoolSubjects: ['Інформатика', 'Англійська мова', 'Образотворче мистецтво/Дизайн'],
    description: 'Створення візуальної та інтерактивної частини сайтів, порталів та додатків на React і TypeScript.',
    keySkills: ['JavaScript', 'TypeScript', 'React', 'HTML5/CSS3', 'Tailwind CSS', 'Git', 'REST API']
  }
];

export const BEAUTIFUL_SOUP_LESSONS = [
  {
    id: 'intro-bs4',
    title: 'Що таке BeautifulSoup (bs4) та навіщо він потрібен?',
    summary: 'BeautifulSoup — це найпопулярніша бібліотека Python для вилучення даних з файлів HTML та XML. Вона перетворює складний документ веб-сторінки на деревоподібну структуру об’єктів Python.',
    concept: 'Парсинг DOM-дерева (Document Object Model)',
    pythonCode: `# 1. Встановлення бібліотеки в терміналі:
# pip install beautifulsoup4 requests lxml

import requests
from bs4 import BeautifulSoup

# URL з реальними вакансіями (Work.ua)
url = "https://www.work.ua/jobs-kyiv/"

headers = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
}

response = requests.get(url, headers=headers)

# Ініціалізація парсера BeautifulSoup
soup = BeautifulSoup(response.text, 'lxml')

print("Заголовок сторінки:", soup.title.string)`,
    keyPoints: [
      'Дозволяє вилучати вакансії по будь-яких галузях (продажі, медицина, фінанси, інженерія, IT).',
      'Автоматизує роботу дослідника ринку праці, замінюючи ручне копіювання сотень сторінок.',
      'Перетворює неструктурований HTML-код веб-сторінок на структуровану таблицю даних (JSON/CSV).'
    ]
  },
  {
    id: 'find-methods',
    title: 'Методи find() та find_all(): Пошук карток вакансій',
    summary: 'Головні інструменти навігації bs4 — пошук за назвою тегу, CSS-класом або комбінацією атрибутів.',
    concept: 'Пошук за тегами та класами (find vs find_all)',
    pythonCode: `# Знаходимо картку першої вакансії на сторінці
first_job = soup.find('div', class_='job-link')

# Знаходимо ВСІ картки вакансій
job_cards = soup.find_all('div', class_='job-link')

print(f"Знайдено вакансій на сторінці: {len(job_cards)}")

for card in job_cards:
    # Вилучаємо назву посади
    title_elem = card.find('h2')
    title = title_elem.text.strip() if title_elem else "Не вказано"
    
    # Вилучаємо заробітну плату
    salary_elem = card.find('span', class_='salary')
    salary = salary_elem.text.strip() if salary_elem else "Зарплата не вказана"
    
    print(f"Посада: {title} | {salary}")`,
    keyPoints: [
      '`find()` повертає перший знайдений тег або `None`, якщо нічого не знайдено.',
      '`find_all()` повертає список (список `bs4.element.Tag`) усіх відповідних елементів.',
      'Параметр `class_` пишеться з підкресленням, оскільки `class` — зарезервоване ключове слово в Python.'
    ]
  },
  {
    id: 'css-selectors',
    title: 'CSS-селектори: soup.select() та soup.select_one()',
    summary: 'Потужний підхід для точкового пошуку елементів через CSS-синтаксис (.class, #id, вкладеність tag > child).',
    concept: 'Вибірка через CSS Selectors',
    pythonCode: `# Вибірка за допомогою CSS-селекторів
# Знаходимо список бейджів навичок всередині опису
skill_badges = soup.select('div.job-description span.badge-skill')

skills = [badge.get_text(strip=True) for badge in skill_badges]
print(f"Вимагаються скіли: {skills}")

# Вилучення атрибуту посилання (href)
link = soup.select_one('a.vacancy-link')['href']
print(f"Пряме посилання на резюме: {link}")`,
    keyPoints: [
      '`soup.select_one(\'...\')` повертає перший елемент за CSS-селектором.',
      '`soup.select(\'...\')` повертає повний список збігів.',
      'Метод `.get_text(strip=True)` автоматично прибирає зайві пробіли та переноси рядків.'
    ]
  },
  {
    id: 'ml-pipeline',
    title: 'Зв’язок парсингу з Машинним Навчанням (ML Pipeline)',
    summary: 'Як зібрані з сайтів вакансій текстові дані перетворюються на аналітику для профорієнтації учнів за допомогою NLP алгоритмів.',
    concept: 'Екстракція сутностей (NER) та TF-IDF частотний аналіз',
    pythonCode: `from sklearn.feature_extraction.text import TfidfVectorizer
import collections

# Приклад списку сирих вимог, зібраних парсером:
job_descriptions = [
    "Потрібен менеджер з продажу знання CRM переговори B2B Excel",
    "Шукаємо асистента бухгалтера 1С BAS податки первинна документація",
    "Логіст транспортні перевезення Lardi CMR автоперевезення",
]

# Рахуємо найчастіші скіли для профорієнтації учнів:
words = [w for text in job_descriptions for w in text.split()]
counter = collections.Counter(words)

print("ТОП навичок ринку праці:")
for skill, count in counter.most_common(5):
    print(f"- {skill}: згадується у {count} вакансіях")`,
    keyPoints: [
      '1. Парсер bs4 збирає HTML сторінки та вилучає чистий текст.',
      '2. Модуль NLP очищає стоп-слова, лематизує та виявляє Hard / Soft skills.',
      '3. ML алгоритми кластеризують професії та прогнозують тренди росту на 3-5 років.',
      '4. Інформаційна система формує персональні поради для учнів шкіл.'
    ]
  }
];
