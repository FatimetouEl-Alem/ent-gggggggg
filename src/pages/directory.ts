// Annuaire : recherche, filtres, tri, pagination, fiche entreprise.
// Les filtres sont reflétés dans l’adresse (?q=…&ville=…&secteur=…) pour pouvoir partager un lien.
import { Business, Sector, SAMPLE_BUSINESSES, SECTOR_LABELS } from "./directory-data";

const PAGE_SIZE = 9;
const MONTHS = ["janvier", "février", "mars", "avril", "mai", "juin", "juillet", "août", "septembre", "octobre", "novembre", "décembre"];

interface State { q: string; city: string; sector: Sector | ""; sort: "name" | "recent"; shown: number; }

/** Point de branchement de l’API : renvoyer ici la liste issue du serveur. */
async function loadBusinesses(): Promise<Business[]> {
  return SAMPLE_BUSINESSES;
}

const norm = (s: string): string => s.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().trim();
const initials = (name: string): string =>
  name.replace(/[^\p{L}\s]/gu, " ").split(/\s+/).filter(Boolean).slice(0, 2).map((w) => w[0].toUpperCase()).join("");
const avatarClass = (id: string): string => "pg-av-" + (id.split("").reduce((a, c) => a + c.charCodeAt(0), 0) % 4);
const since = (ym: string): string => {
  const [y, m] = ym.split("-").map(Number);
  return `${MONTHS[m - 1]} ${y}`;
};
const isSector = (s: string): s is Sector => s in SECTOR_LABELS;

function el<K extends keyof HTMLElementTagNameMap>(tag: K, cls?: string, text?: string): HTMLElementTagNameMap[K] {
  const e = document.createElement(tag);
  if (cls) e.className = cls;
  if (text !== undefined) e.textContent = text;
  return e;
}

const PIN = '<svg aria-hidden="true" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#2E68BE" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s7-6.2 7-12a7 7 0 0 0-14 0c0 5.8 7 12 7 12z"/><circle cx="12" cy="10" r="2.5"/></svg>';
const CROSS = '<svg aria-hidden="true" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.8" stroke-linecap="round"><path d="M7 7l10 10M17 7 7 17"/></svg>';

export async function initDirectory(): Promise<void> {
  const $ = <T extends HTMLElement>(sel: string): T | null => document.querySelector<T>(sel);
  const form = $<HTMLFormElement>("[data-dir-form]");
  const qInput = $<HTMLInputElement>("[data-dir-q]");
  const citySel = $<HTMLSelectElement>("[data-dir-city]");
  const sortSel = $<HTMLSelectElement>("[data-dir-sort]");
  const grid = $<HTMLElement>("[data-dir-grid]")!;
  const count = $<HTMLElement>("[data-dir-count]");
  const active = $<HTMLElement>("[data-dir-active]");
  const empty = $<HTMLElement>("[data-dir-empty]");
  const moreWrap = $<HTMLElement>("[data-dir-more-wrap]");
  const moreBtn = $<HTMLButtonElement>("[data-dir-more]");
  const dialog = $<HTMLDialogElement>("[data-dir-dialog]");
  const sectorBtns = Array.from(document.querySelectorAll<HTMLButtonElement>("[data-dir-sectors] [data-sector]"));

  const params = new URLSearchParams(location.search);
  const sp = params.get("secteur") || "";
  const state: State = {
    q: params.get("q") || "",
    city: params.get("ville") || "",
    sector: isSector(sp) ? sp : "",
    sort: "name",
    shown: PAGE_SIZE,
  };

  grid.setAttribute("aria-busy", "true");
  const all = await loadBusinesses();
  grid.removeAttribute("aria-busy");

  const matchesText = (b: Business): boolean => {
    if (!state.q) return true;
    const hay = norm(`${b.name} ${b.activity} ${b.description} ${SECTOR_LABELS[b.sector]}`);
    return norm(state.q).split(/\s+/).every((w) => hay.includes(w));
  };
  const matchesCity = (b: Business): boolean => !state.city || b.city === state.city;

  const syncUrl = (): void => {
    const p = new URLSearchParams();
    if (state.q) p.set("q", state.q);
    if (state.city) p.set("ville", state.city);
    if (state.sector) p.set("secteur", state.sector);
    const qs = p.toString();
    history.replaceState(null, "", location.pathname + (qs ? "?" + qs : ""));
  };

  const card = (b: Business): HTMLButtonElement => {
    const btn = el("button", "pg-biz");
    btn.type = "button";
    btn.setAttribute("aria-haspopup", "dialog");
    const top = el("span", "pg-biz__top");
    const av = el("span", `pg-avatar ${avatarClass(b.id)}`, initials(b.name));
    av.setAttribute("aria-hidden", "true");
    const titles = el("span");
    titles.append(el("span", "pg-biz__name", b.name), el("span", "pg-biz__sector", `${SECTOR_LABELS[b.sector]} · ${b.activity}`));
    top.append(av, titles);
    const foot = el("span", "pg-biz__foot");
    const city = el("span", "pg-biz__city");
    city.innerHTML = PIN;
    city.append(b.city);
    foot.append(city, el("span", "pg-pill pg-pill--ok", "Inscrite"));
    btn.append(top, el("span", "pg-biz__desc", b.description), foot);
    btn.addEventListener("click", () => openBiz(b));
    return btn;
  };

  const render = (): void => {
    const textCity = all.filter((b) => matchesText(b) && matchesCity(b));
    const list = textCity.filter((b) => !state.sector || b.sector === state.sector);
    list.sort((a, b) => (state.sort === "recent" ? b.since.localeCompare(a.since) : a.name.localeCompare(b.name, "fr")));

    // Compteurs par secteur (selon la recherche et la ville en cours)
    document.querySelectorAll<HTMLElement>("[data-count]").forEach((c) => {
      const s = c.dataset.count || "";
      c.textContent = String(s ? textCity.filter((b) => b.sector === s).length : textCity.length);
    });
    sectorBtns.forEach((b) => b.setAttribute("aria-pressed", String((b.dataset.sector || "") === state.sector)));

    grid.replaceChildren(...list.slice(0, state.shown).map(card));
    if (count) count.innerHTML = `<strong>${list.length}</strong> ${list.length > 1 ? "entreprises" : "entreprise"}`;
    if (empty) empty.hidden = list.length > 0;
    grid.hidden = list.length === 0;
    if (moreWrap) moreWrap.hidden = list.length <= state.shown;

    // Filtres actifs, supprimables d’un clic
    if (active) {
      const chips: HTMLButtonElement[] = [];
      const chip = (label: string, clear: () => void): void => {
        const c = el("button", "pg-chip");
        c.type = "button";
        c.setAttribute("aria-label", `Retirer le filtre ${label}`);
        c.append(label);
        c.insertAdjacentHTML("beforeend", CROSS);
        c.addEventListener("click", () => { clear(); update(); });
        chips.push(c);
      };
      if (state.q) chip(`« ${state.q} »`, () => { state.q = ""; if (qInput) qInput.value = ""; });
      if (state.city) chip(state.city, () => { state.city = ""; if (citySel) citySel.value = ""; });
      if (state.sector) chip(SECTOR_LABELS[state.sector], () => { state.sector = ""; });
      active.replaceChildren(...chips);
    }
  };

  const update = (): void => {
    state.shown = PAGE_SIZE;
    syncUrl();
    render();
  };

  // Fiche entreprise
  let lastTrigger: HTMLElement | null = null;
  const openBiz = (b: Business): void => {
    if (!dialog) return;
    lastTrigger = document.activeElement as HTMLElement;
    const set = (sel: string, txt: string): void => {
      const n = dialog.querySelector<HTMLElement>(sel);
      if (n) n.textContent = txt;
    };
    set("[data-biz-initials]", initials(b.name));
    set("[data-biz-name]", b.name);
    set("[data-biz-sub]", `${b.activity} · ${b.city}`);
    set("[data-biz-desc]", b.description);
    set("[data-biz-sector]", SECTOR_LABELS[b.sector]);
    set("[data-biz-city]", b.city);
    set("[data-biz-since]", since(b.since));
    const call = dialog.querySelector<HTMLAnchorElement>("[data-biz-call]");
    if (call) {
      call.hidden = !b.phone;
      if (b.phone) call.href = "tel:" + b.phone.replace(/\s/g, "");
    }
    if (typeof dialog.showModal === "function") dialog.showModal();
    else dialog.setAttribute("open", "");
  };
  dialog?.querySelector("[data-dir-close]")?.addEventListener("click", () => dialog.close());
  dialog?.addEventListener("click", (e) => { if (e.target === dialog) dialog.close(); });
  dialog?.addEventListener("close", () => lastTrigger?.focus());

  // Événements
  if (qInput) qInput.value = state.q;
  if (citySel) citySel.value = state.city;
  form?.addEventListener("submit", (e) => {
    e.preventDefault();
    state.q = qInput?.value.trim() || "";
    state.city = citySel?.value || "";
    update();
    grid.closest("section")?.scrollIntoView({ behavior: "smooth", block: "start" });
  });
  let t = 0;
  qInput?.addEventListener("input", () => {
    window.clearTimeout(t);
    t = window.setTimeout(() => { state.q = qInput.value.trim(); update(); }, 220);
  });
  citySel?.addEventListener("change", () => { state.city = citySel.value; update(); });
  sortSel?.addEventListener("change", () => { state.sort = sortSel.value === "recent" ? "recent" : "name"; render(); });
  sectorBtns.forEach((b) => b.addEventListener("click", () => {
    const s = b.dataset.sector || "";
    state.sector = isSector(s) ? s : "";
    update();
  }));
  moreBtn?.addEventListener("click", () => {
    const first = state.shown;
    state.shown += PAGE_SIZE;
    render();
    grid.querySelectorAll<HTMLElement>(".pg-biz")[first]?.focus();
  });
  document.querySelector("[data-dir-reset]")?.addEventListener("click", () => {
    state.q = ""; state.city = ""; state.sector = "";
    if (qInput) qInput.value = "";
    if (citySel) citySel.value = "";
    update();
    qInput?.focus();
  });

  render();
}
