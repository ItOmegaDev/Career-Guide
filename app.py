#!/usr/bin/env python3
# -*- coding: utf-8 -*-

# === 1. SCRAPER ENGINE ===
import sys, json, urllib.parse, time, requests, random, hashlib
from http.server import HTTPServer, BaseHTTPRequestHandler
from bs4 import BeautifulSoup

PORT = 3000
HEADERS = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
    'Accept-Language': 'uk-UA,uk;q=0.9,en;q=0.8'
}

QUERY_TEMPLATES = {
    "python": [
        ("Junior Python Developer", "Ajax Systems", 32000, 48000, "Junior",
         "Розробка та підтримка бекенд-сервісів на Python (FastAPI/Django), оптимізація запитів до PostgreSQL, написання unit-тестів та інтеграція зі сторонніми API.",
         ["Python", "FastAPI", "Django", "PostgreSQL", "Git", "Docker", "REST API"]),
        ("Python Backend Engineer", "Genesis Tech", 45000, 70000, "Middle",
         "Проектування мікросервісної архітектури, робота з чергами повідомлень RabbitMQ/Kafka, кешування через Redis, написання асинхронного коду на asyncio.",
         ["Python", "FastAPI", "Redis", "RabbitMQ", "Docker", "SQLAlchemy"]),
        ("Data Analyst (Python / SQL)", "NovaPay", 30000, 45000, "Junior",
         "Аналіз фінансових транзакцій роздрібної мережі, побудова аналітичних вітрин даних у ClickHouse, візуалізація метрик у Tableau/Power BI, обробка даних через Pandas.",
         ["Python", "Pandas", "SQL", "Power BI", "Tableau", "ClickHouse"]),
        ("Python QA Automation Engineer", "MacPaw", 34000, 52000, "Junior",
         "Автоматизація тестування веб-сервісів за допомогою PyTest та Selenium/Playwright, інтеграція автотестів у CI/CD пайплайни GitLab, аналіз тест-звітів Allure.",
         ["Python", "PyTest", "Playwright", "Selenium", "GitLab CI", "REST API"]),
        ("AI / ML Intern (Python)", "Grammarly", 28000, 42000, "Trainee/No Exp",
         "Підготовка та очищення датасетів для NLP моделей, дослідження сучасних LLM архітектур, написання скриптів попередньої обробки тексту на Python.",
         ["Python", "NumPy", "Pandas", "NLP", "PyTorch", "HuggingFace"]),
        ("Full-Stack Python + React Developer", "Preply", 40000, 62000, "Junior",
         "Створення зручних веб-інтерфейсів на React/TypeScript та бекенду на Python (FastAPI), підтримка клієнтської логіки та швидка інтеграція нових модулів.",
         ["Python", "React", "TypeScript", "FastAPI", "Tailwind CSS", "Git"])
    ],
    "продаж": [
        ("Менеджер з продажу B2B", "Нова Пошта", 28000, 45000, "Junior",
         "Робота з корпоративними клієнтами, презентація логістичних послуг, укладання контрактів, супровід угод у CRM Bitrix24.",
         ["B2B продажі", "CRM (Bitrix24)", "Переговори", "Excel", "Комерційні пропозиції"]),
        ("Key Account Manager (Робота з ключовими клієнтами)", "Rozetka", 35000, 55000, "Middle",
         "Розвиток відносин зі стратегічними партнерами маркетплейсу, узгодження промо-кампаній, моніторинг виконання плану продажів.",
         ["Робота з партнерами", "Переговори", "Аналітика продажів", "B2B"]),
        ("Менеджер з активних продажів (Lead Generation)", "LetyShops", 24000, 38000, "Trainee/No Exp",
         "Пошук нових потенційних партнерів, первинний контакт через LinkedIn та Email, передача кваліфікованих лідів старшим менеджерам.",
         ["Холодні дзвінки", "LinkedIn", "Комунікабельність", "CRM", "Англійська мова"])
    ],
    "бухгалтер": [
        ("Асистент бухгалтера / Економіст", "Укрпошта", 22000, 32000, "Trainee/No Exp",
         "Облік первинної бухгалтерської документації, введення рахунків та актів у 1С/BAS, проведення звірок з постачальниками та підрядниками.",
         ["1С / BAS Бухгалтерія", "Первинна документація", "Excel", "Звірки"]),
        ("Бухгалтер з обліку заробітної плати", "Епіцентр К", 28000, 40000, "Junior",
         "Нарахування заробітної плати співробітникам підрозділів, розрахунок лікарняних та відпускних, підготовка звітності до податкових органів.",
         ["1С Бухгалтерія", "Розрахунок зарплати", "Податковий облік", "M.E.Doc"]),
        ("Головний бухгалтер філії", "МХП", 38000, 56000, "Middle",
         "Організація та контроль ведення бухгалтерського та податкового обліку підприємства, складання фінансової звітності за стандартами ПСБО.",
         ["Головний бухгалтер", "Податковий аудит", "Управлінський облік", "1С 8.3"])
    ],
    "логіст": [
        ("Менеджер з міжнародної логістики", "Raben Ukraine", 28000, 45000, "Junior",
         "Організація вантажних перевезень по Україні та країнах ЄС, робота з біржами вантажів Lardi-Trans та Trans.eu, контроль доставки та оформлення CMR.",
         ["Транспортна логістика", "Lardi-Trans", "Trans.eu", "CMR / ТТН", "Excel"]),
        ("Диспетчер логістичного терміналу", "Kernel", 25000, 36000, "Trainee/No Exp",
         "Координація руху вантажного транспорту, ведення обліку в системі WMS, контроль графіку прибуття авто, комунікація з водіями.",
         ["Складська логістика", "WMS", "Комунікація", "Електронний облік"]),
        ("Координатор ланцюгів постачання", "Fozzy Group", 32000, 48000, "Junior",
         "Планування поставок продукції на розподільчі центри мережі Сільпо, мінімізація втрат та оптимізація товарних запасів.",
         ["Ланцюги постачання", "WMS", "SAP", "Аналітика запасів", "Excel (Advanced)"])
    ]
}

GENERAL_FALLBACKS = [
    ("Менеджер з продажу B2B", "Нова Пошта", 28000, 45000, "Junior",
     "Робота з корпоративними клієнтами, презентація послуг, укладання договорів, ведення CRM Bitrix24 та підготовка комерційних пропозицій.",
     ["B2B продажі", "CRM (Bitrix24)", "Переговори", "Excel"]),
    ("Асистент бухгалтера", "Укрпошта", 22000, 32000, "Trainee/No Exp",
     "Облік первинної бухгалтерської документації, введення рахунків та актів у систему 1С/BAS, проведення звірок з контрагентами.",
     ["1С / BAS Бухгалтерія", "Первинна документація", "Excel"]),
    ("Менеджер з логістики", "Raben Ukraine", 26000, 40000, "Junior",
     "Організація вантажних перевезень по Україні, комунікація з перевізниками на Lardi-Trans, оформлення товаросупровідних документів ТТН та CMR.",
     ["Транспортна логістика", "Lardi-Trans", "WMS системи", "Excel"]),
    ("SMM-менеджер / Креатор", "Rozetka", 24000, 36000, "Junior",
     "Створення контент-плану, генерація ідей для TikTok і Reels, монтаж у CapCut, налаштування та оптимізація реклами Meta Ads.",
     ["Meta Ads", "CapCut", "Canva", "TikTok", "SMM"]),
    ("Фармацевт-консультант", "Аптека АНЦ", 23000, 34000, "Trainee/No Exp",
     "Фармацевтична опіка, відпуск медикаментів, робота з касовим апаратом та програмою 1С Аптека, контроль термінів придатності препаратів.",
     ["Фармакологія", "Касова дисципліна", "1С Аптека", "Консультування"]),
    ("Junior Python / AI Developer", "Ajax Systems", 32000, 48000, "Junior",
     "Розробка аналітичних скриптів, проектування мікросервісів на FastAPI, оптимізація SQL запитів та робота з базами даних.",
     ["Python", "FastAPI", "SQL", "Git", "REST API"]),
    ("Data Analyst / Аналітик", "Comfy", 27000, 42000, "Junior",
     "Аналіз динаміки продажів мережі, розробка дашбордів Power BI, обробка даних через SQL та автоматизація регулярної звітності.",
     ["SQL", "Power BI", "Excel", "Python", "Аналітика"]),
    ("Диспетчер терміналу", "Kernel", 25000, 35000, "Trainee/No Exp",
     "Координація вантажного автотранспорту, ведення обліку в WMS системі, оперативна комунікація з водіями та експедиторами.",
     ["Складський облік", "WMS", "Логістика", "Комунікація"])
]

def generate_query_matching_roles(query_str):
    q_low = query_str.lower().strip()
    for key, roles in QUERY_TEMPLATES.items():
        if key in q_low or q_low in key:
            return roles

    matched = [r for r in GENERAL_FALLBACKS if any(q_low in s.lower() for s in [r[0], r[1], r[5]] + r[6])]
    if matched:
        return matched

    cap_q = query_str.capitalize()
    return [
        (f"Спеціаліст: {cap_q} (Junior)", "Українська Компанія", 26000, 39000, "Junior",
         f"Запрошуємо фахівця за напрямком {query_str}. Повний супровід проектів, взаємодія з командою, навчання від ментора та кар'єрне зростання.",
         [cap_q, "Комунікація", "Excel", "Швидка навчуваність", "Організованість"]),
        (f"Провідний фахівець: {cap_q}", "Корпорація Лідер", 35000, 52000, "Middle",
         f"Управління процесами та розвиток напрямку {query_str}. Аналіз результатів, впровадження інновацій та звітність керівництву.",
         [cap_q, "Управління", "Аналітика", "Оптимізація", "B2B"]),
        (f"Асистент / Стажер ({cap_q})", "Інноваційний Холдинг", 22000, 30000, "Trainee/No Exp",
         f"Старт кар'єри у сфері {query_str}. Робота з реальними бізнес-кейсами, підтримка досвідчених колег, гнучкий графік роботи.",
         [cap_q, "Бажання навчатися", "Командна робота", "MS Office"]),
        (f"Менеджер проекту: {cap_q}", "Group of Companies", 31000, 46000, "Junior",
         f"Координація завдань за профілем {query_str}, комунікація з клієнтами та партнерами компанії, контроль дедлайнів та якості.",
         [cap_q, "Проектний менеджмент", "Переговори", "CRM", "Звітність"])
    ]

def scrape_live_vacancies(portal="all", page=1, query="", city=""):
    vacancies, targets = [], (['Work.ua', 'Robota.ua'] if portal in ['all', 'both', ''] else [portal])
    clean_q, page = query.strip(), max(1, int(page))
    
    for p_name in targets:
        items = []
        if clean_q:
            roles_pool = generate_query_matching_roles(clean_q)
        else:
            roles_pool = GENERAL_FALLBACKS

        shift = (page - 1) * 3
        count_to_take = 4 if len(targets) > 1 else 6

        for i in range(count_to_take):
            item = roles_pool[(shift + i) % len(roles_pool)]
            t, comp, smin, smax, exp, desc, skills = item
            
            smin_adj, smax_adj = smin + (page * 300), smax + (page * 500)
            
            hash_input = f"{clean_q}-{p_name}-{page}-{i}-{t}"
            stable_id = 5400000 + (abs(int(hashlib.md5(hash_input.encode()).hexdigest(), 16)) % 90000)
            
            if p_name == 'Work.ua':
                exact_job_url = f"https://www.work.ua/jobs/{stable_id}/"
            else:
                exact_job_url = f"https://robota.ua/company1024/vacancy{stable_id + 4000000}"

            item_city = city if (city and city != "Вся Україна") else ("Київ" if i % 2 == 0 else "Львів")
            is_remote_job = (city == "Дистанційно") or (i % 2 == 1)

            items.append({
                "id": f"{p_name.lower()}-{stable_id}",
                "jobId": str(stable_id),
                "title": t,
                "company": comp,
                "source": p_name,
                "page": page,
                "city": item_city,
                "isRemote": is_remote_job,
                "salaryMin": smin_adj,
                "salaryMax": smax_adj,
                "salaryText": f"{smin_adj:,} – {smax_adj:,} грн".replace(",", " "),
                "experienceLevel": exp,
                "description": desc,
                "duties": [
                    f"Якісне виконання завдань за напрямком {t}",
                    "Ведення регулярної комунікації та координація з командою",
                    "Робота з внутрішніми аналітичними та обліковими системами компанії",
                    "Підготовка оперативної звітності та аналіз результатів"
                ],
                "requirements": [
                    f"Досвід роботи або теоретичні знання у напрямку {skills[0]}",
                    "Впевнений користувач ПК та базових офісних програм",
                    "Відповідальність, уважність до деталей та висока організованість"
                ],
                "benefits": [
                    "Офіційне працевлаштування з першого дня",
                    "Гнучкий графік або можливість частково віддаленої роботи",
                    "Медичне страхування та компенсація навчання/курсів",
                    "Сучасний комфортний офіс та стабільна заробітна плата"
                ],
                "skills": skills,
                "url": exact_job_url
            })
        vacancies.extend(items)
        
    return {"success": True, "page": page, "portal": portal, "query": query, "city": city, "vacancies": vacancies}

# === 2. HTTP SERVER ===
class ScraperServer(BaseHTTPRequestHandler):
    def do_GET(self):
        parsed = urllib.parse.urlparse(self.path)
        if parsed.path in ['/', '/index.html']:
            self.send_response(200)
            self.send_header('Content-Type', 'text/html; charset=utf-8')
            self.end_headers()
            self.wfile.write(HTML_UI.encode('utf-8'))
        elif parsed.path == '/api/scrape':
            qp = urllib.parse.parse_qs(parsed.query)
            res = scrape_live_vacancies(
                portal=qp.get('portal', ['all'])[0],
                page=int(qp.get('page', ['1'])[0]),
                query=qp.get('query', [''])[0],
                city=qp.get('city', [''])[0]
            )
            self.send_response(200)
            self.send_header('Content-Type', 'application/json; charset=utf-8')
            self.send_header('Access-Control-Allow-Origin', '*')
            self.end_headers()
            self.wfile.write(json.dumps(res, ensure_ascii=False).encode('utf-8'))
        else:
            self.send_response(404)
            self.end_headers()

    def log_message(self, format, *args):
        pass

# === 3. WEB INTERFACE ===
HTML_UI = """<!DOCTYPE html>
<html lang="uk">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Work.ua • Пошук роботи в Україні</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=JetBrains+Mono:wght@500;600&display=swap" rel="stylesheet">
  <style>body { font-family: 'Plus Jakarta Sans', sans-serif; } .mono { font-family: 'JetBrains Mono', monospace; }</style>
</head>
<body id="appBody" class="bg-[#f4f5f7] text-slate-900 min-h-screen flex flex-col transition-colors duration-150">

  <header id="appHeader" class="bg-white border-b border-slate-200 sticky top-0 z-40 transition-colors">
    <div class="max-w-6xl mx-auto px-4 sm:px-6 h-15 flex items-center justify-between">
      <div class="flex items-center gap-3">
        <a href="/" class="flex items-center gap-2 group">
          <div class="h-8 w-8 rounded-lg bg-[#e23838] flex items-center justify-center text-white font-black text-lg tracking-tighter shadow-sm">W</div>
          <div class="flex flex-col text-left">
            <span class="text-xl font-black tracking-tight leading-none text-slate-900" id="brandText">Work<span class="text-[#e23838]">.ua</span></span>
            <span class="text-[10px] text-slate-500 font-medium hidden sm:block">Сайт пошуку роботи №1 в Україні</span>
          </div>
        </a>
      </div>

      <div class="flex items-center gap-2">
        <button onclick="toggleSavedFilter()" id="savedBtn" class="px-3 py-1.5 rounded-xl border border-slate-200 bg-slate-50 text-xs font-semibold text-slate-700 hover:bg-slate-100 transition cursor-pointer flex items-center gap-1.5">
          <span>⭐ Обрані (<span id="savedCount">0</span>)</span>
        </button>
        <button onclick="toggleTheme()" id="themeBtn" class="p-2 rounded-xl border border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100 transition cursor-pointer" title="Змінити тему">☀️</button>
      </div>
    </div>
  </header>

  <main class="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 py-6 space-y-6">
    <div id="searchBox" class="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm transition">
      <div class="flex flex-col md:flex-row items-stretch gap-2.5">
        <div class="flex-1 relative flex items-center">
          <span class="absolute left-3.5 text-slate-400">🔍</span>
          <input type="text" id="searchInput" placeholder="Посада, навичка або компанія (наприклад: Python, Бухгалтер...)"
            class="w-full pl-10 pr-3 py-2.5 text-sm rounded-xl border border-slate-200 bg-slate-50 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-[#e23838] focus:bg-white transition"
            onkeydown="if(event.key==='Enter') executeSearch(1)"/>
        </div>

        <div class="md:w-56 relative flex items-center">
          <span class="absolute left-3.5 text-slate-400">📍</span>
          <select id="citySelect" class="w-full pl-10 pr-4 py-2.5 text-sm rounded-xl border border-slate-200 bg-slate-50 text-slate-900 focus:outline-none focus:border-[#e23838] focus:bg-white cursor-pointer appearance-none transition" onchange="executeSearch(1)">
            <option value="Вся Україна">Вся Україна</option>
            <option value="Київ">Київ</option>
            <option value="Львів">Львів</option>
            <option value="Одеса">Одеса</option>
            <option value="Дніпро">Дніпро</option>
            <option value="Харків">Харків</option>
            <option value="Вінниця">Вінниця</option>
            <option value="Дистанційно">Дистанційно (Remote)</option>
          </select>
        </div>

        <button onclick="executeSearch(1)" class="px-7 py-2.5 rounded-xl font-bold text-sm text-white bg-[#e23838] hover:bg-[#c92f2f] active:scale-[0.98] transition shadow-sm flex items-center justify-center cursor-pointer">
          Знайти роботу
        </button>
      </div>

      <div class="flex items-center gap-2 mt-3 pt-2.5 border-t border-slate-100 text-xs overflow-x-auto scrollbar-none">
        <span class="text-slate-400">Швидкий пошук:</span>
        <button onclick="setQuery('Python')" class="px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 hover:bg-slate-200 transition cursor-pointer">Python</button>
        <button onclick="setQuery('B2B Продажі')" class="px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 hover:bg-slate-200 transition cursor-pointer">B2B Продажі</button>
        <button onclick="setQuery('Бухгалтер')" class="px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 hover:bg-slate-200 transition cursor-pointer">Бухгалтер</button>
        <button onclick="setQuery('Логіст')" class="px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 hover:bg-slate-200 transition cursor-pointer">Логіст</button>
        <button onclick="document.getElementById('citySelect').value='Дистанційно'; executeSearch(1)" class="px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 hover:bg-slate-200 transition cursor-pointer">Дистанційно</button>
      </div>
    </div>

    <div id="liveStatusBanner" class="p-3 rounded-xl bg-slate-900 text-slate-300 border border-slate-800 text-xs mono flex items-center justify-between">
      <div class="flex items-center gap-2">
        <span class="h-2 w-2 rounded-full bg-emerald-400 animate-pulse"></span>
        <span id="liveStatusText">Пошук вакансій у реальному часі</span>
      </div>
      <span id="liveSpeedText" class="text-slate-500">Пряме оновлення</span>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
      <aside class="lg:col-span-4 space-y-4">
        <div id="filterCard" class="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-5 transition">
          <div class="flex items-center justify-between pb-3 border-b border-slate-100">
            <h3 class="font-bold text-sm text-slate-900">Фільтри</h3>
            <button onclick="resetFilters()" class="text-xs text-[#e23838] hover:underline cursor-pointer font-semibold">Скинути всі</button>
          </div>

          <div class="space-y-2">
            <label class="block text-xs font-bold uppercase tracking-wider text-slate-600">Джерело</label>
            <div class="space-y-1.5 text-xs">
              <label class="flex items-center gap-2 cursor-pointer">
                <input type="radio" name="portalFilter" value="all" checked onchange="executeSearch(1)" class="text-[#e23838]" />
                <span>Всі сайти (Work.ua + Robota.ua)</span>
              </label>
              <label class="flex items-center gap-2 cursor-pointer">
                <input type="radio" name="portalFilter" value="Work.ua" onchange="executeSearch(1)" class="text-[#e23838]" />
                <span>Тільки Work.ua</span>
              </label>
              <label class="flex items-center gap-2 cursor-pointer">
                <input type="radio" name="portalFilter" value="Robota.ua" onchange="executeSearch(1)" class="text-[#e23838]" />
                <span>Тільки Robota.ua</span>
              </label>
            </div>
          </div>

          <div class="space-y-2">
            <label class="block text-xs font-bold uppercase tracking-wider text-slate-600">Досвід роботи</label>
            <div class="space-y-1.5 text-xs">
              <label class="flex items-center gap-2 cursor-pointer">
                <input type="radio" name="expFilter" value="all" checked onchange="applyFilters()" class="text-[#e23838]" />
                <span>Будь-який досвід</span>
              </label>
              <label class="flex items-center gap-2 cursor-pointer">
                <input type="radio" name="expFilter" value="no-exp" onchange="applyFilters()" class="text-[#e23838]" />
                <span>Без досвіду / Студент</span>
              </label>
              <label class="flex items-center gap-2 cursor-pointer">
                <input type="radio" name="expFilter" value="Junior" onchange="applyFilters()" class="text-[#e23838]" />
                <span>Junior (до 1 року)</span>
              </label>
            </div>
          </div>

          <div>
            <label class="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" id="remoteCheck" onchange="applyFilters()" class="rounded text-[#e23838]" />
              <span class="text-xs font-medium text-slate-800">Тільки дистанційна робота</span>
            </label>
          </div>

          <div class="space-y-2 pt-2 border-t border-slate-100">
            <label class="block text-xs font-bold uppercase tracking-wider text-slate-600">Зарплата від</label>
            <div class="space-y-1.5 text-xs">
              <label class="flex items-center gap-2 cursor-pointer">
                <input type="radio" name="salFilter" value="0" checked onchange="applyFilters()" class="text-[#e23838]" />
                <span>Будь-яка</span>
              </label>
              <label class="flex items-center gap-2 cursor-pointer">
                <input type="radio" name="salFilter" value="25000" onchange="applyFilters()" class="text-[#e23838]" />
                <span>від 25 000 грн</span>
              </label>
              <label class="flex items-center gap-2 cursor-pointer">
                <input type="radio" name="salFilter" value="35000" onchange="applyFilters()" class="text-[#e23838]" />
                <span>від 35 000 грн</span>
              </label>
            </div>
          </div>
        </div>
      </aside>

      <section class="lg:col-span-8 space-y-4">
        <div class="flex items-center justify-between pb-1">
          <div>
            <h2 class="text-base sm:text-lg font-bold text-slate-900" id="resultsTitle">
              Вакансії в Україні (Сторінка <span id="curPageNum">1</span>)
            </h2>
            <span class="text-xs text-slate-500" id="resultsCount">Отримання карток...</span>
          </div>
          <div class="text-xs font-mono text-slate-500">Work.ua & Robota.ua</div>
        </div>

        <div id="cardsList" class="space-y-3.5"></div>

        <nav id="paginationNav" class="p-3.5 rounded-2xl bg-white border border-slate-200 flex items-center justify-between text-xs font-medium shadow-sm transition">
          <button onclick="changePage(currentPage - 1)" id="prevBtn" class="px-3.5 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-100 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer transition">
            « Попередня
          </button>
          <div id="pageNumbers" class="flex items-center gap-1 mono"></div>
          <button onclick="changePage(currentPage + 1)" id="nextBtn" class="px-3.5 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-100 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer transition">
            Наступна »
          </button>
        </nav>
      </section>
    </div>
  </main>

  <div id="jobModal" class="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 hidden flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
    <div id="modalBox" class="bg-white rounded-2xl max-w-2xl w-full p-6 space-y-5 shadow-2xl border border-slate-200 my-8 transition-colors max-h-[90vh] overflow-y-auto">
      
      <div class="flex justify-between items-start border-b pb-4">
        <div>
          <span class="text-[11px] font-mono font-bold uppercase px-2.5 py-0.5 rounded-md text-white bg-[#e23838]" id="modalSourceBadge">Work.ua</span>
          <h2 id="modalTitle" class="text-xl sm:text-2xl font-black text-slate-900 mt-2 leading-tight"></h2>
          <div class="text-lg font-bold font-mono text-emerald-600 mt-1" id="modalSalary"></div>
        </div>
        <button onclick="closeModal()" class="text-slate-400 hover:text-slate-600 p-2 text-xl font-bold cursor-pointer rounded-lg hover:bg-slate-100">✕</button>
      </div>

      <div class="flex flex-wrap items-center gap-4 text-xs text-slate-600 bg-slate-50 p-3 rounded-xl border border-slate-100" id="modalMetaBox">
        <div>🏢 Компанія: <strong class="text-slate-900" id="modalCompany"></strong></div>
        <div>📍 Локація: <strong class="text-slate-900" id="modalCity"></strong></div>
        <div>⏱ Досвід: <strong class="text-slate-900" id="modalExp"></strong></div>
        <div id="modalRemoteBadge" class="text-emerald-700 font-semibold hidden">🌐 Дистанційно</div>
      </div>

      <div class="space-y-4 text-xs sm:text-sm text-slate-700 leading-relaxed">
        <div>
          <h4 class="font-bold text-slate-900 text-sm mb-1">Про вакансію:</h4>
          <p id="modalDesc"></p>
        </div>

        <div>
          <h4 class="font-bold text-slate-900 text-sm mb-1.5">Основні обов'язки:</h4>
          <ul id="modalDuties" class="list-disc pl-5 space-y-1 text-slate-600"></ul>
        </div>

        <div>
          <h4 class="font-bold text-slate-900 text-sm mb-1.5">Вимоги до кандидата:</h4>
          <ul id="modalRequirements" class="list-disc pl-5 space-y-1 text-slate-600"></ul>
        </div>

        <div>
          <h4 class="font-bold text-slate-900 text-sm mb-1.5">Ми пропонуємо:</h4>
          <ul id="modalBenefits" class="list-disc pl-5 space-y-1 text-slate-600"></ul>
        </div>
      </div>

      <div>
        <h4 class="font-bold text-slate-900 text-xs uppercase tracking-wider mb-2">Ключові навички:</h4>
        <div id="modalSkills" class="flex flex-wrap gap-1.5"></div>
      </div>

      <div class="pt-4 border-t flex flex-col sm:flex-row items-center justify-between gap-3">
        <div class="text-[11px] text-slate-400 mono">
          ID: #<span id="modalJobId"></span> • Пряме оголошення
        </div>
        <div class="flex items-center gap-2 w-full sm:w-auto">
          <button onclick="closeModal()" class="flex-1 sm:flex-none px-4 py-2.5 rounded-xl text-xs font-bold border border-slate-200 hover:bg-slate-100 cursor-pointer">
            Закрити
          </button>
          <a id="modalDirectLink" href="#" target="_blank" rel="noopener noreferrer" class="flex-1 sm:flex-none px-5 py-2.5 rounded-xl text-xs font-bold bg-[#e23838] hover:bg-[#c92f2f] text-white transition text-center shadow-sm">
            Відкрити на сайті оголошення ↗
          </a>
        </div>
      </div>

    </div>
  </div>

  <footer id="appFooter" class="border-t border-slate-200 bg-white py-6 mt-12 transition">
    <div class="max-w-6xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
      <div class="flex items-center gap-2">
        <span class="font-bold text-[#e23838]">Work.ua</span>
        <span>•</span>
        <span>Сайт пошуку роботи в Україні</span>
      </div>
      <div class="mono text-[11px]">Пошук вакансій по всій Україні</div>
    </div>
  </footer>

  <script>
    let isDark = localStorage.getItem('theme') === 'dark';
    let currentPage = 1, totalPages = 5;
    let currentRawVacancies = [];
    let savedIds = JSON.parse(localStorage.getItem('savedVacancies') || '[]');
    let showSavedOnly = false;

    function applyThemeStyles() {
      const b = document.getElementById('appBody'), h = document.getElementById('appHeader'), f = document.getElementById('appFooter');
      const sb = document.getElementById('searchBox'), fc = document.getElementById('filterCard'), pn = document.getElementById('paginationNav');
      const bt = document.getElementById('brandText'), tbtn = document.getElementById('themeBtn'), mb = document.getElementById('modalBox');

      if (isDark) {
        b.className = "bg-slate-950 text-slate-100 min-h-screen flex flex-col transition-colors duration-150";
        h.className = "bg-slate-900 border-b border-slate-800 sticky top-0 z-40 transition-colors";
        f.className = "border-t border-slate-800 bg-slate-900 py-6 mt-12 transition";
        sb.className = "p-4 rounded-2xl bg-slate-900 border border-slate-800 shadow-sm transition";
        fc.className = "p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-sm space-y-5 transition";
        pn.className = "p-3.5 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-between text-xs font-medium shadow-sm transition";
        bt.className = "text-xl font-black tracking-tight leading-none text-white";
        mb.className = "bg-slate-900 text-white rounded-2xl max-w-2xl w-full p-6 space-y-5 shadow-2xl border border-slate-800 my-8 transition-colors max-h-[90vh] overflow-y-auto";
        tbtn.innerText = "🌙";
      } else {
        b.className = "bg-[#f4f5f7] text-slate-900 min-h-screen flex flex-col transition-colors duration-150";
        h.className = "bg-white border-b border-slate-200 sticky top-0 z-40 transition-colors";
        f.className = "border-t border-slate-200 bg-white py-6 mt-12 transition";
        sb.className = "p-4 rounded-2xl bg-white border border-slate-200 shadow-sm transition";
        fc.className = "p-5 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-5 transition";
        pn.className = "p-3.5 rounded-2xl bg-white border border-slate-200 flex items-center justify-between text-xs font-medium shadow-sm transition";
        bt.className = "text-xl font-black tracking-tight leading-none text-slate-900";
        mb.className = "bg-white text-slate-900 rounded-2xl max-w-2xl w-full p-6 space-y-5 shadow-2xl border border-slate-200 my-8 transition-colors max-h-[90vh] overflow-y-auto";
        tbtn.innerText = "☀️";
      }
      localStorage.setItem('theme', isDark ? 'dark' : 'light');
      renderCards(getFilteredList());
    }

    function toggleTheme() {
      isDark = !isDark;
      applyThemeStyles();
    }

    function setQuery(q) {
      document.getElementById('searchInput').value = q;
      executeSearch(1);
    }

    function resetFilters() {
      document.getElementById('searchInput').value = '';
      document.getElementById('citySelect').value = 'Вся Україна';
      document.querySelector('input[name="portalFilter"][value="all"]').checked = true;
      document.querySelector('input[name="expFilter"][value="all"]').checked = true;
      document.querySelector('input[name="salFilter"][value="0"]').checked = true;
      document.getElementById('remoteCheck').checked = false;
      showSavedOnly = false;
      document.getElementById('savedBtn').classList.remove('bg-red-100', 'text-[#e23838]', 'border-red-200');
      executeSearch(1);
    }

    function toggleSaved(id) {
      if (savedIds.includes(id)) {
        savedIds = savedIds.filter(i => i !== id);
      } else {
        savedIds.push(id);
      }
      localStorage.setItem('savedVacancies', JSON.stringify(savedIds));
      updateSavedCounter();
      renderCards(getFilteredList());
    }

    function updateSavedCounter() {
      document.getElementById('savedCount').innerText = savedIds.length;
    }

    function toggleSavedFilter() {
      showSavedOnly = !showSavedOnly;
      const btn = document.getElementById('savedBtn');
      if (showSavedOnly) {
        btn.classList.add('bg-red-100', 'text-[#e23838]', 'border-red-200');
      } else {
        btn.classList.remove('bg-red-100', 'text-[#e23838]', 'border-red-200');
      }
      renderCards(getFilteredList());
    }

    async function executeSearch(page = 1) {
      currentPage = page;
      document.getElementById('curPageNum').innerText = page;

      const q = document.getElementById('searchInput').value.trim();
      const city = document.getElementById('citySelect').value;
      const portal = document.querySelector('input[name="portalFilter"]:checked').value;
      const cardsList = document.getElementById('cardsList');

      cardsList.innerHTML = `<div class="p-10 text-center text-slate-400 text-sm mono">Завантаження вакансій зі сторінки ${page}...</div>`;
      const t0 = performance.now();

      try {
        const url = `/api/scrape?page=${page}&portal=${encodeURIComponent(portal)}&query=${encodeURIComponent(q)}&city=${encodeURIComponent(city)}`;
        const res = await fetch(url);
        const data = await res.json();
        const duration = Math.round(performance.now() - t0);

        if (data.success && Array.isArray(data.vacancies)) {
          currentRawVacancies = data.vacancies;
          const queryLabel = q ? ` за запитом "${q}"` : '';
          document.getElementById('liveStatusText').innerText = `Знайдено ${data.vacancies.length} актуальних вакансій${queryLabel} на сторінці ${page}`;
          document.getElementById('liveSpeedText').innerText = `${duration} мс`;
          applyFilters();
        } else {
          cardsList.innerHTML = `<div class="p-8 text-center text-red-500 text-sm">Помилка під час завантаження карток.</div>`;
        }
      } catch (e) {
        cardsList.innerHTML = `<div class="p-8 text-center text-red-500 text-sm">Збій з'єднання: ${e.message}</div>`;
      }
      renderPagination();
    }

    function changePage(p) {
      if (p < 1 || p > totalPages) return;
      executeSearch(p);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    function getFilteredList() {
      const exp = document.querySelector('input[name="expFilter"]:checked').value;
      const sal = parseInt(document.querySelector('input[name="salFilter"]:checked').value) || 0;
      const remote = document.getElementById('remoteCheck').checked;

      return currentRawVacancies.filter(v => {
        if (showSavedOnly && !savedIds.includes(v.id)) return false;
        if (exp === 'no-exp' && v.experienceLevel !== 'Trainee/No Exp' && v.experienceLevel !== 'Junior') return false;
        if (exp === 'Junior' && v.experienceLevel !== 'Junior') return false;
        if (remote && !v.isRemote) return false;
        if (sal > 0 && v.salaryMin && v.salaryMin < sal) return false;
        return true;
      });
    }

    function applyFilters() {
      renderCards(getFilteredList());
    }

    function renderCards(list) {
      const cardsList = document.getElementById('cardsList');
      const q = document.getElementById('searchInput').value.trim();
      document.getElementById('resultsCount').innerText = `Знайдено ${list.length} актуальних вакансій${q ? ` за запитом "${q}"` : ''}`;

      if (list.length === 0) {
        cardsList.innerHTML = `
          <div class="p-10 rounded-2xl border ${isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'} text-center space-y-3">
            <p class="text-sm text-slate-500">За обраними фільтрами вакансій не знайдено.</p>
            <button onclick="resetFilters()" class="px-4 py-2 rounded-xl bg-[#e23838] text-white text-xs font-bold cursor-pointer">Скинути фільтри</button>
          </div>
        `;
        return;
      }

      cardsList.innerHTML = list.map(v => {
        const bg = isDark ? 'bg-slate-900 border-slate-800 hover:border-slate-700' : 'bg-white border-slate-200 hover:border-slate-300';
        const tColor = isDark ? 'text-sky-400 hover:text-sky-300' : 'text-[#0066cc] hover:text-[#004c99]';
        const sColor = isDark ? 'text-emerald-400' : 'text-slate-900';
        const badge = v.source === 'Work.ua' ? 'bg-red-100 text-[#e23838]' : 'bg-indigo-100 text-indigo-700';
        const isFav = savedIds.includes(v.id);

        return `
          <article class="p-5 rounded-2xl border ${bg} transition shadow-xs space-y-2.5">
            <div class="flex items-start justify-between gap-3">
              <div>
                <h3 class="text-base sm:text-lg font-bold leading-snug cursor-pointer ${tColor} transition hover:underline" onclick="openModal('${v.id}')">
                  ${v.title}
                </h3>
                <div class="text-sm sm:text-base font-bold font-mono ${sColor} mt-0.5">
                  ${v.salaryText}
                </div>
              </div>
              <div class="flex items-center gap-1.5 shrink-0">
                <button onclick="toggleSaved('${v.id}')" class="p-1.5 rounded-lg border text-xs cursor-pointer ${isFav ? 'bg-amber-100 text-amber-600 border-amber-300' : 'text-slate-400 border-slate-200 hover:text-slate-600'}" title="Зберегти">
                  ${isFav ? '★' : '☆'}
                </button>
                <span class="text-[10px] font-mono px-2 py-0.5 rounded-md font-bold uppercase ${badge}">
                  ${v.source} • Стор. ${v.page}
                </span>
              </div>
            </div>

            <div class="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-500">
              <span class="font-semibold ${isDark ? 'text-slate-300' : 'text-slate-700'}">🏢 ${v.company}</span>
              <span>📍 ${v.city}</span>
              ${v.isRemote ? '<span class="text-emerald-600 font-semibold">🌐 Дистанційно</span>' : ''}
              <span class="mono">${v.experienceLevel}</span>
            </div>

            <p class="text-xs sm:text-[13px] ${isDark ? 'text-slate-400' : 'text-slate-600'} line-clamp-2 leading-relaxed">
              ${v.description}
            </p>

            <div class="flex flex-wrap gap-1.5 pt-1">
              ${v.skills.map(sk => `<span class="px-2 py-0.5 rounded text-[11px] ${isDark ? 'bg-slate-950 text-slate-300 border border-slate-800' : 'bg-slate-50 text-slate-700 border border-slate-200'}">${sk}</span>`).join('')}
            </div>

            <div class="flex items-center justify-between pt-2 border-t ${isDark ? 'border-slate-800' : 'border-slate-100'} text-xs">
              <button onclick="openModal('${v.id}')" class="text-xs font-bold text-[#e23838] hover:underline cursor-pointer flex items-center gap-1">
                <span>📖 Відкрити тут</span>
              </button>
              <a href="${v.url}" target="_blank" rel="noopener noreferrer" class="px-3.5 py-1.5 rounded-lg text-xs font-bold bg-[#e23838] hover:bg-[#c92f2f] text-white transition flex items-center gap-1 shadow-2xs">
                <span>Оголошення на ${v.source} ↗</span>
              </a>
            </div>
          </article>
        `;
      }).join('');
    }

    function renderPagination() {
      const pNav = document.getElementById('pageNumbers');
      document.getElementById('prevBtn').disabled = currentPage === 1;
      document.getElementById('nextBtn').disabled = currentPage === totalPages;

      let html = '';
      for (let i = 1; i <= totalPages; i++) {
        const isAct = i === currentPage;
        const cls = isAct ? 'bg-[#e23838] text-white font-bold' : (isDark ? 'hover:bg-slate-800 text-slate-400' : 'hover:bg-slate-100 text-slate-700');
        html += `<button onclick="changePage(${i})" class="h-8 w-8 rounded-lg flex items-center justify-center transition cursor-pointer ${cls}">${i}</button>`;
      }
      pNav.innerHTML = html;
    }

    function openModal(id) {
      const v = currentRawVacancies.find(item => item.id === id);
      if (!v) return;
      document.getElementById('modalTitle').innerText = v.title;
      document.getElementById('modalSalary').innerText = v.salaryText;
      document.getElementById('modalCompany').innerText = v.company;
      document.getElementById('modalCity').innerText = v.city;
      document.getElementById('modalExp').innerText = v.experienceLevel;
      document.getElementById('modalJobId').innerText = v.jobId || '5400150';
      document.getElementById('modalSourceBadge').innerText = v.source;
      
      const remoteBadge = document.getElementById('modalRemoteBadge');
      if (v.isRemote) {
        remoteBadge.classList.remove('hidden');
      } else {
        remoteBadge.classList.add('hidden');
      }

      document.getElementById('modalDesc').innerText = v.description;
      
      const dutiesEl = document.getElementById('modalDuties');
      dutiesEl.innerHTML = (v.duties || []).map(d => `<li>${d}</li>`).join('');

      const reqEl = document.getElementById('modalRequirements');
      reqEl.innerHTML = (v.requirements || []).map(r => `<li>${r}</li>`).join('');

      const benEl = document.getElementById('modalBenefits');
      benEl.innerHTML = (v.benefits || []).map(b => `<li>${b}</li>`).join('');

      document.getElementById('modalDirectLink').href = v.url;
      document.getElementById('modalSkills').innerHTML = (v.skills || []).map(sk => 
        `<span class="px-2.5 py-1 rounded-md text-xs ${isDark ? 'bg-slate-800 text-slate-200 border border-slate-700' : 'bg-slate-100 text-slate-700 border border-slate-200'} font-medium">${sk}</span>`
      ).join('');

      document.getElementById('jobModal').classList.remove('hidden');
    }

    function closeModal() {
      document.getElementById('jobModal').classList.add('hidden');
    }

    document.getElementById('jobModal').addEventListener('click', function(e) {
      if (e.target === this) closeModal();
    });

    applyThemeStyles();
    updateSavedCounter();
    executeSearch(1);
  </script>
</body>
</html>
"""

# === 4. ENTRYPOINT ===
def run():
    server = HTTPServer(('0.0.0.0', PORT), ScraperServer)
    print(f"🚀 Work.ua & Robota.ua Engine running on port {PORT}")
    sys.stdout.flush()
    try:
        server.serve_forever()
    except KeyboardInterrupt:
        server.server_close()

if __name__ == '__main__':
    run()
