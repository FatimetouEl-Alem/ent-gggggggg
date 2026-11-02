// Onglets accessibles de la page Services (flèches, Début/Fin, ancre #taxes…).
export function initTabs(root: HTMLElement): void {
  const tabs = Array.from(root.querySelectorAll<HTMLButtonElement>("[role=tab]"));
  if (!tabs.length) return;
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const select = (tab: HTMLButtonElement, opts: { focus?: boolean; updateHash?: boolean } = {}): void => {
    tabs.forEach((t) => {
      const on = t === tab;
      t.setAttribute("aria-selected", String(on));
      t.tabIndex = on ? 0 : -1;
      const panel = document.getElementById(t.getAttribute("aria-controls") || "");
      if (!panel) return;
      panel.hidden = !on;
      if (on && !reduce) {
        panel.classList.remove("is-entering");
        void panel.offsetWidth;
        panel.classList.add("is-entering");
      }
    });
    if (opts.focus) tab.focus();
    tab.scrollIntoView({ block: "nearest", inline: "nearest", behavior: reduce ? "auto" : "smooth" });
    if (opts.updateHash) history.replaceState(null, "", "#" + tab.dataset.tab);
  };

  tabs.forEach((tab, i) => {
    tab.addEventListener("click", () => select(tab, { updateHash: true }));
    tab.addEventListener("keydown", (e) => {
      let next = -1;
      if (e.key === "ArrowDown" || e.key === "ArrowRight") next = (i + 1) % tabs.length;
      else if (e.key === "ArrowUp" || e.key === "ArrowLeft") next = (i - 1 + tabs.length) % tabs.length;
      else if (e.key === "Home") next = 0;
      else if (e.key === "End") next = tabs.length - 1;
      if (next < 0) return;
      e.preventDefault();
      select(tabs[next], { focus: true, updateHash: true });
    });
  });

  const fromHash = (): void => {
    const id = decodeURIComponent(location.hash.slice(1));
    const tab = tabs.find((t) => t.dataset.tab === id);
    if (!tab) return;
    select(tab);
    root.scrollIntoView({ block: "start", behavior: reduce ? "auto" : "smooth" });
  };
  window.addEventListener("hashchange", fromHash);
  if (location.hash) fromHash();
}
