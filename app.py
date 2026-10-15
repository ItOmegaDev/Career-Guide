import json, re, urllib.parse, urllib.request, ssl
from http.server import ThreadingHTTPServer, BaseHTTPRequestHandler

try:
    from bs4 import BeautifulSoup
    HAS_BS4 = True
except ImportError:
    BeautifulSoup = None
    HAS_BS4 = False

PORT = 3000

BROWSER_HEADERS = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36',
    'Accept': 'application/json, text/plain, */*',
    'Accept-Language': 'uk-UA,uk;q=0.9,en-US;q=0.8,en;q=0.7',
    'Referer': 'https://robota.ua/',
    'Origin': 'https://robota.ua',
    'Sec-Ch-Ua': '"Chromium";v="128", "Not;A=Brand";v="24", "Google Chrome";v="128"',
    'Sec-Ch-Ua-Mobile': '?0',
    'Sec-Ch-Ua-Platform': '"Windows"',
    'Sec-Fetch-Dest': 'empty',
    'Sec-Fetch-Mode': 'cors',
    'Sec-Fetch-Site': 'same-site'
}

DOU_HEADERS = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36',
    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
    'Accept-Language': 'uk-UA,uk;q=0.9,en;q=0.8'
}

SSL_CTX = ssl.create_default_context()
SSL_CTX.check_hostname = False
SSL_CTX.verify_mode = ssl.CERT_NONE

POPULAR_PROFESSIONS = [
    "Python", "Python Developer", "Junior Python", "Django", "FastAPI",
    "JavaScript", "Frontend Developer", "React", "Node.js", "Fullstack Developer",
    "Java", "Java Developer", "C#", ".NET Developer", "PHP Developer", "Golang",
    "QA Engineer", "Manual QA", "Automation QA", "Тестувальник",
    "DevOps", "DevOps Engineer", "System Administrator", "Системний адміністратор",
    "Project Manager", "Product Manager", "Scrum Master", "Менеджер проєктів",
    "UI/UX Дизайнер", "Графічний дизайнер", "Веб-дизайнер", "3D Моделер",
    "Менеджер з продажу", "Менеджер по роботі з клієнтами", "B2B Продажі",
    "Бухгалтер", "Головний бухгалтер", "Помічник бухгалтера", "Аудитор", "Економіст",
    "Маркетолог", "SMM-менеджер", "Таргетолог", "Контент-мейкер", "SEO-спеціаліст",
    "Копірайтер", "Редактор", "Перекладач", "Технічний письменник",
    "Рекрутер", "HR-менеджер", "HR Generalist", "Фахівець з підбору персоналу",
    "Юрист", "Помічник юриста", "Юрисконсульт", "Адвокат",
    "Логіст", "Диспетчер", "Менеджер з логістики", "Митний брокер",
    "Водій", "Водій-експедитор", "Водій зі своїм авто", "Кур'єр",
    "Офіс-менеджер", "Адміністратор", "Оператор чату", "Оператор кол-центру",
    "Кухар", "Помічник кухаря", "Шеф-кухар", "Піцайоло", "Сушист",
    "Бариста", "Бармен", "Офіціант", "Касир", "Продавець-консультант",
    "Фінансовий аналітик", "Data Analyst", "Data Scientist", "Machine Learning"
]

ENG_TO_UKR = dict(zip("qwertyuiop[]asdfghjkl;'zxcvbnm,./`", "йцукенгшщзхїфівапролджєячсмитьбю.ʼ"))
UKR_TO_ENG = dict(zip("йцукенгшщзхїфівапролджєячсмитьбю.ʼ", "qwertyuiop[]asdfghjkl;'zxcvbnm,./`"))

EXACT_TYPOS = {
    "пайтон": "Python", "питон": "Python", "пітон": "Python", "pyton": "Python", "phyton": "Python",
    "зідів": "Python", "gscyj": "Python", "знерщт": "Python",
    "джаваскрипт": "JavaScript", "яваскрипт": "JavaScript", "жс": "JavaScript", "реакт": "React", "нода": "Node.js",
    "джава": "Java", "ява": "Java", "c#": "C#", "сишарп": "C#",
    "куа": "QA", "тестер": "QA", "тестувальник": "QA", "кюей": "QA",
    "бугалтер": "Бухгалтер", "бухгалтир": "Бухгалтер", "бугалтир": "Бухгалтер", "бух": "Бухгалтер", "бугхалтер": "Бухгалтер",
    "манагер": "Менеджер", "менеджыр": "Менеджер", "менеджен": "Менеджер", "минеджей": "Менеджер", "менагер": "Менеджер",
    "ваділа": "Водій", "вадитель": "Водій", "водитель": "Водій", "шофер": "Водій",
    "маркетолох": "Маркетолог", "маркетинх": "Маркетинг", "смм": "SMM",
    "диз": "Дизайнер", "дизайныр": "Дизайнер", "дизайн": "Дизайнер",
    "логист": "Логіст", "лагіст": "Логіст", "повар": "Кухар", "повор": "Кухар",
    "админ": "Адміністратор", "адмін": "Адміністратор", "администратор": "Адміністратор",
    "юристконсульт": "Юрист", "юрисконсульт": "Юрист", "копирайтер": "Копірайтер", "копірайт": "Копірайтер",
    "продавец": "Продавець", "консульант": "Консультант", "официант": "Офіціант", "бориста": "Бариста",
    "разработчик": "Розробник", "девелопер": "Developer", "програміст": "Програміст"
}

def levenshtein_dist(s1, s2):
    if len(s1) < len(s2): return levenshtein_dist(s2, s1)
    if len(s2) == 0: return len(s1)
    prev = range(len(s2) + 1)
    for i, c1 in enumerate(s1):
        curr = [i + 1]
        for j, c2 in enumerate(s2):
            curr.append(min(prev[j + 1] + 1, curr[j] + 1, prev[j] + (c1 != c2)))
        prev = curr
    return prev[-1]

def correct_query_spelling(raw_q):
    """Виправляє помилки, розкладку клавіатури та сленгові назви професій."""
    q = raw_q.strip()
    if not q: return "", ""
    q_low = q.lower()

    # 1. Прямий збіг у словнику одруків
    if q_low in EXACT_TYPOS:
        return EXACT_TYPOS[q_low], q

    # 2. Перевірка невірної розкладки клавіатури (eng -> ukr або ukr -> eng)
    trans_ukr = "".join(ENG_TO_UKR.get(c, c) for c in q_low)
    trans_eng = "".join(UKR_TO_ENG.get(c, c) for c in q_low)
    if trans_ukr in EXACT_TYPOS: return EXACT_TYPOS[trans_ukr], q
    if trans_eng in EXACT_TYPOS: return EXACT_TYPOS[trans_eng], q

    for prof in POPULAR_PROFESSIONS:
        p_low = prof.lower()
        if p_low == trans_ukr or p_low == trans_eng:
            return prof, q

    # 3. Нечіткий пошук (Levenshtein) для слів довжиною > 3 літер
    if len(q_low) >= 4:
        best_match = None
        best_dist = 999
        for prof in POPULAR_PROFESSIONS:
            p_low = prof.lower()
            # Перевіряємо перше слово професії або цілу назву
            for term in [p_low, p_low.split()[0]]:
                d = levenshtein_dist(q_low, term)
                max_allowed = 2 if len(q_low) >= 5 else 1
                if d <= max_allowed and d < best_dist:
                    best_dist = d
                    best_match = prof
        if best_match:
            return best_match, q

    return q, q

def clean_html_text(raw_text):
    if not raw_text: return ""
    if HAS_BS4 and BeautifulSoup:
        try: return BeautifulSoup(raw_text, "html.parser").get_text(separator=" ").strip()
        except Exception: pass
    text = re.sub(r'<[^>]+>', ' ', raw_text)
    text = re.sub(r'\s+', ' ', text).strip()
    return re.sub(r'^(Опис вакансії[:\s]*)+', '', text, flags=re.IGNORECASE).strip()

def build_robota_url(vac_id, notebook_id=0):
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

def fetch_robota_vacancies(query, page, city, count=35):
    """Отримує 35-40 вакансій зі вказаної сторінки Robota.ua."""
    kw = f"{query or 'all'} {city}".strip() if city and city != "Вся Україна" else (query or "all")
    api_page = max(0, int(page) - 1)
    api_url = f"https://api.robota.ua/vacancy/search?keyWords={urllib.parse.quote(kw)}&page={api_page}&count={count}"

    req = urllib.request.Request(api_url, headers=BROWSER_HEADERS)
    with urllib.request.urlopen(req, context=SSL_CTX, timeout=5) as resp:
        docs = json.loads(resp.read().decode('utf-8')).get("documents", [])
        items = []
        for doc in docs:
            vid = doc.get("id")
            if not vid: continue
            title = (doc.get("name") or "Вакансія").strip()
            comp = (doc.get("companyName") or "Компанія").strip()
            s_min, s_max, s_text = parse_salary(doc)
            desc = clean_html_text(doc.get("shortDescription", "")) or "Офіційне працевлаштування та професійний розвиток."

            t_low = title.lower()
            exp = "Без досвіду / Junior" if any(x in t_low for x in ["junior", "стажер", "помічник", "trainee"]) else ("Middle" if "middle" in t_low else "Junior")
            remote = (city == "Дистанційно") or ("віддалено" in desc.lower()) or ("remote" in t_low)

            skills = [w.capitalize() for w in query.split() if len(w) > 2] or ["Комунікація", "Організованість", "Excel"]
            skills.extend(["Командна робота", "Швидка навчуваність"])

            items.append({
                "id": f"robota-{vid}", "jobId": str(vid), "title": title, "company": comp,
                "city": doc.get("cityName") or (city if city != "Вся Україна" else "Україна"),
                "page": page, "isRemote": remote, "salaryMin": s_min, "salaryMax": s_max, "salaryText": s_text,
                "experienceLevel": exp, "description": desc, "skills": skills[:5],
                "url": build_robota_url(vid, doc.get("notebookId")), "source": "Robota.ua",
                "duties": [f"Виконання завдань за посадою «{title}»", "Взаємодія з командою для досягнення цілей", "Дотримання високих стандартів якості"],
                "requirements": ["Відповідальність та висока мотивація", "Впевнені навички роботи з ПК", "Швидка навчуваність"],
                "benefits": ["Офіційне працевлаштування та гарантії", "Своєчасна виплата зарплати", "Гнучкий графік або Remote"]
            })
        return items

def scrape_dou_vacancies(query, page, city):
    """Парсить 15-20 вакансій з DOU.ua через BeautifulSoup для потрібної сторінки."""
    kw = query.strip() or "all"
    params = {'search': kw if kw != "all" else "Developer", 'page': page}
    if city and city not in ["Вся Україна", "Дистанційно"]:
        params['city'] = city
    url = f"https://jobs.dou.ua/vacancies/?{urllib.parse.urlencode(params)}"

    req = urllib.request.Request(url, headers=DOU_HEADERS)
    with urllib.request.urlopen(req, context=SSL_CTX, timeout=5) as resp:
        html = resp.read().decode('utf-8', errors='ignore')

    items = []
    if HAS_BS4 and BeautifulSoup:
        soup = BeautifulSoup(html, "html.parser")
        cards = soup.find_all("li", class_="l-vacancy")
        for idx, card in enumerate(cards):
            t_tag = card.find("a", class_="vt")
            if not t_tag: continue
            title = t_tag.get_text(strip=True)
            link = t_tag.get("href", "")

            c_tag = card.find("a", class_="company")
            comp = c_tag.get_text(strip=True) if c_tag else "Компанія"

            s_tag = card.find("span", class_="salary")
            sal_text = s_tag.get_text(strip=True) if s_tag else "За домовленістю"

            loc_tag = card.find("span", class_="cities")
            loc = loc_tag.get_text(strip=True) if loc_tag else (city if city != "Вся Україна" else "Україна")

            d_tag = card.find("div", class_="sh-info")
            desc = d_tag.get_text(separator=" ", strip=True) if d_tag else ""

            t_low = title.lower()
            exp = "Без досвіду / Junior" if any(x in t_low for x in ["junior", "trainee", "помічник"]) else ("Middle" if "middle" in t_low else "Junior")
            remote = ("віддалено" in desc.lower()) or ("remote" in t_low) or (city == "Дистанційно")

            items.append({
                "id": f"dou-{page}-{idx}", "jobId": f"dou-{page}-{idx}", "title": title, "company": comp,
                "city": loc, "page": page, "isRemote": remote, "salaryMin": 0, "salaryMax": 0, "salaryText": sal_text,
                "experienceLevel": exp, "description": desc or "Деталі та умови зазначені у повному оголошенні.",
                "skills": [w.capitalize() for w in query.split() if len(w) > 2] + ["Командна робота", "Комунікація"],
                "url": link, "source": "DOU (BeautifulSoup)",
                "duties": [f"Виконання завдань за профілем «{title}»", "Робота у професійній команді", "Участь у розробці та впровадженні рішень"],
                "requirements": ["Відповідний практичний досвід", "Уважність до деталей та проактивність", "Швидка навчуваність"],
                "benefits": ["Офіційні виплати та соціальний пакет", "Гнучкий графік / Remote", "Професійний розвиток"]
            })
    else:
        # Резервний парсинг regex якщо bs4 не встановлено
        raw_cards = re.findall(r'<li class="l-vacancy"[^>]*>(.*?)</li>', html, re.DOTALL)
        for idx, card in enumerate(raw_cards):
            m_t = re.search(r'<a class="vt" href="([^"]+)"[^>]*>(.*?)</a>', card)
            if not m_t: continue
            link, title = m_t.group(1), re.sub(r'<[^>]+>', '', m_t.group(2)).strip()
            m_c = re.search(r'<a class="company"[^>]*>(.*?)</a>', card, re.DOTALL)
            comp = re.sub(r'<[^>]+>', '', m_c.group(1)).replace('&nbsp;', ' ').strip() if m_c else "Компанія"
            m_s = re.search(r'<span class="salary"[^>]*>([^<]+)</span>', card)
            sal_text = m_s.group(1).strip() if m_s else "За домовленістю"
            m_loc = re.search(r'<span class="cities[^"]*"[^>]*>([^<]+)</span>', card)
            loc = m_loc.group(1).strip() if m_loc else (city if city != "Вся Україна" else "Україна")
            m_d = re.search(r'<div class="sh-info"[^>]*>(.*?)</div>', card, re.DOTALL)
            desc = re.sub(r'<[^>]+>', '', m_d.group(1)).strip() if m_d else ""

            items.append({
                "id": f"dou-{page}-{idx}", "jobId": f"dou-{page}-{idx}", "title": title, "company": comp,
                "city": loc, "page": page, "isRemote": city == "Дистанційно", "salaryMin": 0, "salaryMax": 0,
                "salaryText": sal_text, "experienceLevel": "Junior", "description": desc,
                "skills": ["Комунікація", "Командна робота"], "url": link, "source": "DOU",
                "duties": [f"Виконання завдань за посадою «{title}»"],
                "requirements": ["Базові навички за спеціальністю"],
                "benefits": ["Офіційне працевлаштування"]
            })
    return items

def fetch_multi_source_vacancies(query="", page=1, city=""):
    corrected_q, original_q = correct_query_spelling(query)
    effective_q = corrected_q or query

    all_vacancies = []

    # 1. Запит до Robota.ua (~35 вакансій)
    try:
        robota_items = fetch_robota_api(effective_q, page, city, count=35)
        if robota_items:
            all_vacancies.extend(robota_items)
    except Exception as e:
        print(f"[Robota Notice] {e}")

    # 2. Запит до DOU через BeautifulSoup (~15 вакансій)
    try:
        dou_items = scrape_dou_vacancies(effective_q, page, city)
        if dou_items:
            all_vacancies.extend(dou_items)
    except Exception as e:
        print(f"[DOU Notice] {e}")

    # 3. Якщо Robota.ua повернув 403 і вакансій замало, довантажуємо додаткову сторінку з DOU
    if len(all_vacancies) < 25:
        try:
            extra_dou = scrape_dou_vacancies(effective_q, page * 2, city)
            all_vacancies.extend(extra_dou)
        except Exception:
            pass

    return {
        "vacancies": all_vacancies,
        "total_returned": len(all_vacancies),
        "corrected_query": corrected_q if corrected_q.lower() != original_q.lower() else "",
        "original_query": original_q,
        "effective_query": effective_q
    }

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
            q = qp.get('query', [''])[0]
            page = int(qp.get('page', ['1'])[0])
            city = qp.get('city', [''])[0]

            res = fetch_multi_source_vacancies(query=q, page=page, city=city)
            self.send_response(200)
            self.send_header('Content-Type', 'application/json; charset=utf-8')
            self.send_header('Access-Control-Allow-Origin', '*')
            self.end_headers()
            self.wfile.write(json.dumps({
                "success": True,
                "page": page,
                "city": city,
                "vacancies": res["vacancies"],
                "total": res["total_returned"],
                "corrected_query": res["corrected_query"],
                "original_query": res["original_query"],
                "effective_query": res["effective_query"],
                "bs4_enabled": HAS_BS4
            }, ensure_ascii=False).encode('utf-8'))
        elif p.path == '/api/suggest':
            qp = urllib.parse.parse_qs(p.query)
            prefix = qp.get('q', [''])[0].strip().lower()
            suggestions = []
            if prefix:
                for prof in POPULAR_PROFESSIONS:
                    if prefix in prof.lower():
                        suggestions.append(prof)
                        if len(suggestions) >= 7: break
            self.send_response(200)
            self.send_header('Content-Type', 'application/json; charset=utf-8')
            self.send_header('Access-Control-Allow-Origin', '*')
            self.end_headers()
            self.wfile.write(json.dumps(suggestions, ensure_ascii=False).encode('utf-8'))
        else:
            self.send_response(404)
            self.end_headers()
    def log_message(self, *a): pass

HTML_UI = """<!DOCTYPE html>
<html lang="uk" class="h-full">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Пошук роботи в Україні • Robota.ua & DOU вакансій</title>
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
          <span class="text-xl font-black text-slate-900 dark:text-white">Work<span class="text-[#e23838]">.ua</span> & MultiHub</span>
          <span class="text-[10px] text-slate-500 block">Парсинг вакансій з Robota.ua + DOU</span>
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

  <main class="flex-1 max-w-6xl w-full mx-auto px-4 py-6 space-y-4">
    <div class="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm relative">
      <div class="flex flex-col md:flex-row gap-2.5">
        <div class="flex-1 relative">
          <div class="relative flex items-center">
            <span class="absolute left-3.5 text-slate-400">🔍</span>
            <input type="text" id="searchInput" placeholder="Посада (наприклад: пайтон, бугалтер, водій, менеджер...)"
              autocomplete="off"
              class="w-full pl-10 pr-3 py-2.5 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus:outline-none focus:border-[#e23838]"
              oninput="handleInputSuggestions(this.value)"
              onkeydown="handleKeyNavigation(event)"/>
          </div>
          <!-- Меню автодоповнення слів -->
          <div id="suggestionsMenu" class="absolute left-0 right-0 top-full mt-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl shadow-xl z-50 hidden overflow-hidden text-xs"></div>
        </div>

        <select id="citySelect" class="md:w-56 px-3 py-2.5 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus:outline-none focus:border-[#e23838] cursor-pointer" onchange="executeSearch(1)">
          <option value="Вся Україна">Вся Україна</option>
          <option value="Київ">Київ</option><option value="Львів">Львів</option><option value="Одеса">Одеса</option>
          <option value="Дніпро">Дніпро</option><option value="Харків">Харків</option><option value="Дистанційно">Дистанційно (Remote)</option>
        </select>
        <button onclick="executeSearch(1)" class="px-7 py-2.5 rounded-xl font-bold text-sm text-white bg-[#e23838] hover:bg-[#c92f2f] cursor-pointer shadow-sm">
          Знайти
        </button>
      </div>

      <div class="flex items-center gap-2 mt-3 pt-2.5 border-t border-slate-100 dark:border-slate-800 text-xs overflow-x-auto">
        <span class="text-slate-400">Швидкий пошук:</span>
        <button onclick="setQuery('Python')" class="px-2.5 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 cursor-pointer">Python</button>
        <button onclick="setQuery('Бухгалтер')" class="px-2.5 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 cursor-pointer">Бухгалтер</button>
        <button onclick="setQuery('Менеджер з продажу')" class="px-2.5 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 cursor-pointer">Менеджер</button>
        <button onclick="setQuery('Водій')" class="px-2.5 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 cursor-pointer">Водій</button>
        <button onclick="setQuery('QA Engineer')" class="px-2.5 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 cursor-pointer">QA</button>
        <button onclick="document.getElementById('citySelect').value='Дистанційно'; executeSearch(1)" class="px-2.5 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 cursor-pointer">Дистанційно</button>
      </div>
    </div>

    <!-- Банер виправлення помилок (Fuzzy Search / Typos) -->
    <div id="correctionBanner" class="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 text-xs flex items-center justify-between hidden">
      <div class="flex items-center gap-2 text-amber-800 dark:text-amber-200 font-medium">
        <span>✨</span>
        <span>Знайдено за виправленим запитом: <strong id="correctedWord" class="underline"></strong> (замість «<span id="originalWord"></span>»)</span>
      </div>
      <button onclick="searchOriginalExact()" class="text-xs text-amber-700 dark:text-amber-300 underline cursor-pointer">Шукати оригінал</button>
    </div>

    <div class="p-3 rounded-xl bg-slate-900 text-slate-300 border border-slate-800 text-xs mono flex justify-between items-center">
      <div class="flex items-center gap-2"><span class="h-2 w-2 rounded-full bg-emerald-400 animate-pulse"></span><span id="liveStatusText">Пошук</span></div>
      <span id="liveSpeedText" class="text-slate-400">Джерела: Robota.ua + DOU (BeautifulSoup)</span>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
      <aside class="lg:col-span-4 p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4 text-xs">
        <div class="flex justify-between items-center pb-2 border-b border-slate-100 dark:border-slate-800 font-bold">
          <span>Фільтри результатів</span><button onclick="resetFilters()" class="text-[#e23838] hover:underline cursor-pointer">Скинути всі</button>
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
            <label class="flex items-center gap-2 cursor-pointer"><input type="radio" name="sal" value="50000" onchange="applyFilters()"/> від 50 000 грн</label>
          </div>
        </div>
      </aside>

      <section class="lg:col-span-8 space-y-4">
        <div class="flex justify-between items-center text-sm">
          <span class="font-bold" id="resultsCount">Завантаження...</span>
          <span class="text-xs text-slate-400 mono">Сторінка <span id="curPageNum">1</span></span>
        </div>
        <div id="cardsList" class="space-y-3.5"></div>
        <nav class="p-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex justify-between items-center text-xs font-medium shadow-sm">
          <button onclick="changePage(currentPage-1)" id="prevBtn" class="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 disabled:opacity-30 cursor-pointer">« Попередня</button>
          <div id="pageNumbers" class="flex gap-1 mono overflow-x-auto"></div>
          <button onclick="changePage(currentPage+1)" id="nextBtn" class="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 disabled:opacity-30 cursor-pointer">Наступна »</button>
        </nav>
      </section>
    </div>
  </main>

  <div id="jobModal" class="fixed inset-0 bg-black/60 z-50 hidden flex items-center justify-center p-4 overflow-y-auto">
    <div class="bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 rounded-2xl max-w-2xl w-full p-6 space-y-4 shadow-2xl border border-slate-200 dark:border-slate-800 my-8 max-h-[90vh] overflow-y-auto">
      <div class="flex justify-between items-start border-b border-slate-200 dark:border-slate-800 pb-3">
        <div>
          <span class="text-[10px] font-mono uppercase px-2 py-0.5 rounded font-bold bg-[#e23838] text-white" id="modalSourceBadge">Вакансія</span>
          <h2 id="modalTitle" class="text-xl font-bold leading-tight mt-1.5"></h2>
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
      <span><strong>Work.ua & MultiHub</strong> • Пошук роботи в Україні (Robota.ua + DOU)</span>
      <span class="mono">Прямі посилання на повні вакансії</span>
    </div>
  </footer>

  <script>
    let isDark = localStorage.getItem('theme') === 'dark', currentPage = 1, totalPages = 8;
    let rawVacancies = [], savedIds = JSON.parse(localStorage.getItem('saved') || '[]'), showSavedOnly = false;
    let currentCorrection = null;
    let selectedSuggestIndex = -1;

    const LOCAL_SUGGESTIONS = [
      "Python", "Python Developer", "Junior Python", "JavaScript", "Frontend Developer",
      "React", "Node.js", "Fullstack Developer", "Java Developer", "QA Engineer",
      "Manual QA", "DevOps", "Project Manager", "UI/UX Дизайнер", "Графічний дизайнер",
      "Бухгалтер", "Головний бухгалтер", "Менеджер з продажу", "Водій", "Логіст",
      "Маркетолог", "SMM-менеджер", "Копірайтер", "Юрист", "Кухар", "Бариста", "Касир"
    ];

    function applyTheme() {
      document.documentElement.classList.toggle('dark', isDark);
      document.getElementById('themeBtn').innerText = isDark ? '🌙' : '☀️';
      localStorage.setItem('theme', isDark ? 'dark' : 'light');
    }
    function toggleTheme() { isDark = !isDark; applyTheme(); }

    function setQuery(q) {
      document.getElementById('searchInput').value = q;
      closeSuggestions();
      executeSearch(1);
    }

    function resetFilters() {
      document.getElementById('searchInput').value = '';
      document.getElementById('citySelect').value = 'Вся Україна';
      document.querySelector('input[name="exp"][value="all"]').checked = true;
      document.querySelector('input[name="sal"][value="0"]').checked = true;
      document.getElementById('remoteCheck').checked = false;
      showSavedOnly = false;
      document.getElementById('correctionBanner').classList.add('hidden');
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

    // Автодоповнення при введенні
    function handleInputSuggestions(val) {
      const menu = document.getElementById('suggestionsMenu');
      const q = val.trim().toLowerCase();
      if (!q || q.length < 2) {
        closeSuggestions();
        return;
      }

      const matches = LOCAL_SUGGESTIONS.filter(item => item.toLowerCase().includes(q)).slice(0, 6);
      if (matches.length === 0) {
        closeSuggestions();
        return;
      }

      selectedSuggestIndex = -1;
      menu.innerHTML = matches.map((item, idx) => `
        <div class="px-4 py-2 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer flex items-center justify-between border-b border-slate-100 dark:border-slate-800 last:border-0 suggestion-item"
             onclick="selectSuggestion('${item}')">
          <span class="font-medium">${item}</span>
          <span class="text-[10px] text-slate-400">підказка</span>
        </div>
      `).join('');
      menu.classList.remove('hidden');
    }

    function selectSuggestion(val) {
      document.getElementById('searchInput').value = val;
      closeSuggestions();
      executeSearch(1);
    }

    function closeSuggestions() {
      document.getElementById('suggestionsMenu').classList.add('hidden');
      selectedSuggestIndex = -1;
    }

    function handleKeyNavigation(e) {
      const menu = document.getElementById('suggestionsMenu');
      if (menu.classList.contains('hidden')) {
        if (e.key === 'Enter') executeSearch(1);
        return;
      }

      const items = menu.querySelectorAll('.suggestion-item');
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        selectedSuggestIndex = (selectedSuggestIndex + 1) % items.length;
        updateSuggestFocus(items);
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        selectedSuggestIndex = (selectedSuggestIndex - 1 + items.length) % items.length;
        updateSuggestFocus(items);
      } else if (e.key === 'Enter') {
        if (selectedSuggestIndex >= 0 && items[selectedSuggestIndex]) {
          e.preventDefault();
          items[selectedSuggestIndex].click();
        } else {
          closeSuggestions();
          executeSearch(1);
        }
      } else if (e.key === 'Escape') {
        closeSuggestions();
      }
    }

    function updateSuggestFocus(items) {
      items.forEach((it, idx) => {
        if (idx === selectedSuggestIndex) {
          it.classList.add('bg-slate-100', 'dark:bg-slate-800');
        } else {
          it.classList.remove('bg-slate-100', 'dark:bg-slate-800');
        }
      });
    }

    document.addEventListener('click', e => {
      if (!e.target.closest('#searchInput') && !e.target.closest('#suggestionsMenu')) {
        closeSuggestions();
      }
    });

    async function executeSearch(page = 1) {
      currentPage = page;
      document.getElementById('curPageNum').innerText = page;
      const q = document.getElementById('searchInput').value.trim(), city = document.getElementById('citySelect').value;
      const cl = document.getElementById('cardsList');
      closeSuggestions();

      cl.innerHTML = `<div class="p-10 text-center text-slate-400 text-xs mono">Завантаження ${page} (Robota.ua + DOU)...</div>`;
      const t0 = performance.now();

      try {
        const res = await fetch(`/api/scrape?page=${page}&query=${encodeURIComponent(q)}&city=${encodeURIComponent(city)}`);
        const data = await res.json();
        if (data.success) {
          rawVacancies = data.vacancies || [];
          const dur = Math.round(performance.now() - t0);

          // Перевірка чи було виправлено одрук
          const cBanner = document.getElementById('correctionBanner');
          if (data.corrected_query) {
            currentCorrection = { corrected: data.corrected_query, original: data.original_query };
            document.getElementById('correctedWord').innerText = data.corrected_query;
            document.getElementById('originalWord').innerText = data.original_query;
            cBanner.classList.remove('hidden');
          } else {
            cBanner.classList.add('hidden');
          }

          document.getElementById('liveStatusText').innerText = `Знайдено ${rawVacancies.length} вакансій на сторінці ${page}${q ? ` за запитом «${data.effective_query}»` : ''}`;
          document.getElementById('liveSpeedText').innerText = `${dur} мс • зібрано ${rawVacancies.length} оголошень`;
          applyFilters();
        }
      } catch (e) {
        cl.innerHTML = `<div class="p-6 text-center text-red-500 text-xs">Помилка завантаження: ${e.message}</div>`;
      }
      renderPagination();
    }

    function searchOriginalExact() {
      if (currentCorrection) {
        document.getElementById('searchInput').value = currentCorrection.original;
        document.getElementById('correctionBanner').classList.add('hidden');
        executeSearch(1);
      }
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
      document.getElementById('resultsCount').innerText = `Відображено ${list.length} вакансій (всього зібрано ${rawVacancies.length})`;
      if (!list.length) {
        cl.innerHTML = `<div class="p-8 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-center text-sm text-slate-500">Оголошень за обраними фільтрами не знайдено. <button onclick="resetFilters()" class="text-[#e23838] underline ml-1 cursor-pointer">Скинути фільтри</button></div>`;
        return;
      }
      cl.innerHTML = list.map(v => {
        const isFav = savedIds.includes(v.id);
        const isDou = (v.source || '').includes('DOU');
        const badgeColor = isDou ? 'bg-sky-100 text-sky-800 dark:bg-sky-950 dark:text-sky-300' : 'bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-300';

        return `
          <article class="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 shadow-xs space-y-2.5">
            <div class="flex justify-between items-start gap-3">
              <div>
                <h3 class="text-base sm:text-lg font-bold">
                  <a href="${v.url}" target="_blank" rel="noopener noreferrer" class="text-sky-600 dark:text-sky-400 hover:underline">${v.title} ↗</a>
                </h3>
                <div class="text-sm font-bold font-mono text-emerald-700 dark:text-emerald-400">${v.salaryText}</div>
              </div>
              <div class="flex items-center gap-1.5 shrink-0">
                <button onclick="toggleSaved('${v.id}')" class="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-xs cursor-pointer ${isFav ? 'bg-amber-100 text-amber-600' : 'text-slate-400'}">${isFav ? '★' : '☆'}</button>
                <span class="text-[10px] font-mono px-2 py-0.5 rounded font-bold uppercase ${badgeColor}">${v.source || 'Вакансія'}</span>
              </div>
            </div>
            <div class="flex flex-wrap gap-x-3 text-xs text-slate-500">
              <span class="font-semibold text-slate-700 dark:text-slate-300">🏢 ${v.company}</span>
              <span>📍 ${v.city}</span>
              ${v.isRemote ? '<span class="text-emerald-600 font-semibold">🌐 Дистанційно</span>' : ''}
              <span class="mono">${v.experienceLevel}</span>
            </div>
            <p class="text-xs text-slate-600 dark:text-slate-400 line-clamp-2 leading-relaxed">${v.description}</p>
            <div class="flex flex-wrap gap-1">${(v.skills || []).map(s => `<span class="px-2 py-0.5 rounded text-[11px] bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">${s}</span>`).join('')}</div>
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
      document.getElementById('modalSourceBadge').innerText = v.source || 'Вакансія';
      document.getElementById('modalDuties').innerHTML = (v.duties || []).map(d => `<li>${d}</li>`).join('');
      document.getElementById('modalRequirements').innerHTML = (v.requirements || []).map(r => `<li>${r}</li>`).join('');
      document.getElementById('modalSkills').innerHTML = (v.skills || []).map(s => `<span class="px-2.5 py-1 rounded-md text-xs bg-slate-100 dark:bg-slate-800 font-medium">${s}</span>`).join('');
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
    print(f"🚀 Started on port {PORT} (BeautifulSoup: {'active' if HAS_BS4 else 'fallback regex'})")
    try: server.serve_forever()
    except KeyboardInterrupt: server.server_close()

if __name__ == '__main__':
    run()
