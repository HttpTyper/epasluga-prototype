(() => {
  const DATA = window.EPASLUGA_DATA;
  const PAGE_SIZE = 16;
  const FAV_KEY = "epasluga-favs";
  const DRAFT_PREFIX = "epasluga-draft:";
  const APPS_KEY = "epasluga-apps";
  const NOTIF_KEY = "epasluga-notifs";
  const STATUSES = ["Черновик", "На проверке", "Ожидает оплаты", "Выполнено", "Отозвано", "Отказано"];
  const PERSONA = {
    lastName: "Иванов",
    firstName: "Алексей",
    middleName: "Сергеевич",
    fullName: "Иванов Алексей Сергеевич",
    shortName: "Алексей Сергеевич",
    initials: "АС",
    idNumber: "1140390A012PB8",
    birthDate: "14.03.1990",
    gender: "мужской",
    citizenship: "Республика Беларусь",
    address: "220030, г. Минск, ул. Карла Маркса, д. 14, кв. 27",
    passport: {
      series: "MP",
      number: "3456789",
      until: "15.08.2032",
      issued: "РУВД Московского района г. Минска",
    },
    contacts: [
      { type: "Мобильный телефон", value: "+375 29 555-12-34" },
      { type: "Домашний телефон", value: "+375 17 287-11-20" },
      { type: "Электронная почта", value: "a.ivanov@example.by" },
      { type: "Электронная почта (дополнительная)", value: "ivanov.as@mail.by" },
    ],
    phone: "+375 29 555-12-34",
    email: "a.ivanov@example.by",
  };

  const CATEGORIES = [
    { id: "ip", title: "Объекты промышленной собственности", desc: "Патенты, товарные знаки, лицензии на изобретения и бренды.", icon: "star" },
    { id: "law", title: "Правопорядок и ответственность", desc: "Судимость, штрафы не из ГАИ, банкротство, исполнительные листы.", icon: "brief" },
    { id: "edu", title: "Образование, наука и культура", desc: "Детский сад, учёба, стипендия, памятники и культура.", icon: "file" },
    { id: "family", title: "Семья и быт", desc: "Пособия на детей, состав семьи, многодетность, захоронения.", icon: "user" },
    { id: "work", title: "Работа и занятость", desc: "Стаж, безработица, занятость в экономике, сведения о работе.", icon: "brief" },
    { id: "visa", title: "Визы и путешествия", desc: "Приглашения, временное проживание, пересечение границы.", icon: "id" },
    { id: "internet", title: "Интернет, безопасность", desc: "Радиочастоты, радиолюбители, электронные средства связи.", icon: "search" },
    { id: "land", title: "Земельно-имущественные отношения", desc: "Жильё, земля, недвижимость, учёт нуждающихся.", icon: "home" },
    { id: "health", title: "Здравоохранение", desc: "Медсправки, больничные, сведения о здоровье.", icon: "file" },
    { id: "finance", title: "Финансы и торговля", desc: "Налоги, доходы, пенсии, торговый реестр, лицевой счёт.", icon: "wallet" },
    { id: "edo", title: "Электронный документооборот", desc: "Квитанции, проверка подлинности электронных документов.", icon: "folder" },
    { id: "documents", title: "Документы", desc: "Справки, выписки и сведения, которые не легли в другие темы.", icon: "file" },
    { id: "agro", title: "Сельское хозяйство", desc: "Паспорт животного, сорта растений, селекция.", icon: "file" },
    { id: "passport", title: "Гражданство, паспорт, ID-карта", desc: "Паспорт, регистрация, действительность документов, личные данные.", icon: "id" },
    { id: "border", title: "Граница и таможня", desc: "Декларации, таможенные платежи, пропуска в погранзону.", icon: "folder" },
    { id: "gai", title: "ГАИ, транспорт", desc: "Авто, VIN, права, штрафы ПДД, диагностика.", icon: "car" },
    { id: "license", title: "Лицензирование", desc: "Лицензии, адвокатура, перевозки, оружие, образовательные разрешения.", icon: "check" },
  ];

  const $ = (sel, el = document) => el.querySelector(sel);
  const $$ = (sel, el = document) => [...el.querySelectorAll(sel)];

  const state = { route: { name: "home" }, q: "", situation: "", category: "", view: "cats", page: 1 };

  const NAV_OPEN_KEY = "epasluga-nav-open";
  const navOpen = (() => {
    try {
      const saved = JSON.parse(sessionStorage.getItem(NAV_OPEN_KEY) || "null");
      if (Array.isArray(saved)) return new Set(saved);
    } catch (_) {}
    return new Set(["available"]);
  })();
  const saveNavOpen = () => sessionStorage.setItem(NAV_OPEN_KEY, JSON.stringify([...navOpen]));

  const TRAIL_KEY = "epasluga-trail";
  let trail = (() => {
    try {
      const saved = JSON.parse(sessionStorage.getItem(TRAIL_KEY) || "[]");
      if (Array.isArray(saved)) return saved;
    } catch (_) {}
    return [];
  })();
  const saveTrail = () => sessionStorage.setItem(TRAIL_KEY, JSON.stringify(trail));
  const trailHas = (key) => trail.some((t) => t.key === key);

  const favs = new Set(JSON.parse(localStorage.getItem(FAV_KEY) || "[]"));
  const saveFavs = () => localStorage.setItem(FAV_KEY, JSON.stringify([...favs]));
  if (localStorage.getItem(FAV_KEY) == null) {
    ["3.05.03", "200.12.1", "200.15.11"].forEach((id) => favs.add(id));
    saveFavs();
  }
  function sortFavFirst(list) {
    return [...list].sort((a, b) => Number(favs.has(b.id)) - Number(favs.has(a.id)));
  }

  function serviceCategory(s) {
    const t = `${s.title} ${s.official} ${s.code}`.toLowerCase();
    if (s.situations.includes("ip") || /патент|товарн|изобрет|полезн|бренд|селекц/.test(t)) {
      if (/сорт расте|животн|стада|селекц/.test(t)) return "agro";
      return "ip";
    }
    if (s.situations.includes("transport") || /гибдд|пдд|vin|автомоб|транспорт|водитель|гаи/.test(t)) return "gai";
    if (s.situations.includes("customs") || /тамож|погран/.test(t)) return "border";
    if (s.situations.includes("health") || /медицин|больнич|здоров/.test(t)) return "health";
    if (s.situations.includes("study") || /образован|садик|стипенд|талантлив/.test(t)) return "edu";
    if (/виз|приглашен|временн(ое|ого) прожив|пересечен/.test(t)) return "visa";
    if (/паспорт|гражданств|id-карт|удостовер.*личн|регистрац.*населен/.test(t) && !/авто|транспорт/.test(t)) return "passport";
    if (s.situations.includes("family") || /пособи|дете|семь|многодетн|захоронен/.test(t)) return "family";
    if (s.situations.includes("housing") || /жил|земел|недвижим|кадастр/.test(t)) return "land";
    if (s.situations.includes("work") && !s.situations.includes("tax")) return "work";
    if (/радио|частот|интернет/.test(t)) return "internet";
    if (/квитанц|дtc|дтс|подлинност.*эд|электронн.*документ/.test(t)) return "edo";
    if (/лиценз|адвокат|оруж/.test(t) || s.situations.includes("business")) return "license";
    if (/правонаруш|судим|банкрот|исполнител|приказн/.test(t) || s.situations.includes("army")) return "law";
    if (s.situations.includes("tax") || s.situations.includes("pension") || /налог|доход|пенс|торгов/.test(t)) return "finance";
    if (s.situations.includes("docs")) return "documents";
    return "documents";
  }

  function servicesInCategory(id) {
    return DATA.services.filter((s) => serviceCategory(s) === id);
  }

  function todayIso() {
    return new Date().toISOString();
  }
  function daysAgoIso(n) {
    const d = new Date();
    d.setDate(d.getDate() - n);
    return d.toISOString();
  }

  function normalizeApp(r) {
    let status = r.status || "На проверке";
    if (status.includes("Принято")) status = "На проверке";
    return {
      id: r.id || "a" + (r.num || Date.now()),
      num: r.num,
      title: r.title,
      serviceId: r.serviceId,
      initiator: r.initiator || "—",
      status: STATUSES.includes(status) ? status : "На проверке",
      at: r.at || todayIso(),
      comment: r.comment || "",
    };
  }
  function seedApps() {
    const rows = [
      { id: "a1", num: "453346557107272", title: "Справка о доходах", serviceId: "3.05.03", initiator: "Министерство по налогам и сборам", status: "Выполнено", at: daysAgoIso(0), comment: "" },
      { id: "a2", num: "289953663290680", title: "Справка о доходах", serviceId: "3.05.03", initiator: "Министерство по налогам и сборам", status: "Ожидает оплаты", at: daysAgoIso(0), comment: "" },
      { id: "a3", num: "100294837561002", title: "Паспорт", serviceId: "200.12.1", initiator: "Министерство внутренних дел", status: "На проверке", at: daysAgoIso(1), comment: "" },
      { id: "a4", num: "100294837561088", title: "Зарегистрировать авто", serviceId: "200.15.11", initiator: "Министерство внутренних дел", status: "Черновик", at: daysAgoIso(2), comment: "" },
      { id: "a5", num: "100294837561201", title: "Справка призывнику", serviceId: "200.20.5", initiator: "Министерство обороны", status: "Отозвано", at: daysAgoIso(4), comment: "" },
      { id: "a6", num: "100294837561333", title: "Лицензия адвоката", serviceId: "200.17-1.1", initiator: "Министерство юстиции", status: "Отказано", at: daysAgoIso(8), comment: "Неполный комплект документов" },
    ];
    const existing = localStorage.getItem(APPS_KEY);
    if (!existing) {
      localStorage.setItem(APPS_KEY, JSON.stringify(rows));
      return rows;
    }
    const stored = JSON.parse(existing).map(normalizeApp);
    if (stored.some((r) => r.id === "a1")) return stored;
    const merged = [...stored.filter((r) => r.num && !rows.some((s) => s.num === r.num)), ...rows];
    localStorage.setItem(APPS_KEY, JSON.stringify(merged));
    return merged;
  }
  function loadApps() {
    return seedApps();
  }
  function saveApps(rows) {
    localStorage.setItem(APPS_KEY, JSON.stringify(rows));
  }

  function seedNotifs() {
    if (localStorage.getItem(NOTIF_KEY)) return JSON.parse(localStorage.getItem(NOTIF_KEY));
    const rows = [
      { id: "n1", kind: "legal", title: "Справка о доходах — Готово", body: "Документ можно скачать в разделе «Мои услуги».", at: daysAgoIso(0), archived: false },
      { id: "n2", kind: "legal", title: "Справка о доходах — Ожидает оплаты", body: "Заявление 289953663290680 не будет выдано, пока не поступит оплата.", at: daysAgoIso(0), archived: false },
      { id: "n3", kind: "legal", title: "Справка призывнику — Отозвано", body: "Вы отменили заявление. Документ не действует. Можно подать новое.", at: daysAgoIso(4), archived: false },
      { id: "n4", kind: "legal", title: "Лицензия адвоката — Отказано", body: "Ведомство не смогло оказать услугу. Причина указана в «Мои услуги».", at: daysAgoIso(8), archived: false },
      { id: "n5", kind: "info", title: "Плановые работы на портале 1 ноября", body: "Ночью кабинет может быть недоступен около двух часов.", at: daysAgoIso(1), archived: false },
      { id: "n6", kind: "info", title: "Черновик заявления не отправлен", body: "Регистрация авто сохранена как черновик. Его можно дозаполнить в «Мои услуги».", at: daysAgoIso(2), archived: false },
    ];
    localStorage.setItem(NOTIF_KEY, JSON.stringify(rows));
    return rows;
  }
  function loadNotifs() {
    return seedNotifs();
  }
  function saveNotifs(rows) {
    localStorage.setItem(NOTIF_KEY, JSON.stringify(rows));
  }

  function parseHash() {
    const raw = location.hash.replace(/^#/, "") || "/";
    const [path, query = ""] = raw.split("?");
    const params = new URLSearchParams(query);
    const parts = path.split("/").filter(Boolean);
    if (!parts.length) return { name: "home" };
    if (parts[0] === "catalog") {
      const cat = params.get("cat") || "";
      const view = params.get("view") || (cat ? "list" : "cats");
      return {
        name: "catalog",
        q: params.get("q") || "",
        situation: params.get("sit") || "",
        category: cat,
        view,
        page: Math.max(1, parseInt(params.get("page") || "1", 10)),
      };
    }
    if (parts[0] === "service" && parts[1])
      return {
        name: "service",
        id: decodeURIComponent(parts[1]),
        from: params.get("from") || "list",
        cat: params.get("cat") || "",
      };
    if (parts[0] === "profile") return { name: "profile" };
    if (parts[0] === "apps") return { name: "apps" };
    if (parts[0] === "inbox") return { name: "inbox", box: params.get("box") || "in" };
    return { name: "home" };
  }

  function go(hash) {
    location.hash = hash.startsWith("#") ? hash : `#${hash}`;
  }

  function catalogHash(over = {}) {
    const q = over.q !== undefined ? over.q : state.q;
    const sit = over.situation !== undefined ? over.situation : state.situation;
    const cat = over.category !== undefined ? over.category : state.category;
    const view = over.view !== undefined ? over.view : state.view;
    const page = over.page !== undefined ? over.page : state.page;
    const p = new URLSearchParams();
    if (view && view !== "cats") p.set("view", view);
    if (q) p.set("q", q);
    if (sit) p.set("sit", sit);
    if (cat) p.set("cat", cat);
    if (page > 1) p.set("page", String(page));
    const qs = p.toString();
    return `#/catalog${qs ? `?${qs}` : ""}`;
  }

  function serviceHref(s) {
    return `#/service/${encodeURIComponent(s.id)}`;
  }

  function crumbNode(route) {
    if (route.name === "home") return { key: "home", href: "#/", label: "Главная", root: true };
    if (route.name === "profile") return { key: "profile", href: "#/profile", label: "Мой профиль", root: true };
    if (route.name === "apps") return { key: "apps", href: "#/apps", label: "Мои услуги", root: true };
    if (route.name === "inbox") {
      if (route.box === "arch")
        return {
          key: "inbox-arch",
          href: "#/inbox?box=arch",
          label: "Архив",
          fallback: [{ key: "inbox", href: "#/inbox", label: "Мои уведомления" }],
        };
      return { key: "inbox", href: "#/inbox", label: "Мои уведомления", root: true };
    }
    if (route.name === "catalog") {
      if (route.view === "favs") return { key: "favs", href: "#/catalog?view=favs", label: "Избранные услуги", root: true };
      if (route.category) {
        const cat = CATEGORIES.find((c) => c.id === route.category);
        return {
          key: "cat:" + route.category,
          href: catalogHash({ category: route.category, view: "list", page: 1, q: "", situation: "" }),
          label: cat ? cat.title : "Категория",
          fallback: [{ key: "cats", href: "#/catalog", label: "Услуги по категориям" }],
        };
      }
      if (route.view === "cats") return { key: "cats", href: "#/catalog", label: "Услуги по категориям", root: true };
      return { key: "list", href: "#/catalog?view=list", label: "Все услуги", root: true };
    }
    if (route.name === "service") {
      const svc = serviceById(route.id);
      let fallback = [{ key: "list", href: "#/catalog?view=list", label: "Все услуги" }];
      if (route.from === "apps") fallback = [{ key: "apps", href: "#/apps", label: "Мои услуги" }];
      else if (route.from === "favs") fallback = [{ key: "favs", href: "#/catalog?view=favs", label: "Избранные услуги" }];
      else if (route.from === "cats") {
        fallback = [{ key: "cats", href: "#/catalog", label: "Услуги по категориям" }];
        const cat = CATEGORIES.find((c) => c.id === route.cat);
        if (cat)
          fallback.push({
            key: "cat:" + cat.id,
            href: catalogHash({ category: cat.id, view: "list", page: 1, q: "", situation: "" }),
            label: cat.title,
          });
      }
      return {
        key: "svc:" + route.id,
        href: `#/service/${encodeURIComponent(route.id)}`,
        label: svc ? svc.title : "Услуга",
        leaf: true,
        fallback,
      };
    }
    return { key: "home", href: "#/", label: "Главная", root: true };
  }

  function syncTrail(node) {
    const home = { key: "home", href: "#/", label: "Главная" };
    const asItem = (n) => ({ key: n.key, href: n.href, label: n.label, leaf: !!n.leaf });
    if (!node || node.key === "home") {
      trail = [home];
      saveTrail();
      return;
    }
    if (node.root) {
      trail = [home, asItem(node)];
      saveTrail();
      return;
    }
    const idx = trail.findIndex((t) => t.key === node.key);
    if (idx >= 0) {
      trail = trail.slice(0, idx).concat([asItem(node)]);
      saveTrail();
      return;
    }
    const last = trail[trail.length - 1];
    if (node.leaf && last?.leaf) {
      trail = trail.slice(0, -1).concat([asItem(node)]);
      saveTrail();
      return;
    }
    if (trail.length > 1) {
      trail = trail.concat([asItem(node)]);
      saveTrail();
      return;
    }
    trail = [home, ...(node.fallback || []), asItem(node)];
    saveTrail();
  }

  function pageCrumb() {
    if (trail.length < 2) return "";
    return crumb(trail.map((t, i) => (i === trail.length - 1 ? { label: t.label } : t)));
  }

  function icon(name) {
    const common = `width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"`;
    const map = {
      user: `<circle cx="12" cy="8" r="3.2"/><path d="M5 19c1.5-3 4-4.5 7-4.5S17.5 16 19 19"/>`,
      bell: `<path d="M6 16h12l-1.2-2.2V10a4.8 4.8 0 1 0-9.6 0v3.8L6 16Z"/><path d="M10 16a2 2 0 0 0 4 0"/>`,
      list: `<path d="M8 7h12M8 12h12M8 17h12"/><circle cx="4" cy="7" r=".8" fill="currentColor"/><circle cx="4" cy="12" r=".8" fill="currentColor"/><circle cx="4" cy="17" r=".8" fill="currentColor"/>`,
      grid: `<rect x="4" y="5" width="6" height="6" rx="1"/><rect x="14" y="5" width="6" height="6" rx="1"/><rect x="4" y="14" width="6" height="6" rx="1"/><rect x="14" y="14" width="6" height="6" rx="1"/>`,
      star: `<path d="m12 4 2.1 4.4 4.9.7-3.5 3.4.8 4.9L12 15.5 7.7 17.4l.8-4.9L5 9.1l4.9-.7L12 4Z"/>`,
      brief: `<rect x="4" y="8" width="16" height="11" rx="2"/><path d="M9 8V7a3 3 0 0 1 6 0v1"/><path d="M4 13h16"/>`,
      wallet: `<rect x="3" y="7" width="18" height="12" rx="2"/><circle cx="16" cy="13" r="1.2" fill="currentColor"/>`,
      mail: `<rect x="4" y="6" width="16" height="12" rx="2"/><path d="m5 8 7 5 7-5"/>`,
      building: `<path d="M5 20V6l7-3 7 3v14"/><path d="M9 20v-6h6v6"/>`,
      search: `<circle cx="11" cy="11" r="6"/><path d="m20 20-4-4"/>`,
      folder: `<path d="M4 7h6l2 2h8v10H4V7Z"/>`,
      id: `<rect x="3" y="6" width="18" height="12" rx="2"/><circle cx="9" cy="12" r="2"/><path d="M13 11h5M13 14h4"/>`,
      check: `<rect x="4" y="4" width="16" height="16" rx="2"/><path d="m8 12 2.5 2.5L16 9"/>`,
      home: `<path d="m4 11 8-7 8 7v9H4v-9Z"/>`,
      file: `<path d="M7 4h7l5 5v11H7V4Z"/><path d="M14 4v5h5"/>`,
      car: `<path d="M5 16h14l-1-5H6l-1 5Z"/><circle cx="8" cy="16" r="1"/><circle cx="16" cy="16" r="1"/>`,
    };
    return `<svg ${common}>${map[name] || map.file}</svg>`;
  }

  function norm(s) {
    return (s || "").toLowerCase().replace(/ё/g, "е").trim();
  }

  function serviceById(id) {
    return DATA.services.find((s) => s.id === id || s.code === id);
  }

  function searchServices(q, situation, category) {
    const query = norm(q);
    let list = DATA.services;
    if (situation) list = list.filter((s) => s.situations.includes(situation));
    if (category) list = list.filter((s) => serviceCategory(s) === category);
    if (!query) return list;
    const synHits = new Set();
    Object.entries(DATA.synonyms).forEach(([key, ids]) => {
      if (query.includes(norm(key)) || norm(key).includes(query)) ids.forEach((id) => synHits.add(id));
    });
    return list.filter((s) => {
      const blob = norm([s.title, s.official, s.code, s.org.name].join(" "));
      return blob.includes(query) || synHits.has(s.code) || synHits.has(s.id);
    });
  }

  function suggestions(q) {
    const found = searchServices(q, "", "");
    const cats = CATEGORIES.filter((c) => norm(c.title + " " + c.desc).includes(norm(q)));
    const extra = [];
    Object.entries(DATA.synonyms).forEach(([key, ids]) => {
      if (norm(key).includes(norm(q))) extra.push({ type: "syn", key, ids });
    });
    return { services: found.slice(0, 6), syn: extra.slice(0, 2), cats: cats.slice(0, 4) };
  }

  function renderSuggest(target, q) {
    const box = target;
    if (!q) {
      box.classList.remove("is-open");
      box.innerHTML = "";
      return;
    }
    const { services, syn, cats } = suggestions(q);
    if (!services.length && !syn.length && !cats.length) {
      box.classList.add("is-open");
      box.innerHTML = `<div style="padding:12px 14px;color:#5c5e72">Ничего не нашли. Попробуйте «доходы», «паспорт», «авто».</div>`;
      return;
    }
    const catHtml = cats
      .map((c) => `<button type="button" data-cat="${c.id}"><strong>${c.title}</strong><span class="hint">категория</span></button>`)
      .join("");
    const synHtml = syn
      .map((s) => `<button type="button" data-syn="${s.key}">Искать как «${s.key}» <span class="hint">синоним</span></button>`)
      .join("");
    const svcHtml = services
      .map((s) => `<button type="button" data-id="${s.id}"><strong>${s.title}</strong><span class="code">${s.code}</span></button>`)
      .join("");
    box.innerHTML = catHtml + synHtml + svcHtml;
    box.classList.add("is-open");
    $$("button", box).forEach((btn) => {
      btn.addEventListener("mousedown", (e) => e.preventDefault());
      btn.addEventListener("click", () => {
        if (btn.dataset.id) {
          const svc = serviceById(btn.dataset.id);
          go(svc ? serviceHref(svc) : `#/service/${encodeURIComponent(btn.dataset.id)}`);
        }
        if (btn.dataset.syn) go(catalogHash({ q: btn.dataset.syn, page: 1, view: "list", category: "" }));
        if (btn.dataset.cat) go(catalogHash({ category: btn.dataset.cat, view: "list", page: 1, q: "" }));
        box.classList.remove("is-open");
      });
    });
  }

  function navHtml() {
    const r = state.route;
    const fromApps = r.name === "service" && trailHas("apps");
    const catOn = (r.name === "catalog" && r.view !== "favs") || (r.name === "service" && !fromApps);
    const item = (opts) => {
      const { href, iconName, label, active, disabled } = opts;
      const cls = ["nav-item", active ? "is-active" : "", disabled ? "is-disabled" : ""].join(" ");
      const tag = disabled ? "button" : "a";
      const extra = disabled ? `type="button" data-disabled="1"` : `href="${href}"`;
      return `<${tag} class="${cls}" ${extra}>
        ${icon(iconName)}<span>${label}</span>
      </${tag}>`;
    };
    const stub = (label) =>
      `<button type="button" class="nav-sub is-disabled" data-disabled="1"><span>${label}</span></button>`;
    const group = (id, head, childrenHtml) => {
      const open = navOpen.has(id);
      return `
        <div class="nav-group">
          <button type="button" class="nav-item ${head.active ? "is-active" : ""} ${open ? "is-expanded" : ""}" data-nav-toggle="${id}">
            ${icon(head.iconName)}<span>${head.label}</span><span class="nav-caret" aria-hidden="true"><svg viewBox="0 0 16 16" focusable="false"><path d="M3 5.2h10L8 12.2z" fill="currentColor"/></svg></span>
          </button>
          <div class="nav-children ${open ? "is-open" : ""}" id="nav-${id}">${childrenHtml}</div>
        </div>`;
    };
    return `
      <div class="nav-label">Кабинет</div>
      ${item({ href: "#/", iconName: "home", label: "Главная", active: r.name === "home" })}
      ${item({ href: "#/profile", iconName: "user", label: "Мой профиль", active: r.name === "profile" })}
      ${item({ href: "#/inbox", iconName: "bell", label: "Мои уведомления", active: r.name === "inbox" })}
      ${item({ href: "#/apps", iconName: "list", label: "Мои услуги", active: r.name === "apps" || fromApps })}
      <div class="nav-label">Услуги</div>
      ${group(
        "available",
        { iconName: "grid", label: "Доступные услуги", active: catOn },
        `<a class="nav-sub ${r.name === "catalog" && r.view === "list" ? "is-active" : ""}" href="#/catalog?view=list"><span>Все услуги</span></a>
         <a class="nav-sub ${r.name === "catalog" && r.view === "favs" ? "is-active" : ""}" href="#/catalog?view=favs"><span>Избранные услуги</span></a>`
      )}
      <div class="nav-label">Ещё</div>
      ${group("reputation", { iconName: "brief", label: "Деловая репутация" }, `${stub("Сведения о репутации")}${stub("Запросы")}`)}
      ${group("finance", { iconName: "wallet", label: "Финансовая информация" }, `${stub("Налоги")}${stub("Пенсии")}${stub("Лицевой счёт")}`)}
      ${group("mail", { iconName: "mail", label: "Почта гражданина" }, `${stub("Входящие")}${stub("Отправленные")}`)}
      ${item({ iconName: "building", label: "Активация кабинета <span class=\"nav-nl\">организации</span>", disabled: true })}
      ${item({ iconName: "search", label: "Проверка документа", disabled: true })}
      ${item({ iconName: "folder", label: "Репозиторий документов", disabled: true })}
      ${group("esifyul", { iconName: "id", label: "ЕС ИФЮЛ" }, `${stub("Кабинет организации")}${stub("Сведения")}`)}
      ${item({ iconName: "check", label: "Документация", disabled: true })}
    `;
  }

  function layout(inner) {
    return `
      <aside class="sidebar">
        <a class="brand" href="#/" title="Е-Паслуга">
          <span class="brand-mark" aria-hidden="true"></span>
          <span class="brand-short">Е-П</span>
          <span class="brand-text">Е-Паслуга</span>
        </a>
        <div class="brand-sub">Личный кабинет гражданина</div>
        <nav class="nav">${navHtml()}</nav>
      </aside>
      <div class="workspace">
        <header class="topbar">
          <button class="burger" type="button" data-disabled="1">${icon("mail")} Обратная связь</button>
          <a class="user-chip" href="#/profile" title="Открыть профиль">
            <span class="avatar">${PERSONA.initials}</span>
            <span><b>${PERSONA.shortName}</b><small>Мой профиль</small></span>
          </a>
        </header>
        <main class="page">${inner}</main>
        <footer class="footer">
          <div>
            ©2026 Республиканское унитарное предприятие<br>
            «Национальный центр электронных услуг»<br>
            220140, г. Минск, ул. Притыцкого, 64<br>
            УНП 191700161<br>
            <a href="https://nces.by">https://nces.by</a> · info@nces.by
          </div>
          <div class="pay-row">
            ${["BELKART", "VISA", "МИР", "БЕЛАРУСБАНК", "ЕРИП"].map((t) => `<span class="pay-chip">${t}</span>`).join("")}
          </div>
        </footer>
      </div>
      <div class="hint-pop" id="hint-pop"></div>
      <div class="modal-back" id="modal"></div>
    `;
  }

  const NEWS = [
    { when: "Сегодня", kind: "service", tag: "Услуга", icon: "file", title: "Справка о доходах — без ID-карты", text: "Сведения, которыми располагает налоговый орган, можно получить в кабинете. Электронная подпись для этой справки не нужна." },
    { when: "Вчера", kind: "work", tag: "Работы", icon: "brief", title: "1 ноября кабинет будет недоступен ночью", text: "Плановые работы с 00:00 до 02:00. Заявления и черновики сохранятся. Статусы, отправленные вечером 31 октября, обновятся после работ." },
    { when: "28 октября", kind: "guide", tag: "Как пользоваться", icon: "wallet", title: "Как оплатить заявление", text: "Если статус «Ожидает оплаты», откройте «Мои услуги» и нажмите «Оплатить». После демо-оплаты статус станет «Выполнено», документ можно скачать." },
    { when: "25 октября", kind: "update", tag: "Обновление", icon: "grid", title: "Услуги собраны по категориям", text: "В каталоге сначала темы: ГАИ, семья, паспорт, налоги. Полный список — переключателем «Все услуги»." },
    { when: "20 октября", kind: "remind", tag: "Профиль", icon: "user", title: "Проверьте данные в профиле", text: "ФИО, личный номер, паспорт и контакты подставляются в заявления. В этом демо поля только для просмотра." },
  ];

  function homePage() {
    const notes = loadNotifs().filter((n) => !n.archived).slice(0, 4);
    return `
      <header class="home-hello">
        <h1>Здравствуйте, ${PERSONA.shortName}</h1>
        <p class="lead">Вы в личном кабинете Единого портала электронных услуг. Услуги заказываются из каталога, заявления — в «Моих услугах».</p>
      </header>
      <div class="home-dash">
        <section class="home-col">
          <div class="section-label">Новости портала</div>
          <div class="news-feed">
            ${NEWS.map((n, i) => `
              <article class="news-item kind-${n.kind}${i === 0 ? " is-lead" : ""}">
                <div class="news-ico" aria-hidden="true">${icon(n.icon)}</div>
                <div>
                  <div class="news-meta"><time>${n.when}</time><span class="news-tag">${n.tag}</span></div>
                  <h3>${n.title}</h3>
                  <p>${n.text}</p>
                </div>
              </article>`).join("")}
          </div>
        </section>
        <aside class="home-col">
          <div class="section-label">Сейчас в кабинете</div>
          <div class="widget widget-inbox">
            <div class="widget-head"><h2>Уведомления</h2>${notes.length ? `<span class="widget-count">${notes.length}</span>` : ""}</div>
            ${notes.map((n) => `<a class="mini-note" href="#/inbox"><span>${n.kind === "legal" ? "Юридически значимое" : "Информация"} · ${formatWhen(n.at)}</span><b>${n.title}</b></a>`).join("") || `<p class="muted">Пока тихо.</p>`}
            <div class="actions" style="margin-top:12px"><a class="btn-ghost" href="#/inbox">Все уведомления</a></div>
          </div>
          <div class="widget widget-services">
            <h2>Услуги</h2>
            <p>Паспорт, налоги, авто, семья — сначала категории, потом список.</p>
            <a class="btn-on-navy" href="#/catalog">Перейти к услугам</a>
          </div>
        </aside>
      </div>
    `;
  }

  function profilePage() {
    const p = PERSONA.passport;
    return `
      ${pageCrumb()}
      <header class="home-hello">
        <h1>Мой профиль</h1>
        <p class="lead">Сведения о физическом лице из регистра населения. Услуги заказываются отдельно.</p>
      </header>
      <div class="home-dash">
        <section class="home-col">
          <div class="section-label">Личные данные</div>
          <div class="profile-card">
            <div class="profile-hero">
              <span class="avatar-lg">${PERSONA.initials}</span>
              <div>
                <h2>${PERSONA.fullName}</h2>
                <div class="muted">Гражданин Республики Беларусь · только просмотр</div>
              </div>
            </div>
            <div class="dl">
              <div><dt>Идентификационный номер</dt><dd>${PERSONA.idNumber}</dd></div>
              <div><dt>Дата рождения</dt><dd>${PERSONA.birthDate}</dd></div>
              <div><dt>Пол</dt><dd>${PERSONA.gender}</dd></div>
              <div><dt>Гражданство</dt><dd>${PERSONA.citizenship}</dd></div>
              <div><dt>Документ, удостоверяющий личность</dt><dd>Паспорт гражданина Республики Беларусь ${p.series} ${p.number}</dd></div>
              <div><dt>Срок действия документа</dt><dd>${p.until}</dd></div>
              <div><dt>Кем выдан</dt><dd>${p.issued}</dd></div>
              <div><dt>Адрес регистрации</dt><dd>${PERSONA.address}</dd></div>
            </div>
            <p class="note">Опека, брак и иные специальные сведения в этой карточке не показываем.</p>
            <div class="actions">
              <a class="btn-primary" href="#/">На главную</a>
              <a class="btn-ghost" href="#/catalog">К услугам</a>
            </div>
          </div>
        </section>
        <aside class="home-col">
          <div class="section-label">Контакты</div>
          <div class="widget widget-inbox">
            <div class="widget-head"><h2>Как с вами связаться</h2></div>
            ${PERSONA.contacts.map((c) => `<div class="mini-note"><span>${c.type}</span><b>${c.value}</b></div>`).join("")}
          </div>
          <div class="widget widget-services">
            <h2>Нужна услуга?</h2>
            <p>Данные из профиля подставятся в заявление сами.</p>
            <a class="btn-on-navy" href="#/catalog">Перейти к услугам</a>
          </div>
        </aside>
      </div>
    `;
  }

  function svcCard(s) {
    const on = favs.has(s.id);
    return `
      <a class="svc-card" href="${serviceHref(s)}">
        <div class="svc-top">
          <div class="svc-icon">${icon("file")}</div>
          <button type="button" class="star ${on ? "is-on" : ""}" data-fav="${s.id}" aria-label="В избранное">${on ? "★" : "☆"}</button>
        </div>
        <h3 class="svc-title">${s.title}</h3>
        <p class="svc-official">${s.official}</p>
        <div class="badges">
          ${s.noId ? "" : `<span class="badge need-id">Нужна ID-карта</span>`}
          ${s.ecp ? `<span class="badge ecp" title="Нужна электронная цифровая подпись">ЭЦП — нужна подпись</span>` : ""}
          <span class="badge code">${s.code}</span>
        </div>
      </a>`;
  }

  function pagerHtml(page, pages) {
    const nums = [];
    for (let i = 1; i <= pages; i++) {
      if (pages > 9 && i > 2 && i < pages - 1 && Math.abs(i - page) > 1) {
        if (nums.at(-1) !== "…") nums.push("…");
        continue;
      }
      nums.push(i);
    }
    return [
      `<button type="button" data-page="${Math.max(1, page - 1)}" ${page === 1 ? "disabled" : ""}>‹</button>`,
      ...nums.map((n) =>
        n === "…"
          ? `<button type="button" disabled>…</button>`
          : `<button type="button" data-page="${n}" class="${n === page ? "is-on" : ""}">${n}</button>`
      ),
      `<button type="button" data-page="${Math.min(pages, page + 1)}" ${page === pages ? "disabled" : ""}>›</button>`,
    ].join("");
  }

  function crumb(parts) {
    return `<div class="crumb">${parts
      .map((p, i) => {
        const last = i === parts.length - 1;
        if (!last && p.href) return `<a href="${p.href}">${p.label}</a>`;
        return p.label;
      })
      .join(" / ")}</div>`;
  }

  function catalogToggle(view) {
    const allOn = view === "list" && !state.category;
    const catsOn = (view === "cats" && !state.category) || !!state.category;
    return `
      <div class="view-toggle">
        <a class="btn-ghost" href="${catalogHash({ view: "list", category: "", page: 1 })}" style="${allOn ? "background:var(--navy);color:#fff" : ""}">Все услуги</a>
        <a class="btn-ghost" href="#/catalog" style="${catsOn ? "background:var(--navy);color:#fff" : ""}">Услуги по категориям</a>
      </div>`;
  }

  function catalogPage() {
    const view = state.view || "cats";

    if (view === "favs") {
      const list = sortFavFirst(searchServices(state.q, "", "").filter((s) => favs.has(s.id)));
      const pages = Math.max(1, Math.ceil(list.length / PAGE_SIZE));
      const page = Math.min(state.page, pages);
      const slice = list.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
      return `
        ${pageCrumb()}
        <header class="home-hello">
          <h1>Избранные услуги</h1>
          <p class="lead">То, что вы отметили звёздочкой в каталоге. Здесь они собраны вместе; в общем списке тоже стоят первыми. Нажмите звезду на карточке, чтобы убрать услугу.</p>
        </header>
        ${
          list.length
            ? `<div class="fav-bar">
          <div class="search-hero fav-search">
            <input id="cat-q" type="search" placeholder="Найти среди избранного: доходы, паспорт, авто…" value="${state.q}" autocomplete="off">
            <span class="search-ico">${icon("search")}</span>
            <div class="suggest" id="cat-suggest"></div>
          </div>
          <a class="btn-ghost fav-all" href="#/catalog?view=list">Все услуги</a>
        </div>
        <div class="meta-row"><div>В избранном: <b>${list.length}</b></div><div class="pager">${pagerHtml(page, pages)}</div></div>
        <div class="svc-grid svc-grid-fill">${slice.map(svcCard).join("")}</div>`
            : `<div class="empty-fav">${icon("star")}<p>Пока пусто. Откройте каталог и нажмите звезду на карточке — услуга появится здесь.</p><a class="btn-primary" href="#/catalog?view=list">Открыть все услуги</a></div>`
        }
      `;
    }

    if (view !== "list" && !state.category) {
      const q = norm(state.q);
      const cats = q ? CATEGORIES.filter((c) => norm(c.title + " " + c.desc).includes(q)) : CATEGORIES;
      const foundSvc = q ? searchServices(state.q, "", "") : [];
      return `
        ${pageCrumb()}
        <header class="home-hello">
          <h1>Услуги по категориям</h1>
          <p class="lead">Выберите тему. Внутри — список услуг.</p>
        </header>
        ${catalogToggle(view)}
        <div class="search-hero">
          <input id="cat-q" type="search" placeholder="Категория или услуга: паспорт, таможня, доходы…" value="${state.q}" autocomplete="off">
          <span class="search-ico">${icon("search")}</span>
          <div class="suggest" id="cat-suggest"></div>
        </div>
        <div class="cat-grid">
          ${cats
            .map(
              (c) => `<a class="cat-card" href="${catalogHash({ category: c.id, view: "list", page: 1, q: "" })}">
                <div class="svc-icon">${icon(c.icon)}</div>
                <strong>${c.title}</strong>
                <p>${c.desc}</p>
              </a>`
            )
            .join("") || `<div class="empty">Нет категорий по запросу</div>`}
        </div>
        ${
          q && foundSvc.length
            ? `<div class="section-label">Услуги по запросу</div><div class="svc-grid">${sortFavFirst(foundSvc).slice(0, 8).map(svcCard).join("")}</div>`
            : ""
        }
      `;
    }

    const cat = CATEGORIES.find((c) => c.id === state.category);
    const list = sortFavFirst(searchServices(state.q, state.situation, state.category));
    const pages = Math.max(1, Math.ceil(list.length / PAGE_SIZE));
    const page = Math.min(state.page, pages);
    const slice = list.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
    const heading = cat ? cat.title : "Все услуги";
    return `
      ${pageCrumb()}
      <header class="home-hello">
        <h1>${heading}</h1>
        <p class="lead">${cat ? cat.desc : "Найдите услугу своими словами или выберите из списка. Отмеченные звёздочкой стоят первыми."}</p>
      </header>
      ${catalogToggle(view)}
      <div class="toolbar">
        <div class="row">
          <label>Что нужно сделать</label>
          <input id="cat-q" type="search" placeholder="доходы, паспорт, авто…" value="${state.q}" autocomplete="off">
          <div class="suggest" id="cat-suggest"></div>
        </div>
        <div>
          <label>Код</label>
          <input id="code-q" placeholder="3.05.03" value="${/^[0-9.\/\-Kк]+$/i.test(state.q) ? state.q : ""}">
        </div>
        <button class="btn-ghost" type="button" id="reset-filters">Сбросить</button>
      </div>
      ${
        cat
          ? ""
          : `<div class="chips">
        <button type="button" class="chip ${!state.situation ? "is-on" : ""}" data-sit="">Все ситуации</button>
        ${DATA.situations.map((s) => `<button type="button" class="chip ${state.situation === s.id ? "is-on" : ""}" data-sit="${s.id}">${s.title}</button>`).join("")}
      </div>`
      }
      <div class="meta-row">
        <div>${list.length ? `Найдено: <b>${list.length}</b>` : "В этой категории пока нет услуг — плитку оставили, чтобы было видно структуру."}</div>
        <div class="pager">${pagerHtml(page, pages)}</div>
      </div>
      <div class="svc-grid">${slice.map(svcCard).join("") || `<div class="empty">Нет услуг</div>`}</div>
    `;
  }

  function field(name, label, { type = "text", required = false, value = "", placeholder = "" } = {}) {
    return `
      <div class="field" data-field="${name}">
        <label>${label}${required ? ` <span class="req">*</span>` : ""}</label>
        ${
          type === "textarea"
            ? `<textarea name="${name}" placeholder="${placeholder}">${value}</textarea>`
            : `<input name="${name}" type="${type}" value="${value}" placeholder="${placeholder}">`
        }
        <div class="err"></div>
      </div>`;
  }

  function servicePage(svc) {
    const draft = JSON.parse(localStorage.getItem(DRAFT_PREFIX + svc.id) || "null") || {
      lastName: PERSONA.lastName,
      firstName: PERSONA.firstName,
      middleName: PERSONA.middleName,
      phone: PERSONA.phone,
      email: PERSONA.email,
      idNumber: PERSONA.idNumber,
    };
    return `
      ${pageCrumb()}
      <div class="detail-head">
        <div class="badges" style="margin-bottom:8px">
          ${svc.noId ? "" : `<span class="badge need-id">Нужна ID-карта</span>`}
          ${svc.ecp ? `<span class="badge ecp">ЭЦП — нужна электронная подпись</span>` : ""}
          <span class="badge code">${svc.code}</span>
        </div>
        <h1>${svc.title}</h1>
        <p class="official-line">Официально: ${svc.official}</p>
      </div>
      <div class="result-box">
        <div class="result-item"><div class="svc-icon tint-navy">${icon("file")}</div><div><small>Срок</small><b>${svc.result.term}</b></div></div>
        <div class="result-item"><div class="svc-icon tint-amber">${icon("wallet")}</div><div><small>Стоимость</small><b>${svc.result.cost}</b></div></div>
        <div class="result-item"><div class="svc-icon tint-teal">${icon("check")}</div><div><small>Формат</small><b>${svc.result.format}</b></div></div>
      </div>
      <p class="org-line">Кто оказывает: <b>${svc.org.name}</b> · УНП ${svc.org.unp}</p>
      <div class="layout-2">
        <div>
          <h2 style="margin-top:0;color:var(--navy-deep);font-size:18px">Как это работает</h2>
          <ol class="steps">
            ${svc.steps.map((t, i) => `<li><span class="n">${i + 1}</span><span>${t.replace("Раздел — в следующем этапе", "смотрите «Мои услуги»")}</span></li>`).join("")}
          </ol>
        </div>
        <form class="form-card" id="svc-form" novalidate>
          <h2>Заявление</h2>
          <div class="draft-bar" id="draft-bar">${draft.savedAt ? `Черновик сохранён ${draft.savedAt}` : "Черновик сохранится сам."}</div>
          <div class="field"><label>Идентификационный номер</label><input value="${PERSONA.idNumber}" disabled><div class="err"></div></div>
          ${field("lastName", "Фамилия физического лица", { required: true, value: draft.lastName || "", placeholder: "Иванов" })}
          ${field("firstName", "Имя физического лица", { required: true, value: draft.firstName || "", placeholder: "Алексей" })}
          ${field("middleName", "Отчество физического лица", { value: draft.middleName || "", placeholder: "Сергеевич" })}
          ${field("phone", "Контактный телефон", { required: true, value: draft.phone || "", placeholder: "+375 29 000-00-00" })}
          ${field("email", "Адрес электронной почты", { type: "email", value: draft.email || "" })}
          ${field("comment", "Дополнительная информация", { type: "textarea", value: draft.comment || "" })}
          <div class="field">
            <label class="check">
              <input type="checkbox" name="consent" ${draft.consent ? "checked" : ""}>
              <span>Согласен на обработку персональных данных для оказания услуги. <span class="req">*</span></span>
            </label>
            <div class="err" data-err="consent"></div>
          </div>
          <div class="actions">
            <button class="btn-primary" type="submit">Подать заявление</button>
            <button class="btn-ghost" type="button" id="clear-draft">Очистить черновик</button>
          </div>
        </form>
      </div>
    `;
  }

  function statusClass(st) {
    if (st === "Выполнено") return "status-done";
    if (st === "Ожидает оплаты") return "status-pay";
    if (st === "Черновик") return "status-draft";
    if (st === "На проверке") return "status-check";
    if (st === "Отозвано") return "status-cancel";
    if (st === "Отказано") return "status-deny";
    return "";
  }

  function formatWhen(iso) {
    const d = new Date(iso);
    const now = new Date();
    const start = (x) => new Date(x.getFullYear(), x.getMonth(), x.getDate()).getTime();
    const diff = Math.round((start(now) - start(d)) / 86400000);
    if (diff === 0) return "Сегодня";
    if (diff === 1) return "Вчера";
    return d.toLocaleDateString("ru-BY", { day: "numeric", month: "long", year: "numeric" });
  }

  function statusHelp(st) {
    if (st === "Отозвано")
      return "Вы отменили это заявление. Оно больше не рассматривается, документ по нему не выдадут. Можно подать новое заявление по той же услуге.";
    if (st === "Отказано") return "Ведомство не оказало услугу. Причину смотрите в комментарии или подайте заявление заново.";
    if (st === "Ожидает оплаты") return "Заявление принято, но без оплаты документ не выдадут.";
    if (st === "Черновик") return "Вы ещё не отправили заявление. Можно открыть услугу и продолжить.";
    return "";
  }

  function appsPage() {
    const rows = loadApps();
    return `
      ${pageCrumb()}
      <header class="home-hello">
        <h1>Мои услуги</h1>
        <p class="lead">Заявления, которые вы уже начали или отправили. Инициатор — орган, который оказывает услугу; в будущем здесь может быть и другая организация.</p>
      </header>
      <table class="data-table">
        <thead><tr><th>Услуга</th><th>Дата</th><th>Инициатор</th><th>Статус</th><th>Действия</th></tr></thead>
        <tbody>
          ${rows
            .map((r) => {
              const help = statusHelp(r.status);
              return `<tr>
                <td><b>${r.title}</b><div class="help">№ ${r.num}</div></td>
                <td>${formatWhen(r.at)}</td>
                <td>${r.initiator}</td>
                <td><span class="status ${statusClass(r.status)}">${r.status}</span>${help ? `<div class="help">${help}</div>` : r.comment ? `<div class="help">${r.comment}</div>` : ""}</td>
                <td>
                  <div class="act-col">
                    ${
                      r.status === "Выполнено"
                        ? `<button class="act-btn main" type="button" data-pdf="${r.id}">Скачать</button>`
                        : r.status === "Ожидает оплаты"
                          ? `<button class="act-btn main" type="button" data-pay="${r.id}">Оплатить</button>`
                          : r.serviceId
                            ? `<a class="act-btn main" href="${serviceHref({ id: r.serviceId })}">Открыть</a>`
                            : `<button class="act-btn main" type="button" disabled>Открыть</button>`
                    }
                    ${r.serviceId && (r.status === "Выполнено" || r.status === "Ожидает оплаты") ? `<a class="act-btn sec" href="${serviceHref({ id: r.serviceId })}">Открыть</a>` : ""}
                    <button class="act-btn sec" type="button" data-edit="${r.id}">Изменить</button>
                  </div>
                </td>
              </tr>`;
            })
            .join("")}
        </tbody>
      </table>
    `;
  }

  function inboxPage() {
    const box = state.route.box || "in";
    const all = loadNotifs();
    const rows = all.filter((n) => (box === "arch" ? n.archived : !n.archived));
    return `
      ${pageCrumb()}
      <header class="home-hello">
        <h1>Мои уведомления</h1>
        <p class="lead">Юридически значимые нельзя удалить — только в архив. Информационные можно удалить.</p>
      </header>
      <div class="tabs">
        <a class="tab ${box === "in" ? "is-on" : ""}" href="#/inbox">Входящие</a>
        <a class="tab ${box === "arch" ? "is-on" : ""}" href="#/inbox?box=arch">Архив</a>
      </div>
      ${
        rows.length
          ? `<div class="mail-feed">${rows
              .map(
                (n) => `<article class="mail-item ${n.kind}">
              <div class="news-ico" aria-hidden="true">${icon(n.kind === "legal" ? "file" : "bell")}</div>
              <div>
                <div class="mail-meta"><span class="kind">${n.kind === "legal" ? "Юридически значимое" : "Информационное"}</span><span class="muted">${formatWhen(n.at)}</span></div>
                <h3 style="margin:0 0 4px;color:var(--navy-deep)">${n.title}</h3>
                <p class="muted" style="margin:0 0 10px">${n.body}</p>
                <div class="actions">
                  ${
                    box === "in"
                      ? `<button class="btn-ghost btn-tiny" data-arch="${n.id}">В архив</button>`
                      : `<button class="btn-ghost btn-tiny" data-unarch="${n.id}">Вернуть во входящие</button>`
                  }
                  ${n.kind === "info" && box === "in" ? `<button class="btn-ghost btn-tiny" data-del="${n.id}">Удалить</button>` : ""}
                  ${n.kind === "legal" ? `<span class="help">Это уведомление связано с заявлением, удалить его нельзя.</span>` : ""}
                </div>
              </div>
            </article>`
              )
              .join("")}</div>`
          : `<div class="empty">${box === "arch" ? "Архив пуст" : "Нет входящих"}</div>`
      }
    `;
  }

  const NAME_RE = /^[А-ЯЁа-яёA-Za-z-]{2,}(?:\s[А-ЯЁа-яёA-Za-z-]{2,})?$/;
  const PHONE_RE = /^\+375\s?\(?(?:17|25|29|33|44)\)?[\s-]?\d{3}[\s-]?\d{2}[\s-]?\d{2}$/;
  const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  function validate(form) {
    const data = Object.fromEntries(new FormData(form));
    data.consent = form.consent.checked;
    const errors = {};
    if (!NAME_RE.test((data.lastName || "").trim())) errors.lastName = "Укажите фамилию, минимум 2 буквы";
    if (!NAME_RE.test((data.firstName || "").trim())) errors.firstName = "Укажите имя, минимум 2 буквы";
    if (data.middleName && !NAME_RE.test(data.middleName.trim())) errors.middleName = "Только буквы, минимум 2";
    if (!PHONE_RE.test((data.phone || "").trim())) errors.phone = "Формат: +375 29 000-00-00";
    if (data.email && !EMAIL_RE.test(data.email.trim())) errors.email = "Похоже на неверный адрес";
    if ((data.comment || "").length > 500) errors.comment = "Не больше 500 символов";
    if (!data.consent) errors.consent = "Нужно согласие, чтобы отправить заявление";
    return { data, errors, ok: Object.keys(errors).length === 0 };
  }

  function paintErrors(form, errors) {
    $$("[data-field]", form).forEach((wrap) => {
      const name = wrap.dataset.field;
      const input = $("input, textarea", wrap);
      const err = $(".err", wrap);
      if (!input || !err) return;
      if (errors[name]) {
        input.classList.add("is-bad");
        err.textContent = errors[name];
      } else {
        input.classList.remove("is-bad");
        err.textContent = "";
      }
    });
    const cErr = $("[data-err=consent]", form);
    if (cErr) cErr.textContent = errors.consent || "";
  }

  function downloadDemoPdf(row) {
    const body = `E-Pasluga demo document\nApplication ${row.num}\n${row.title}\n${PERSONA.fullName}\nStatus: ${row.status}\n`;
    const pdf = `%PDF-1.1
1 0 obj<< /Type /Catalog /Pages 2 0 R >>endobj
2 0 obj<< /Type /Pages /Kids [3 0 R] /Count 1 >>endobj
3 0 obj<< /Type /Page /Parent 2 0 R /MediaBox [0 0 595 842] /Contents 4 0 R /Resources<< /Font<< /F1 5 0 R >> >> >>endobj
4 0 obj<< /Length 120 >>stream
BT /F1 12 Tf 50 780 Td (${body.replace(/[()\\]/g, " ").replace(/\n/g, ") Tj T* (")}) Tj ET
endstream
endobj
5 0 obj<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>endobj
xref
0 6
0000000000 65535 f 
0000000009 00000 n 
0000000058 00000 n 
0000000115 00000 n 
0000000266 00000 n 
0000000437 00000 n 
trailer<< /Size 6 /Root 1 0 R >>
startxref
510
%%EOF`;
    const blob = new Blob([pdf], { type: "application/pdf" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `dokument-${row.num}.pdf`;
    a.click();
    URL.revokeObjectURL(a.href);
  }

  function bindForm(svc) {
    const form = $("#svc-form");
    if (!form) return;
    const bar = $("#draft-bar");
    let t;
    const persist = () => {
      const { data } = validate(form);
      const savedAt = new Date().toLocaleString("ru-BY", { day: "2-digit", month: "2-digit", hour: "2-digit", minute: "2-digit" });
      localStorage.setItem(DRAFT_PREFIX + svc.id, JSON.stringify({ ...data, savedAt }));
      bar.textContent = `Черновик сохранён ${savedAt}`;
    };
    form.addEventListener("input", () => {
      paintErrors(form, validate(form).errors);
      clearTimeout(t);
      t = setTimeout(persist, 400);
    });
    form.addEventListener("change", persist);
    $("#clear-draft")?.addEventListener("click", () => {
      localStorage.removeItem(DRAFT_PREFIX + svc.id);
      form.reset();
      paintErrors(form, {});
      bar.textContent = "Черновик очищен.";
    });
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const { data, errors, ok } = validate(form);
      paintErrors(form, errors);
      if (!ok) return;
      const num = String(Date.now()).slice(-12);
      const rows = loadApps();
      rows.unshift({
        id: "a" + Date.now(),
        num,
        title: svc.title,
        serviceId: svc.id,
        initiator: svc.org.name,
        status: "На проверке",
        at: todayIso(),
        comment: data.comment || "",
      });
      saveApps(rows);
      const notes = loadNotifs();
      notes.unshift({
        id: "n" + Date.now(),
        kind: "legal",
        title: `${svc.title} — На проверке`,
        body: `Заявление ${num} принято. Статус смотрите в «Мои услуги».`,
        at: todayIso(),
        archived: false,
      });
      saveNotifs(notes);
      localStorage.removeItem(DRAFT_PREFIX + svc.id);
      const modal = $("#modal");
      modal.classList.add("is-on");
      modal.innerHTML = `
        <div class="modal">
          <h3>Заявление отправлено</h3>
          <p>Номер <b>${num}</b>. Услуга «${svc.title}».</p>
          <p class="muted">Оно появилось в «Мои услуги» со статусом «На проверке».</p>
          <div class="actions">
            <a class="btn-primary" href="#/apps">Мои услуги</a>
            <button class="btn-ghost" type="button" id="close-modal">Закрыть</button>
          </div>
        </div>`;
      $("#close-modal")?.addEventListener("click", () => modal.classList.remove("is-on"));
      modal.addEventListener("click", (ev) => {
        if (ev.target === modal) modal.classList.remove("is-on");
      });
      form.reset();
      paintErrors(form, {});
      bar.textContent = "Можно подать ещё одно заявление.";
    });
  }

  function openEditApp(id) {
    const rows = loadApps();
    const row = rows.find((r) => r.id === id);
    if (!row) return;
    const modal = $("#modal");
    modal.classList.add("is-on");
    modal.innerHTML = `
      <div class="modal">
        <h3>Изменить заявление</h3>
        <div class="field"><label>Название</label><input id="ed-title" value="${row.title}"></div>
        <div class="field"><label>Инициатор</label><input id="ed-init" value="${row.initiator}"></div>
        <div class="field"><label>Статус</label>
          <select id="ed-st">${STATUSES.map((s) => `<option ${s === row.status ? "selected" : ""}>${s}</option>`).join("")}</select>
        </div>
        <div class="field"><label>Комментарий</label><textarea id="ed-c">${row.comment || ""}</textarea></div>
        <div class="actions">
          <button class="btn-primary" type="button" id="ed-save">Сохранить</button>
          <button class="btn-ghost" type="button" id="close-modal">Отмена</button>
        </div>
      </div>`;
    $("#close-modal").addEventListener("click", () => modal.classList.remove("is-on"));
    $("#ed-save").addEventListener("click", () => {
      row.title = $("#ed-title").value.trim() || row.title;
      row.initiator = $("#ed-init").value.trim() || row.initiator;
      row.status = $("#ed-st").value;
      row.comment = $("#ed-c").value;
      saveApps(rows);
      modal.classList.remove("is-on");
      render();
    });
  }

  function bindCommon() {
    $$("[data-disabled]").forEach((el) => {
      el.addEventListener("click", (e) => {
        e.preventDefault();
        const pop = $("#hint-pop");
        pop.textContent = "Раздел появится в следующей версии";
        pop.style.left = `${e.clientX + 8}px`;
        pop.style.top = `${e.clientY + 8}px`;
        pop.classList.add("is-on");
        setTimeout(() => pop.classList.remove("is-on"), 1600);
      });
    });
    $$("[data-nav-toggle]").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        e.preventDefault();
        e.stopPropagation();
        const id = btn.dataset.navToggle;
        if (navOpen.has(id)) navOpen.delete(id);
        else navOpen.add(id);
        saveNavOpen();
        btn.classList.toggle("is-expanded", navOpen.has(id));
        $(`#nav-${id}`)?.classList.toggle("is-open", navOpen.has(id));
        btn.blur();
      });
    });
    $(".sidebar")?.addEventListener("mouseleave", () => {
      const active = document.activeElement;
      if (active && $(".sidebar")?.contains(active)) active.blur();
    });
  }

  function bindHome() {
    const input = $("#home-q");
    const box = $("#home-suggest");
    if (!input) return;
    input.addEventListener("input", () => renderSuggest(box, input.value));
    input.addEventListener("focus", () => renderSuggest(box, input.value));
    input.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        e.preventDefault();
        go(catalogHash({ q: input.value, page: 1, view: "list", category: "" }));
      }
    });
  }

  function bindCatalog() {
    $("#cat-q")?.addEventListener("input", (e) => {
      renderSuggest($("#cat-suggest"), e.target.value);
      if (state.view !== "list" && !state.category) {
        /* live filter on categories: update hash on enter only */
      }
    });
    $("#cat-q")?.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        e.preventDefault();
        const v = e.target.value;
        if (state.view === "favs") go(catalogHash({ q: v, view: "favs", page: 1 }));
        else if (state.view !== "list" && !state.category) go(catalogHash({ q: v, view: "cats", page: 1 }));
        else go(catalogHash({ q: v, view: "list", page: 1 }));
      }
    });
    $("#code-q")?.addEventListener("keydown", (e) => {
      if (e.key === "Enter") go(catalogHash({ q: e.target.value, view: "list", page: 1 }));
    });
    $("#reset-filters")?.addEventListener("click", () => go("#/catalog?view=list"));
    $$(".chip").forEach((c) => c.addEventListener("click", () => go(catalogHash({ situation: c.dataset.sit, page: 1, view: "list" }))));
    $$(".pager [data-page]").forEach((b) => {
      if (b.disabled) return;
      b.addEventListener("click", () => go(catalogHash({ page: Number(b.dataset.page), view: "list" })));
    });
    $$("[data-fav]").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        e.preventDefault();
        e.stopPropagation();
        const id = btn.dataset.fav;
        if (favs.has(id)) favs.delete(id);
        else favs.add(id);
        saveFavs();
        render();
      });
    });
  }

  function bindApps() {
    $$("[data-pay]").forEach((b) =>
      b.addEventListener("click", () => {
        const rows = loadApps();
        const row = rows.find((r) => r.id === b.dataset.pay);
        if (!row) return;
        row.status = "Выполнено";
        saveApps(rows);
        const notes = loadNotifs();
        notes.unshift({
          id: "n" + Date.now(),
          kind: "legal",
          title: `${row.title} — Готово`,
          body: "Оплата прошла (демо ЕРИП). Документ можно скачать.",
          at: todayIso(),
          archived: false,
        });
        saveNotifs(notes);
        render();
      })
    );
    $$("[data-pdf]").forEach((b) =>
      b.addEventListener("click", () => {
        const row = loadApps().find((r) => r.id === b.dataset.pdf);
        if (row) downloadDemoPdf(row);
      })
    );
    $$("[data-edit]").forEach((b) => b.addEventListener("click", () => openEditApp(b.dataset.edit)));
  }

  function bindInbox() {
    $$("[data-arch]").forEach((b) =>
      b.addEventListener("click", () => {
        const rows = loadNotifs();
        const n = rows.find((x) => x.id === b.dataset.arch);
        if (n) n.archived = true;
        saveNotifs(rows);
        render();
      })
    );
    $$("[data-unarch]").forEach((b) =>
      b.addEventListener("click", () => {
        const rows = loadNotifs();
        const n = rows.find((x) => x.id === b.dataset.unarch);
        if (n) n.archived = false;
        saveNotifs(rows);
        render();
      })
    );
    $$("[data-del]").forEach((b) =>
      b.addEventListener("click", () => {
        saveNotifs(loadNotifs().filter((x) => x.id !== b.dataset.del));
        render();
      })
    );
  }

  function render() {
    const route = parseHash();
    state.route = route;
    syncTrail(crumbNode(route));
    if (route.name === "catalog") {
      state.q = route.q;
      state.situation = route.situation;
      state.category = route.category;
      state.view = route.view;
      state.page = route.page;
    }
    const root = $("#app");
    if (route.name === "home") root.innerHTML = layout(homePage());
    else if (route.name === "profile") root.innerHTML = layout(profilePage());
    else if (route.name === "catalog") root.innerHTML = layout(catalogPage());
    else if (route.name === "apps") root.innerHTML = layout(appsPage());
    else if (route.name === "inbox") root.innerHTML = layout(inboxPage());
    else if (route.name === "service") {
      const svc = serviceById(route.id);
      root.innerHTML = layout(svc ? servicePage(svc) : `<p>Услуга не найдена. <a href="#/catalog">В каталог</a></p>`);
      if (svc) bindForm(svc);
    }
    bindCommon();
    if (route.name === "home" && $("#home-q")) bindHome();
    if (route.name === "catalog") bindCatalog();
    if (route.name === "apps") bindApps();
    if (route.name === "inbox") bindInbox();
    window.scrollTo(0, 0);
  }

  seedApps();
  seedNotifs();
  window.addEventListener("hashchange", render);
  if (!location.hash) location.hash = "#/";
  render();
})();
