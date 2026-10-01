import { Vacancy } from '../types/job';

export const INITIAL_VACANCIES: Vacancy[] = [
  {
    id: 'vac-1',
    title: 'Junior Python / ML Developer (Trainee/Junior)',
    company: 'Genesis Tech',
    source: 'DOU.ua',
    url: 'https://jobs.dou.ua/vacancies/genesis-python-ml',
    city: 'Київ',
    isRemote: true,
    salaryMin: 32000,
    salaryMax: 48000,
    salaryCurrency: 'UAH',
    experienceLevel: 'Junior',
    description: 'Шукаємо починаючого Python розробника для роботи з алгоритмами машинного навчання, збору та обробки датасетів, парсингу веб-даних за допомогою BeautifulSoup4 та Scrapy, побудови прогнозних моделей на базі PyTorch та scikit-learn. Обов’язкове розуміння базової математики та алгоритмів.',
    skills: ['Python', 'Machine Learning', 'BeautifulSoup4', 'Pandas', 'NumPy', 'SQL', 'Git', 'scikit-learn', 'PyTorch', 'FastAPI'],
    softSkills: ['Аналітичне мислення', 'Уважність до деталей', 'Командна робота', 'Бажання швидко вчитися'],
    educationRequirement: 'Технічна або математична освіта (студент або випускник)',
    englishLevel: 'B1 (Intermediate)',
    postedDate: '2026-09-28'
  },
  {
    id: 'vac-2',
    title: 'Data Analyst / Молодший аналітик даних',
    company: 'Rozetka.ua',
    source: 'Work.ua',
    url: 'https://www.work.ua/jobs/rozetka-data-analyst',
    city: 'Київ',
    isRemote: true,
    salaryMin: 28000,
    salaryMax: 42000,
    salaryCurrency: 'UAH',
    experienceLevel: 'Junior',
    description: 'В команду аналітики електронної комерції потрібен Junior Data Analyst. Завдання: збір вимог, написання SQL-запитів, побудова інтерактивних дашбордів у Power BI/Tableau, статистичний аналіз поведінки користувачів, робота з Python для автоматизації рутинних звітів.',
    skills: ['SQL', 'PostgreSQL', 'Excel / Google Sheets', 'Power BI', 'Python', 'Tableau', 'Статистика', 'A/B тестування'],
    softSkills: ['Критичне мислення', 'Презентаційні навички', 'Ініціативність'],
    educationRequirement: 'Бажано вища (економіка, статистика, кібернетика, прикладна математика)',
    englishLevel: 'A2-B1',
    postedDate: '2026-09-29'
  },
  {
    id: 'vac-3',
    title: 'Trainee / Junior Frontend Developer (React, TypeScript)',
    company: 'SoftServe',
    source: 'DOU.ua',
    url: 'https://jobs.dou.ua/vacancies/softserve-react-junior',
    city: 'Львів',
    isRemote: true,
    salaryMin: 25000,
    salaryMax: 38000,
    salaryCurrency: 'UAH',
    experienceLevel: 'Trainee/No Exp',
    description: 'SoftServe Academy відкриває набір на позицію Trainee Frontend Engineer. Ви навчитесь будувати сучасні веб-додатки з використанням React 19, TypeScript, Tailwind CSS, працювати з REST API та GraphQL, писати юніт-тести та взаємодіяти в Agile команді за методологією Scrum.',
    skills: ['JavaScript', 'TypeScript', 'React', 'HTML5', 'CSS3', 'Tailwind CSS', 'Git', 'REST API', 'Figma'],
    softSkills: ['Комунікабельність', 'Тайм-менеджмент', 'Самоорганізація'],
    educationRequirement: 'Розглядаємо учнів випускних класів та студентів з міцною базою',
    englishLevel: 'B1+ (письмова та розмовна)',
    postedDate: '2026-09-30'
  },
  {
    id: 'vac-4',
    title: 'Junior Cyber Security Analyst (SOC Tier 1)',
    company: 'Ciklum',
    source: 'Djinni',
    url: 'https://djinni.co/jobs/ciklum-cybersecurity-soc',
    city: 'Київ',
    isRemote: true,
    salaryMin: 35000,
    salaryMax: 55000,
    salaryCurrency: 'UAH',
    experienceLevel: 'Junior',
    description: 'Моніторинг інцидентів кібербезпеки в цілодобовому Security Operations Center (SOC). Аналіз логів SIEM-систем, виявлення підозрілої активності, розуміння мережевих протоколів (TCP/IP, DNS, HTTP/HTTPS), базові навички скриптингу на Python або Bash для аналізу атак.',
    skills: ['Cybersecurity', 'Мережеві протоколи TCP/IP', 'Linux', 'SIEM (Splunk/Elastic)', 'Wireshark', 'Python (скриптинг)', 'Bash', 'OSINT'],
    softSkills: ['Стресостійкість', 'Висока концентрація', 'Відповідальність'],
    educationRequirement: 'Технічна освіта в сфері інформаційної безпеки або комп’ютерних наук',
    englishLevel: 'B2 (Upper-Intermediate)',
    postedDate: '2026-09-27'
  },
  {
    id: 'vac-5',
    title: 'Junior AI & Prompt Engineer / AI Тьютор',
    company: 'Preply',
    source: 'Robota.ua',
    url: 'https://robota.ua/company/preply-ai-prompt',
    city: 'Київ',
    isRemote: true,
    salaryMin: 30000,
    salaryMax: 45000,
    salaryCurrency: 'UAH',
    experienceLevel: 'Junior',
    description: 'Створення та оптимізація промптів для мовних моделей (LLM, Gemini, Claude, GPT), тестування відповідей, розмітка даних для Fine-tuning, розробка інтерактивних навчальних сценаріїв для студентів платформи. Ідеальний старт для людини з комбінацією лінгвістики та цифрових навичок.',
    skills: ['Prompt Engineering', 'Generative AI', 'LLM evaluation', 'Python (базовий)', 'JSON', 'Текстова розмітка', 'Google Sheets'],
    softSkills: ['Креативність', 'Грамотна мова', 'Логіка', 'Уважність'],
    educationRequirement: 'Будь-яка вища/незакінчена вища освіта, розглядаємо талановиту молодь',
    englishLevel: 'B2-C1 (вільна англійська обов’язкова)',
    postedDate: '2026-09-29'
  },
  {
    id: 'vac-6',
    title: 'Junior UI/UX & Web Designer',
    company: 'Grammarly Inc.',
    source: 'DOU.ua',
    url: 'https://jobs.dou.ua/vacancies/grammarly-junior-uiux',
    city: 'Київ',
    isRemote: true,
    salaryMin: 32000,
    salaryMax: 50000,
    salaryCurrency: 'UAH',
    experienceLevel: 'Junior',
    description: 'Створення користувацьких інтерфейсів веб- та мобільних сервісів, проведення юзабіліті-досліджень, прототипування у Figma, підготовка дизайн-систем, базове розуміння HTML/CSS та обмежень фронтенд-розробки.',
    skills: ['Figma', 'UI/UX Design', 'Wireframing', 'Design Systems', 'User Research', 'HTML/CSS basics', 'Adobe Creative Suite'],
    softSkills: ['Емпатія', 'Креативне мислення', 'Вміння сприймати зворотний зв’язок'],
    educationRequirement: 'Портфоліо навчальних або реальних робіт',
    englishLevel: 'B1-B2',
    postedDate: '2026-09-26'
  },
  {
    id: 'vac-7',
    title: 'Trainee / Junior QA Engineer (Manual & Intro to Automation)',
    company: 'EPAM Systems',
    source: 'Work.ua',
    url: 'https://www.work.ua/jobs/epam-junior-qa',
    city: 'Дніпро',
    isRemote: true,
    salaryMin: 20000,
    salaryMax: 32000,
    salaryCurrency: 'UAH',
    experienceLevel: 'Trainee/No Exp',
    description: 'Тестування програмного забезпечення, складання тест-планів, тест-кейсів, репортів про баги у Jira. Ознайомлення з базовою автоматизацією на Postman (API testing) та Python/Selenium. Підтримка ментора під час всього випробувального терміну.',
    skills: ['Тестування ПЗ', 'Тест-дизайн', 'Jira', 'Postman', 'API REST', 'SQL basics', 'DevTools', 'Selenium basics'],
    softSkills: ['Прискіпливість', 'Логіка', 'Посидючість', 'Чіткість викладу думок'],
    educationRequirement: 'Технічна або природнича освіта буде плюсом',
    englishLevel: 'B1',
    postedDate: '2026-09-30'
  },
  {
    id: 'vac-8',
    title: 'Junior DevOps / Cloud Infrastructure Intern',
    company: 'MacPaw',
    source: 'Djinni',
    url: 'https://djinni.co/jobs/macpaw-devops-intern',
    city: 'Київ',
    isRemote: false,
    salaryMin: 35000,
    salaryMax: 50000,
    salaryCurrency: 'UAH',
    experienceLevel: 'Junior',
    description: 'Автоматизація збірки та деплою сервісів (CI/CD), контейнеризація за допомогою Docker, розгортання в хмарі AWS / Google Cloud, базовий моніторинг серверів (Prometheus/Grafana), написання скриптів на Bash та Python.',
    skills: ['Linux', 'Docker', 'Bash', 'Git', 'CI/CD (GitHub Actions/GitLab)', 'AWS / GCP basics', 'Python', 'Networking'],
    softSkills: ['Прагнення автоматизувати все рутинне', 'Швидке вирішення проблем', 'Командність'],
    educationRequirement: 'Студент профільних технічних спеціальностей',
    englishLevel: 'B1+',
    postedDate: '2026-09-25'
  },
  {
    id: 'vac-9',
    title: 'Молодший фахівець з робототехніки та IoT (Embedded C/C++)',
    company: 'Ajax Systems',
    source: 'Work.ua',
    url: 'https://www.work.ua/jobs/ajax-systems-embedded',
    city: 'Київ',
    isRemote: false,
    salaryMin: 35000,
    salaryMax: 52000,
    salaryCurrency: 'UAH',
    experienceLevel: 'Junior',
    description: 'Розробка вбудованого мікропрограмного забезпечення (firmware) для розумних охоронних датчиків. Робота з мікроконтролерами STM32/ESP32, протоколами зв’язку UART, SPI, I2C, читання електричних схем, програмування мовою C/C++.',
    skills: ['C', 'C++', 'STM32 / ESP32', 'Мікроконтролери', 'UART / SPI / I2C', 'Осцилограф / Тестер', 'Git', 'Схемотехніка'],
    softSkills: ['Інженерний склад розуму', 'Точність', 'Любов до фізичного "заліза"'],
    educationRequirement: 'Радіоелектроніка, приладобудування, комп’ютерна інженерія',
    englishLevel: 'A2 (читання технічної документації)',
    postedDate: '2026-09-28'
  },
  {
    id: 'vac-10',
    title: 'Junior Mobile Developer (Flutter / Dart)',
    company: 'Genesis (BetterMe)',
    source: 'DOU.ua',
    url: 'https://jobs.dou.ua/vacancies/betterme-flutter-junior',
    city: 'Київ',
    isRemote: true,
    salaryMin: 32000,
    salaryMax: 48000,
    salaryCurrency: 'UAH',
    experienceLevel: 'Junior',
    description: 'Розробка кросплатформних мобільних додатків для здоров’я та фітнесу з мільйонами користувачів по всьому світу. Використання Flutter та Dart, робота з анімаціями, взаємодія з бекенд API, архітектурний патерн BLoC.',
    skills: ['Flutter', 'Dart', 'BLoC / Provider', 'REST API', 'Git', 'UI Animations', 'Mobile UX', 'App Store / Google Play'],
    softSkills: ['Енергійність', 'Фокус на результаті', 'Орієнтація на користувача'],
    educationRequirement: 'Технічна освіта або якісні курси з готовим додатком у портфоліо',
    englishLevel: 'B1-B2',
    postedDate: '2026-09-29'
  },
  {
    id: 'vac-11',
    title: 'Python Web Scraper / Інженер парсингу даних (BS4 & Scrapy)',
    company: 'DataMetrics UA',
    source: 'Robota.ua',
    url: 'https://robota.ua/company/datametrics-scraper',
    city: 'Харків',
    isRemote: true,
    salaryMin: 30000,
    salaryMax: 45000,
    salaryCurrency: 'UAH',
    experienceLevel: 'Junior',
    description: 'Парсинг сайтів з вакансіями, e-commerce та прайс-агрегаторів. Робота з бібліотеками BeautifulSoup4 (bs4), Requests, Selenium, Playwright. Обхід анти-бот систем, робота з проксі, парсинг JavaScript рендерингу, очистка тексту та експорт у PostgreSQL та CSV.',
    skills: ['Python', 'BeautifulSoup4', 'Requests', 'Selenium / Playwright', 'CSS Selectors / XPath', 'PostgreSQL', 'Regex (регулярні вирази)', 'Pandas'],
    softSkills: ['Терплячість при налагодженні', 'Аналітичні здібності'],
    educationRequirement: 'Не має значення, головне вміння парсити складні сайти',
    englishLevel: 'A2-B1',
    postedDate: '2026-09-30'
  },
  {
    id: 'vac-12',
    title: 'Junior Digital Marketer / SEO & Web Analytics',
    company: 'Prom.ua / EVO',
    source: 'Work.ua',
    url: 'https://www.work.ua/jobs/evo-junior-marketer',
    city: 'Київ',
    isRemote: true,
    salaryMin: 22000,
    salaryMax: 35000,
    salaryCurrency: 'UAH',
    experienceLevel: 'Junior',
    description: 'Оптимізація сайтів для пошукових систем, аналіз ключових слів, налаштування веб-аналітики Google Analytics 4, створення звітів, парсинг конкурентних цін та аналіз трендів попиту споживачів.',
    skills: ['SEO', 'Google Analytics 4', 'Ahrefs / Serpstat', 'Google Search Console', 'Копірайтинг', 'Базовий HTML', 'Excel'],
    softSkills: ['Комунікабельність', 'Уважність', 'Креативність'],
    educationRequirement: 'Маркетинг, журналістика, філологія або економіка',
    englishLevel: 'B1',
    postedDate: '2026-09-27'
  }
];

export const CAREER_TRACKS = [
  {
    id: 'ai-ml',
    title: 'AI & Machine Learning (Штучний інтелект)',
    category: 'ШІ та Розумні системи',
    demandScore: 98,
    status: 'Дуже високий попит',
    avgSalary: 42000,
    icon: 'Brain',
    schoolSubjects: ['Математика (Алгебра/Початки аналізу)', 'Інформатика', 'Англійська мова'],
    description: 'Розробка нейромереж, комп’ютерного зору, генеративного ШІ та парсингу великих масивів даних. Найшвидше зростаюча галузь у світі.',
    keySkills: ['Python', 'Machine Learning', 'Pandas', 'BeautifulSoup4', 'SQL', 'Git', 'PyTorch', 'Math & Statistics']
  },
  {
    id: 'cybersecurity',
    title: 'Кібербезпека та Захист Інформації',
    category: 'Безпека та Мережі',
    demandScore: 96,
    status: 'Дуже високий попит',
    avgSalary: 45000,
    icon: 'Shield',
    schoolSubjects: ['Інформатика', 'Фізика', 'Англійська мова', 'Правознавство'],
    description: 'Захист державних систем, банків, військових технологій та комерційних платформ від кібератак. Критична професія для України.',
    keySkills: ['Мережеві протоколи', 'Linux', 'Python / Bash', 'SIEM', 'Криптографія', 'Аналіз логів', 'OSINT']
  },
  {
    id: 'data-analytics',
    title: 'Data Analyst (Аналітик даних)',
    category: 'Аналітика та Бізнес',
    demandScore: 92,
    status: 'Високий попит',
    avgSalary: 35000,
    icon: 'BarChart3',
    schoolSubjects: ['Математика / Статистика', 'Економіка', 'Інформатика'],
    description: 'Перетворення сирих цифр та таблиць на цінні бізнес-рішення, дашборди та прогнози розвитку компаній.',
    keySkills: ['SQL', 'Power BI / Tableau', 'Python', 'Excel (Advanced)', 'Статистика', 'A/B тестування']
  },
  {
    id: 'frontend',
    title: 'Frontend Web Developer',
    category: 'Веб-розробка',
    demandScore: 88,
    status: 'Високий попит',
    avgSalary: 32000,
    icon: 'Layout',
    schoolSubjects: ['Інформатика', 'Англійська мова', 'Образотворче мистецтво/Дизайн'],
    description: 'Створення візуальної та інтерактивної частини сайтів та додатків, якою безпосередньо користуються мільйони людей.',
    keySkills: ['JavaScript', 'TypeScript', 'React', 'HTML5/CSS3', 'Tailwind CSS', 'Git', 'REST API']
  },
  {
    id: 'robotics',
    title: 'Робототехніка та Безпілотні Системи (IoT / Embedded)',
    category: 'Інженерія та Hardware',
    demandScore: 95,
    status: 'Дуже високий попит',
    avgSalary: 43000,
    icon: 'Cpu',
    schoolSubjects: ['Фізика (Електрика)', 'Математика', 'Інформатика', 'Трудове навчання/Моделювання'],
    description: 'Програмування мікроконтролерів, створення дронів, систем безпеки, розумного дому та роботизованих виробництв.',
    keySkills: ['C / C++', 'STM32 / Arduino / ESP32', 'Схемотехніка', 'Радіоелектроніка', 'Linux', 'Python']
  },
  {
    id: 'ui-ux',
    title: 'UI/UX & Product Designer',
    category: 'Дизайн та Креатив',
    demandScore: 85,
    status: 'Помірний попит',
    avgSalary: 38000,
    icon: 'Palette',
    schoolSubjects: ['Мистецтво/Креслення', 'Психологія/Людина і світ', 'Інформатика'],
    description: 'Проєктування зручних, естетичних та зрозумілих інтерфейсів мобільних додатків і сайтів на основі психології поведінки людей.',
    keySkills: ['Figma', 'UI/UX Design', 'User Research', 'Прототипування', 'Design Systems', 'Базовий HTML/CSS']
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

# Отримуємо HTML-код сторінки вакансій
headers = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
}
response = requests.get('https://www.work.ua/jobs-python/', headers=headers)

# Створюємо об'єкт BeautifulSoup
soup = BeautifulSoup(response.text, 'html.parser')
print(f"Заголовок сторінки: {soup.title.text}")`,
    keyPoints: [
      'Використовуйте коректні HTTP заголовки (User-Agent), щоб сайти не блокували ваші запити.',
      'Парсер `html.parser` вже вбудований у Python, а `lxml` забезпечує максимальну швидкість обробки.',
      'Об’єкт `soup` дозволяє здійснювати навігацію, пошук і модифікацію дерева тегів.'
    ]
  },
  {
    id: 'find-methods',
    title: 'Методи пошуку: soup.find() та soup.find_all()',
    summary: 'Головні методи для пошуку тегів у розмітці вакансій: знаходження першого елемента чи списку всіх елементів за класом, ідентифікатором або атрибутами.',
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
    "Потрібен Python розробник знання SQL Git Docker FastAPI",
    "Шукаємо Data Scientist Python Pandas Machine Learning SQL",
    "Junior Backend Python PostgreSQL Git REST API Docker",
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
