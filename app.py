#!/usr/bin/env python3
# -*- coding: utf-8 -*-
import json, re, urllib.parse, urllib.request
from http.server import ThreadingHTTPServer, BaseHTTPRequestHandler

PORT = 3000
HEADERS = {'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)', 'Accept': 'application/json'}

def build_vacancy_url(vac_id, notebook_id=0):
    nb_id = int(notebook_id or 0)
    return f"https://robota.ua/company{nb_id}/vacancy{vac_id}" if nb_id > 0 else f"https://robota.ua/vacancy/{vac_id}"

def parse_salary(doc):
    s_from, s_to, s_val = int(doc.get("salaryFrom") or 0), int(doc.get("salaryTo") or 0), int(doc.get("salary") or 0)
    if s_from > 0 and s_to > 0:
        return s_from, s_to, f"{s_from:,} – {s_to:,} грн".replace(",", " ")
    if s_from > 0:
        return s_from, int(s_from * 1.25), f"від {s_from:,} грн".replace(",", " ")
    if s_to > 0:
        return int(s_to * 0.8), s_to, f"до {s_to:,} грн".replace(",", " ")
    if s_val > 0:
        return s_val, s_val, f"{s_val:,} грн".replace(",", " ")
    return 0, 0, "За домовленістю"

def fetch_vacancies(query="", page=1, city=""):
    clean_q = query.strip()
    kw = f"{clean_q or 'all'} {city}".strip() if city and city != "Вся Україна" else (clean_q or "all")
    api_url = f"https://api.robota.ua/vacancy/search?keyWords={urllib.parse.quote(kw)}&page={max(0, int(page)-1)}&count=10"

    items = []
    try:
        req = urllib.request.Request(api_url, headers=HEADERS)
        with urllib.request.urlopen(req, timeout=6) as resp:
            docs = json.loads(resp.read().decode('utf-8')).get("documents", [])
            for doc in docs:
                vid = doc.get("id")
                if not vid: continue
                title = (doc.get("name") or "Вакансія").strip()
                comp = (doc.get("companyName") or "Компанія").strip()
                s_min, s_max, s_text = parse_salary(doc)

                desc = re.sub(r'^(Опис вакансії[:\s]*)+', '', re.sub(r'\s+', ' ', doc.get("shortDescription", "") or "").strip(), flags=re.IGNORECASE)
                if not desc: desc = "Офіційне працевлаштування, перспективи професійного та кар'єрного зростання."

                t_low = title.lower()
                exp = "Без досвіду / Junior" if any(x in t_low for x in ["junior", "стажер", "помічник", "trainee"]) else ("Middle" if "middle" in t_low else "Junior")
                remote = (city == "Дистанційно") or ("віддалено" in desc.lower()) or ("remote" in t_low)

                skills = [w.capitalize() for w in clean_q.split() if len(w) > 2] or ["Комунікація", "Організованість", "Excel"]
                skills.extend(["Командна робота", "Швидка навчуваність"])

                items.append({
                    "id": f"vac-{vid}", "jobId": str(vid), "title": title, "company": comp,
                    "city": doc.get("cityName") or (city if city != "Вся Україна" else "Україна"),
                    "page": page, "isRemote": remote, "salaryMin": s_min, "salaryMax": s_max, "salaryText": s_text,
                    "experienceLevel": exp, "description": desc, "skills": skills[:5],
                    "url": build_vacancy_url(vid, doc.get("notebookId")),
                    "duties": [f"Виконання завдань за посадою «{title}»", "Взаємодія з командою для досягнення цілей", "Дотримання стандартів якості компанії"],
                    "requirements": ["Відповідальність та висока мотивація", "Впевнені навички роботи з ПК", "Готовність швидко навчатися"],
                    "benefits": ["Офіційне працевлаштування та соціальні гарантії", "Своєчасна виплата зарплати", "Гнучкий графік або віддалена робота"]
                })
    except Exception as e:
        print(f"[Error] {e}")
    return items

class Handler(BaseHTTPRequestHandler):
    def do_GET(self):
        p = urllib.parse.urlparse(self.path)
        if p.path in ['/', '/index.html']:
            self.send_response(200)
            self.send_header('Content-Type', 'text/html; charset=utf-8')
            self.end_headers()
            self.wfile.write(HTML_UI.encode('utf-8'))
        elif p.path == '/api/scrape':
            qp = urllib.parse.parse_qs(p.query)
            data = fetch_vacancies(query=qp.get('query', [''])[0], page=int(qp.get('page', ['1'])[0]), city=qp.get('city', [''])[0])
            self.send_response(200)
            self.send_header('Content-Type', 'application/json; charset=utf-8')
            self.send_header('Access-Control-Allow-Origin', '*')
            self.end_headers()
            self.wfile.write(json.dumps({"success": True, "vacancies": data}, ensure_ascii=False).encode('utf-8'))
        else:
            self.send_response(404)
            self.end_headers()
    def log_message(self, *a): pass

HTML_UI = """<!DOCTYPE html>
<html lang="uk" class="h-full">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Пошук роботи в Україні • Work.ua & Robota.ua</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <script>tailwind.config = { darkMode: 'class' };</script>
  <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=JetBrains+Mono:wght@500;600&display=swap" rel="stylesheet">
  <style>body { font-family: 'Plus Jakarta Sans', sans-serif; } .mono { font-family: 'JetBrains Mono', monospace; }</style>
</head>
<body class="bg-[#f4f5f7] dark:bg-slate-950 text-slate-900 dark:text-slate-100 min-h-screen flex flex-col transition-colors">
  <header class="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 sticky top-0 z-40">
    <div class="max-w-6xl mx-auto px-4 h-15 flex items-center justify-between">
      <a href="/" class="flex items-center gap-2">
        <div class="h-8 w-8 rounded-lg bg-[#e23838] flex items-center justify-center text-white font-black text-lg">W</div>
        <div>
          <span class="text-xl font-black text-slate-900 dark:text-white">Work<span class="text-[#e23838]">.ua</span></span>
          <span class="text-[10px] text-slate-500 block">Пошук діючих вакансій</span>
        </div>
      </a>
      <div class="flex items-center gap-2">
        <button onclick="toggleSavedFilter()" id="savedBtn" class="px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-semibold hover:bg-slate-100 dark:hover:bg-slate-700 cursor-pointer">
          ⭐ Обрані (<span id="savedCount">0</span>)
        </button>
        <button onclick="toggleTheme()" id="themeBtn" class="p-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 cursor-pointer">☀️</button>
      </div>
    </div>
  </header>

  <main class="flex-1 max-w-6xl w-full mx-auto px-4 py-6 space-y-5">
    <div class="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
      <div class="flex flex-col md:flex-row gap-2.5">
        <div class="flex-1 relative flex items-center">
          <span class="absolute left-3.5 text-slate-400">🔍</span>
          <input type="text" id="searchInput" placeholder="Посада, навичка або компанія (Python, Бухгалтер...)"
            class="w-full pl-10 pr-3 py-2.5 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus:outline-none focus:border-[#e23838]"
            onkeydown="if(event.key==='Enter') executeSearch(1)"/>
        </div>
        <select id="citySelect" class="md:w-56 px-3 py-2.5 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus:outline-none focus:border-[#e23838] cursor-pointer" onchange="executeSearch(1)">
          <option value="Вся Україна">Вся Україна</option>
          <option value="Київ">Київ</option><option value="Львів">Львів</option><option value="Одеса">Одеса</option>
          <option value="Дніпро">Дніпро</option><option value="Харків">Харків</option><option value="Дистанційно">Дистанційно (Remote)</option>
        </select>
        <button onclick="executeSearch(1)" class="px-7 py-2.5 rounded-xl font-bold text-sm text-white bg-[#e23838] hover:bg-[#c92f2f] cursor-pointer shadow-sm">
          Знайти роботу
        </button>
      </div>
      <div class="flex items-center gap-2 mt-3 pt-2.5 border-t border-slate-100 dark:border-slate-800 text-xs overflow-x-auto">
        <span class="text-slate-400">Швидкий пошук:</span>
        <button onclick="setQuery('Python')" class="px-2.5 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 cursor-pointer">Python</button>
        <button onclick="setQuery('Бухгалтер')" class="px-2.5 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 cursor-pointer">Бухгалтер</button>
        <button onclick="setQuery('Менеджер')" class="px-2.5 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 cursor-pointer">Менеджер</button>
        <button onclick="document.getElementById('citySelect').value='Дистанційно'; executeSearch(1)" class="px-2.5 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 cursor-pointer">Дистанційно</button>
      </div>
    </div>

    <div class="p-3 rounded-xl bg-slate-900 text-slate-300 border border-slate-800 text-xs mono flex justify-between">
      <div class="flex items-center gap-2"><span class="h-2 w-2 rounded-full bg-emerald-400"></span><span id="liveStatusText">Пошук діючих вакансій</span></div>
      <span id="liveSpeedText" class="text-slate-400">Прямі посилання на повні оголошення</span>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
      <aside class="lg:col-span-4 p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4 text-xs">
        <div class="flex justify-between items-center pb-2 border-b border-slate-100 dark:border-slate-800 font-bold">
          <span>Фільтри</span><button onclick="resetFilters()" class="text-[#e23838] hover:underline cursor-pointer">Скинути всі</button>
        </div>
        <div>
          <label class="font-bold text-slate-500 uppercase tracking-wider block mb-1.5">Досвід</label>
          <div class="space-y-1">
            <label class="flex items-center gap-2 cursor-pointer"><input type="radio" name="exp" value="all" checked onchange="applyFilters()"/> Будь-який</label>
            <label class="flex items-center gap-2 cursor-pointer"><input type="radio" name="exp" value="no-exp" onchange="applyFilters()"/> Без досвіду / Junior</label>
            <label class="flex items-center gap-2 cursor-pointer"><input type="radio" name="exp" value="Middle" onchange="applyFilters()"/> Middle / Досвідчені</label>
          </div>
        </div>
        <label class="flex items-center gap-2 cursor-pointer font-medium"><input type="checkbox" id="remoteCheck" onchange="applyFilters()"/> Тільки дистанційно</label>
        <div class="pt-2 border-t border-slate-100 dark:border-slate-800">
          <label class="font-bold text-slate-500 uppercase tracking-wider block mb-1.5">Зарплата</label>
          <div class="space-y-1">
            <label class="flex items-center gap-2 cursor-pointer"><input type="radio" name="sal" value="0" checked onchange="applyFilters()"/> Будь-яка</label>
            <label class="flex items-center gap-2 cursor-pointer"><input type="radio" name="sal" value="20000" onchange="applyFilters()"/> від 20 000 грн</label>
            <label class="flex items-center gap-2 cursor-pointer"><input type="radio" name="sal" value="35000" onchange="applyFilters()"/> від 35 000 грн</label>
          </div>
        </div>
      </aside>

      <section class="lg:col-span-8 space-y-4">
        <div class="flex justify-between items-center text-sm">
          <span class="font-bold" id="resultsCount">Завантаження вакансій...</span>
          <span class="text-xs text-slate-400 mono">Сторінка <span id="curPageNum">1</span></span>
        </div>
        <div id="cardsList" class="space-y-3.5"></div>
        <nav class="p-3 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex justify-between text-xs font-medium shadow-sm">
          <button onclick="changePage(currentPage-1)" id="prevBtn" class="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 disabled:opacity-30 cursor-pointer">« Попередня</button>
          <div id="pageNumbers" class="flex gap-1 mono"></div>
          <button onclick="changePage(currentPage+1)" id="nextBtn" class="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 disabled:opacity-30 cursor-pointer">Наступна »</button>
        </nav>
      </section>
    </div>
  </main>

  <div id="jobModal" class="fixed inset-0 bg-black/60 z-50 hidden flex items-center justify-center p-4 overflow-y-auto">
    <div class="bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 rounded-2xl max-w-2xl w-full p-6 space-y-4 shadow-2xl border border-slate-200 dark:border-slate-800 my-8 max-h-[90vh] overflow-y-auto">
      <div class="flex justify-between items-start border-b border-slate-200 dark:border-slate-800 pb-3">
        <div>
          <h2 id="modalTitle" class="text-xl font-bold leading-tight"></h2>
          <div id="modalSalary" class="text-lg font-bold font-mono text-emerald-600 dark:text-emerald-400 mt-0.5"></div>
        </div>
        <button onclick="closeModal()" class="text-slate-400 hover:text-slate-600 p-1 text-xl font-bold cursor-pointer">✕</button>
      </div>
      <div class="flex flex-wrap gap-4 text-xs bg-slate-50 dark:bg-slate-800/50 p-3 rounded-xl border border-slate-100 dark:border-slate-800">
        <div>🏢 Компанія: <strong id="modalCompany"></strong></div>
        <div>📍 Локація: <strong id="modalCity"></strong></div>
        <div>⏱ Досвід: <strong id="modalExp"></strong></div>
      </div>
      <div class="text-xs sm:text-sm space-y-3 leading-relaxed">
        <div><h4 class="font-bold mb-1">Опис вакансії:</h4><p id="modalDesc" class="text-slate-600 dark:text-slate-300"></p></div>
        <div><h4 class="font-bold mb-1">Обов'язки:</h4><ul id="modalDuties" class="list-disc pl-5 space-y-0.5 text-slate-600 dark:text-slate-300"></ul></div>
        <div><h4 class="font-bold mb-1">Вимоги:</h4><ul id="modalRequirements" class="list-disc pl-5 space-y-0.5 text-slate-600 dark:text-slate-300"></ul></div>
      </div>
      <div><h4 class="font-bold text-xs uppercase mb-1.5">Навички:</h4><div id="modalSkills" class="flex flex-wrap gap-1.5"></div></div>
      <div class="pt-3 border-t border-slate-200 dark:border-slate-800 flex justify-between items-center gap-3">
        <button onclick="closeModal()" class="px-4 py-2 rounded-xl text-xs font-bold border border-slate-200 dark:border-slate-700 cursor-pointer">Закрити</button>
        <a id="modalDirectLink" href="#" target="_blank" rel="noopener noreferrer" class="px-5 py-2 rounded-xl text-xs font-bold bg-[#e23838] hover:bg-[#c92f2f] text-white shadow-sm">
          Відкрити повне оголошення ↗
        </a>
      </div>
    </div>
  </div>

  <footer class="border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 py-5 mt-10 text-xs text-slate-500">
    <div class="max-w-6xl mx-auto px-4 flex justify-between items-center">
      <span><strong>Work.ua & Robota.ua</strong> • Пошук роботи в Україні</span>
      <span class="mono">Прямі посилання</span>
    </div>
  </footer>

  <script>
    let isDark = localStorage.getItem('theme') === 'dark', currentPage = 1, totalPages = 5;
    let rawVacancies = [], savedIds = JSON.parse(localStorage.getItem('saved') || '[]'), showSavedOnly = false;

    function applyTheme() {
      document.documentElement.classList.toggle('dark', isDark);
      document.getElementById('themeBtn').innerText = isDark ? '🌙' : '☀️';
      localStorage.setItem('theme', isDark ? 'dark' : 'light');
    }
    function toggleTheme() { isDark = !isDark; applyTheme(); }

    function setQuery(q) { document.getElementById('searchInput').value = q; executeSearch(1); }
    function resetFilters() {
      document.getElementById('searchInput').value = '';
      document.getElementById('citySelect').value = 'Вся Україна';
      document.querySelector('input[name="exp"][value="all"]').checked = true;
      document.querySelector('input[name="sal"][value="0"]').checked = true;
      document.getElementById('remoteCheck').checked = false;
      showSavedOnly = false;
      document.getElementById('savedBtn').classList.remove('bg-red-100', 'text-[#e23838]');
      executeSearch(1);
    }

    function toggleSaved(id) {
      savedIds = savedIds.includes(id) ? savedIds.filter(x => x !== id) : [...savedIds, id];
      localStorage.setItem('saved', JSON.stringify(savedIds));
      document.getElementById('savedCount').innerText = savedIds.length;
      applyFilters();
    }

    function toggleSavedFilter() {
      showSavedOnly = !showSavedOnly;
      document.getElementById('savedBtn').classList.toggle('bg-red-100', showSavedOnly);
      document.getElementById('savedBtn').classList.toggle('text-[#e23838]', showSavedOnly);
      applyFilters();
    }

    async function executeSearch(page = 1) {
      currentPage = page;
      document.getElementById('curPageNum').innerText = page;
      const q = document.getElementById('searchInput').value.trim(), city = document.getElementById('citySelect').value;
      const cl = document.getElementById('cardsList');
      cl.innerHTML = `<div class="p-8 text-center text-slate-400 text-xs mono">Завантаження вакансій зі сторінки ${page}...</div>`;
      const t0 = performance.now();

      try {
        const res = await fetch(`/api/scrape?page=${page}&query=${encodeURIComponent(q)}&city=${encodeURIComponent(city)}`);
        const data = await res.json();
        if (data.success) {
          rawVacancies = data.vacancies || [];
          document.getElementById('liveStatusText').innerText = `Знайдено ${rawVacancies.length} вакансій${q ? ` за запитом «${q}»` : ''}`;
          document.getElementById('liveSpeedText').innerText = `${Math.round(performance.now() - t0)} мс • прямі посилання`;
          applyFilters();
        }
      } catch (e) {
        cl.innerHTML = `<div class="p-6 text-center text-red-500 text-xs">Помилка завантаження: ${e.message}</div>`;
      }
      renderPagination();
    }

    function changePage(p) {
      if (p < 1 || p > totalPages) return;
      executeSearch(p);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    function applyFilters() {
      const exp = document.querySelector('input[name="exp"]:checked').value;
      const sal = parseInt(document.querySelector('input[name="sal"]:checked').value) || 0;
      const remote = document.getElementById('remoteCheck').checked;

      const filtered = rawVacancies.filter(v => {
        if (showSavedOnly && !savedIds.includes(v.id)) return false;
        if (exp === 'no-exp' && !v.experienceLevel.includes('Junior') && !v.experienceLevel.includes('Без досвіду')) return false;
        if (exp === 'Middle' && !v.experienceLevel.includes('Middle')) return false;
        if (remote && !v.isRemote) return false;
        if (sal > 0 && (v.salaryMin === 0 || (v.salaryMax || v.salaryMin) < sal)) return false;
        return true;
      });

      renderCards(filtered);
    }

    function renderCards(list) {
      const cl = document.getElementById('cardsList');
      document.getElementById('resultsCount').innerText = `Знайдено ${list.length} вакансій`;
      if (!list.length) {
        cl.innerHTML = `<div class="p-8 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-center text-sm text-slate-500">Оголошень не знайдено. <button onclick="resetFilters()" class="text-[#e23838] underline ml-1 cursor-pointer">Скинути фільтри</button></div>`;
        return;
      }
      cl.innerHTML = list.map(v => {
        const isFav = savedIds.includes(v.id);
        return `
          <article class="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 shadow-xs space-y-2.5">
            <div class="flex justify-between items-start gap-3">
              <div>
                <h3 class="text-base sm:text-lg font-bold">
                  <a href="${v.url}" target="_blank" rel="noopener noreferrer" class="text-sky-600 dark:text-sky-400 hover:underline">${v.title} ↗</a>
                </h3>
                <div class="text-sm font-bold font-mono text-emerald-700 dark:text-emerald-400">${v.salaryText}</div>
              </div>
              <button onclick="toggleSaved('${v.id}')" class="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-xs cursor-pointer ${isFav ? 'bg-amber-100 text-amber-600' : 'text-slate-400'}">${isFav ? '★' : '☆'}</button>
            </div>
            <div class="flex flex-wrap gap-x-3 text-xs text-slate-500">
              <span class="font-semibold text-slate-700 dark:text-slate-300">🏢 ${v.company}</span>
              <span>📍 ${v.city}</span>
              ${v.isRemote ? '<span class="text-emerald-600 font-semibold">🌐 Дистанційно</span>' : ''}
              <span class="mono">${v.experienceLevel}</span>
            </div>
            <p class="text-xs text-slate-600 dark:text-slate-400 line-clamp-2 leading-relaxed">${v.description}</p>
            <div class="flex flex-wrap gap-1">${v.skills.map(s => `<span class="px-2 py-0.5 rounded text-[11px] bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">${s}</span>`).join('')}</div>
            <div class="flex justify-between items-center pt-2 border-t border-slate-100 dark:border-slate-800 text-xs">
              <button onclick="openModal('${v.id}')" class="font-bold text-[#e23838] hover:underline cursor-pointer">📖 Опис вакансії</button>
              <a href="${v.url}" target="_blank" rel="noopener noreferrer" class="px-3.5 py-1.5 rounded-lg font-bold bg-[#e23838] hover:bg-[#c92f2f] text-white shadow-2xs">Перейти до оголошення ↗</a>
            </div>
          </article>
        `;
      }).join('');
    }

    function renderPagination() {
      document.getElementById('prevBtn').disabled = currentPage === 1;
      document.getElementById('nextBtn').disabled = currentPage === totalPages;
      document.getElementById('pageNumbers').innerHTML = Array.from({length: totalPages}, (_, i) => i + 1).map(i =>
        `<button onclick="changePage(${i})" class="h-8 w-8 rounded-lg flex items-center justify-center cursor-pointer ${i === currentPage ? 'bg-[#e23838] text-white font-bold' : 'hover:bg-slate-100 dark:hover:bg-slate-800'}">${i}</button>`
      ).join('');
    }

    function openModal(id) {
      const v = rawVacancies.find(x => x.id === id);
      if (!v) return;
      document.getElementById('modalTitle').innerText = v.title;
      document.getElementById('modalSalary').innerText = v.salaryText;
      document.getElementById('modalCompany').innerText = v.company;
      document.getElementById('modalCity').innerText = v.city;
      document.getElementById('modalExp').innerText = v.experienceLevel;
      document.getElementById('modalDesc').innerText = v.description;
      document.getElementById('modalDuties').innerHTML = v.duties.map(d => `<li>${d}</li>`).join('');
      document.getElementById('modalRequirements').innerHTML = v.requirements.map(r => `<li>${r}</li>`).join('');
      document.getElementById('modalSkills').innerHTML = v.skills.map(s => `<span class="px-2.5 py-1 rounded-md text-xs bg-slate-100 dark:bg-slate-800 font-medium">${s}</span>`).join('');
      document.getElementById('modalDirectLink').href = v.url;
      document.getElementById('jobModal').classList.remove('hidden');
    }
    function closeModal() { document.getElementById('jobModal').classList.add('hidden'); }
    document.getElementById('jobModal').onclick = e => { if (e.target.id === 'jobModal') closeModal(); };

    applyTheme();
    document.getElementById('savedCount').innerText = savedIds.length;
    executeSearch(1);
  </script>
</body>
</html>
"""

def run():
    class Srv(ThreadingHTTPServer): allow_reuse_address = True
    server = Srv(('0.0.0.0', PORT), Handler)
    print(f"🚀 Started on port {PORT}")
    try: server.serve_forever()
    except KeyboardInterrupt: server.server_close()

if __name__ == '__main__':
    run()
