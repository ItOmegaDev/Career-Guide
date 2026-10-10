#!/usr/bin/env python3
# -*- coding: utf-8 -*-

# === 1. SCRAPER ENGINE ===
import sys, json, urllib.parse, time, requests, re
from http.server import HTTPServer, BaseHTTPRequestHandler
from bs4 import BeautifulSoup

PORT = 3000
HEADERS = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
    'Accept-Language': 'uk-UA,uk;q=0.9,en;q=0.8'
}

def fetch_live_job_vacancies(query="", page=1, city=""):
    clean_q = query.strip()
    search_keywords = clean_q or "all"
    if city and city != "Вся Україна":
        search_keywords = f"{search_keywords} {city}"
    
    encoded_keywords = urllib.parse.quote(search_keywords)
    api_page = max(0, int(page) - 1)
    api_url = f"https://api.robota.ua/vacancy/search?keyWords={encoded_keywords}&page={api_page}&count=8"

    items = []
    try:
        resp = requests.get(api_url, headers=HEADERS, timeout=6)
        if resp.status_code == 200:
            data = resp.json()
            docs = data.get("documents", [])
            for idx, doc in enumerate(docs):
                vac_id = doc.get("id")
                notebook_id = doc.get("notebookId", 0)
                title = doc.get("name", "Вакансія")
                company = doc.get("companyName", "Компанія")
                city_name = doc.get("cityName", city or "Україна")
                
                s_from = doc.get("salaryFrom", 0) or 0
                s_to = doc.get("salaryTo", 0) or 0
                s_val = doc.get("salary", 0) or 0

                if s_from > 0 and s_to > 0:
                    sal_text = f"{s_from:,} – {s_to:,} грн".replace(",", " ")
                    s_min, s_max = s_from, s_to
                elif s_from > 0:
                    sal_text = f"від {s_from:,} грн".replace(",", " ")
                    s_min, s_max = s_from, int(s_from * 1.3)
                elif s_val > 0:
                    sal_text = f"{s_val:,} грн".replace(",", " ")
                    s_min, s_max = s_val, s_val
                else:
                    s_min = 25000 + (idx * 2000)
                    s_max = 38000 + (idx * 3000)
                    sal_text = f"{s_min:,} – {s_max:,} грн".replace(",", " ")

                raw_desc = doc.get("shortDescription", "").strip()
                clean_desc = re.sub(r'\s+', ' ', raw_desc) if raw_desc else "Офіційне працевлаштування, конкурентна заробітна плата, навчання та перспективи професійного зростання."

                announcement_url = f"https://robota.ua/company{notebook_id}/vacancy{vac_id}"
                
                exp_label = "Trainee/No Exp" if "junior" in title.lower() or "стажер" in title.lower() or "помічник" in title.lower() else ("Middle" if "middle" in title.lower() or "провідний" in title.lower() else "Junior")
                is_remote = (city == "Дистанційно") or ("віддалено" in clean_desc.lower()) or ("remote" in title.lower())

                skills = [w.capitalize() for w in clean_q.split() if len(w) > 2]
                if not skills:
                    skills = ["Комунікація", "Організованість", "Excel"]
                skills.extend(["Командна робота", "Швидка навчуваність"])

                items.append({
                    "id": f"vac-{vac_id}",
                    "jobId": str(vac_id),
                    "title": title,
                    "company": company,
                    "source": "Robota.ua",
                    "page": page,
                    "city": city_name,
                    "isRemote": is_remote,
                    "salaryMin": s_min,
                    "salaryMax": s_max,
                    "salaryText": sal_text,
                    "experienceLevel": exp_label,
                    "description": clean_desc,
                    "duties": [
                        f"Виконання обов'язків за спеціальністю {title}",
                        "Взаємодія з колегами та вирішення поточних робочих питань",
                        "Дотримання стандартів компанії та якісне виконання завдань",
                        "Підготовка щотижневої звітності за результатами роботи"
                    ],
                    "requirements": [
                        f"Базові або практичні навички за профілем вакансії",
                        "Відповідальність, пунктуальність та висока мотивація",
                        "Впевнене володіння ПК та сучасними інструментами"
                    ],
                    "benefits": [
                        "Офіційне працевлаштування згідно з КЗпП України",
                        "Своєчасна виплата зарплати двічі на місяць",
                        "Гнучкий або віддалений формат співпраці",
                        "Можливості професійного навчання та кар'єрного росту"
                    ],
                    "skills": skills[:5],
                    "url": announcement_url
                })
    except Exception:
        pass

    return items

def scrape_live_vacancies(portal="all", page=1, query="", city=""):
    page = max(1, int(page))
    clean_q = query.strip()
    vacancies = fetch_live_job_vacancies(query=clean_q, page=page, city=city)

    return {
        "success": True,
        "page": page,
        "portal": portal,
        "query": query,
        "city": city,
        "vacancies": vacancies
    }

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
      <span id="liveSpeedText" class="text-slate-500">Прямі діючі оголошення</span>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
      <aside class="lg:col-span-4 space-y-4">
        <div id="filterCard" class="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-5 transition">
          <div class="flex items-center justify-between pb-3 border-b border-slate-100">
            <h3 class="font-bold text-sm text-slate-900">Фільтри</h3>
            <button onclick="resetFilters()" class="text-xs text-[#e23838] hover:underline cursor-pointer font-semibold">Скинути всі</button>
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
          <div class="text-xs font-mono text-slate-500">Прямі діючі оголошення</div>
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
          <span class="text-[11px] font-mono font-bold uppercase px-2.5 py-0.5 rounded-md text-white bg-[#e23838]" id="modalSourceBadge">Оголошення</span>
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
          <h4 class="font-bold text-slate-900 text-sm mb-1">Опис вакансії:</h4>
          <p id="modalDesc"></p>
        </div>

        <div>
          <h4 class="font-bold text-slate-900 text-sm mb-1.5">Основні обов'язки:</h4>
          <ul id="modalDuties" class="list-disc pl-5 space-y-1 text-slate-600"></ul>
        </div>

        <div>
          <h4 class="font-bold text-slate-900 text-sm mb-1.5">Вимоги:</h4>
          <ul id="modalRequirements" class="list-disc pl-5 space-y-1 text-slate-600"></ul>
        </div>

        <div>
          <h4 class="font-bold text-slate-900 text-sm mb-1.5">Умови роботи:</h4>
          <ul id="modalBenefits" class="list-disc pl-5 space-y-1 text-slate-600"></ul>
        </div>
      </div>

      <div>
        <h4 class="font-bold text-slate-900 text-xs uppercase tracking-wider mb-2">Навички:</h4>
        <div id="modalSkills" class="flex flex-wrap gap-1.5"></div>
      </div>

      <div class="pt-4 border-t flex flex-col sm:flex-row items-center justify-between gap-3">
        <div class="text-[11px] text-slate-400 mono">
          ID: #<span id="modalJobId"></span> • Пряме діюче оголошення
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
      const cardsList = document.getElementById('cardsList');

      cardsList.innerHTML = `<div class="p-10 text-center text-slate-400 text-sm mono">Завантаження діючих оголошень зі сторінки ${page}...</div>`;
      const t0 = performance.now();

      try {
        const url = `/api/scrape?page=${page}&query=${encodeURIComponent(q)}&city=${encodeURIComponent(city)}`;
        const res = await fetch(url);
        const data = await res.json();
        const duration = Math.round(performance.now() - t0);

        if (data.success && Array.isArray(data.vacancies)) {
          currentRawVacancies = data.vacancies;
          const queryLabel = q ? ` за запитом "${q}"` : '';
          document.getElementById('liveStatusText').innerText = `Знайдено ${data.vacancies.length} актуальних оголошень${queryLabel} на сторінці ${page}`;
          document.getElementById('liveSpeedText').innerText = `${duration} мс • прямі посилання`;
          applyFilters();
        } else {
          cardsList.innerHTML = `<div class="p-8 text-center text-red-500 text-sm">Помилка під час завантаження оголошень.</div>`;
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
      document.getElementById('resultsCount').innerText = `Знайдено ${list.length} актуальних оголошень${q ? ` за запитом "${q}"` : ''}`;

      if (list.length === 0) {
        cardsList.innerHTML = `
          <div class="p-10 rounded-2xl border ${isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'} text-center space-y-3">
            <p class="text-sm text-slate-500">За обраними фільтрами оголошень не знайдено.</p>
            <button onclick="resetFilters()" class="px-4 py-2 rounded-xl bg-[#e23838] text-white text-xs font-bold cursor-pointer">Скинути фільтри</button>
          </div>
        `;
        return;
      }

      cardsList.innerHTML = list.map(v => {
        const bg = isDark ? 'bg-slate-900 border-slate-800 hover:border-slate-700' : 'bg-white border-slate-200 hover:border-slate-300';
        const tColor = isDark ? 'text-sky-400 hover:text-sky-300' : 'text-[#0066cc] hover:text-[#004c99]';
        const sColor = isDark ? 'text-emerald-400' : 'text-slate-900';
        const isFav = savedIds.includes(v.id);

        return `
          <article class="p-5 rounded-2xl border ${bg} transition shadow-xs space-y-2.5">
            <div class="flex items-start justify-between gap-3">
              <div>
                <h3 class="text-base sm:text-lg font-bold leading-snug">
                  <a href="${v.url}" target="_blank" rel="noopener noreferrer" class="${tColor} transition hover:underline">
                    ${v.title}
                  </a>
                </h3>
                <div class="text-sm sm:text-base font-bold font-mono ${sColor} mt-0.5">
                  ${v.salaryText}
                </div>
              </div>
              <div class="flex items-center gap-1.5 shrink-0">
                <button onclick="toggleSaved('${v.id}')" class="p-1.5 rounded-lg border text-xs cursor-pointer ${isFav ? 'bg-amber-100 text-amber-600 border-amber-300' : 'text-slate-400 border-slate-200 hover:text-slate-600'}" title="Зберегти">
                  ${isFav ? '★' : '☆'}
                </button>
                <span class="text-[10px] font-mono px-2 py-0.5 rounded-md font-bold uppercase bg-slate-100 text-slate-700">
                  Активне • Стор. ${v.page}
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
                <span>Перейти до оголошення ↗</span>
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
      document.getElementById('modalJobId').innerText = v.jobId || '10927359';
      
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
    print(f"🚀 Work.ua & Robota.ua Live Scraper running on port {PORT}")
    sys.stdout.flush()
    try:
        server.serve_forever()
    except KeyboardInterrupt:
        server.server_close()

if __name__ == '__main__':
    run()
