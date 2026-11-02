// Point d’entrée des pages intérieures : services, comment-ca-marche, partenaires, annuaire.
import { initHeader } from "./pages/header";
import { initTabs } from "./pages/tabs";
import { initChecklist } from "./pages/checklist";
import { initPartners } from "./pages/partners";
import { initDirectory } from "./pages/directory";

function ready(fn: () => void): void {
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", fn);
  else fn();
}

ready(() => {
  initHeader();
  document.querySelectorAll<HTMLElement>("[data-year]").forEach((el) => {
    el.textContent = String(new Date().getFullYear());
  });

  const tabs = document.querySelector<HTMLElement>("[data-tabs]");
  if (tabs) initTabs(tabs);

  const checklist = document.querySelector<HTMLElement>("[data-checklist]");
  if (checklist) initChecklist(checklist);

  if (document.querySelector("[data-partner]")) initPartners();

  const grid = document.querySelector<HTMLElement>("[data-dir-grid]");
  if (grid) initDirectory();
});
