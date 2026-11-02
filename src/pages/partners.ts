// Page Partenaires : met en évidence la carte du partenaire visible à l’écran.
export function initPartners(): void {
  const links = Array.from(document.querySelectorAll<HTMLAnchorElement>("[data-partner-link]"));
  const sections = Array.from(document.querySelectorAll<HTMLElement>("[data-partner]"));
  if (!links.length || !("IntersectionObserver" in window)) return;

  const mark = (id: string): void => {
    links.forEach((a) => {
      if (a.getAttribute("href") === "#" + id) a.setAttribute("aria-current", "true");
      else a.removeAttribute("aria-current");
    });
  };
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((en) => {
        if (en.isIntersecting) mark(en.target.id);
      });
    },
    { rootMargin: "-45% 0px -45% 0px" },
  );
  sections.forEach((s) => io.observe(s));
}
