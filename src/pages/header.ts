// Menu « trois lignes » des pages intérieures (tablette et mobile).
export function initHeader(): void {
  const header = document.querySelector<HTMLElement>("[data-header]");
  const burger = document.querySelector<HTMLButtonElement>("[data-burger]");
  const menu = document.querySelector<HTMLElement>("[data-mobile-menu]");
  if (!header || !burger || !menu) return;

  const setOpen = (open: boolean): void => {
    menu.hidden = !open;
    burger.setAttribute("aria-expanded", String(open));
    burger.setAttribute("aria-label", open ? "Fermer le menu" : "Ouvrir le menu");
    header.classList.toggle("is-menu-open", open);
    document.body.classList.toggle("is-menu-open", open);
  };

  burger.addEventListener("click", () => setOpen(menu.hidden));
  menu.addEventListener("click", (e) => {
    if ((e.target as HTMLElement).closest("a")) setOpen(false);
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && !menu.hidden) {
      setOpen(false);
      burger.focus();
    }
  });
  window.matchMedia("(min-width: 961px)").addEventListener("change", (mq) => {
    if (mq.matches) setOpen(false);
  });
}
