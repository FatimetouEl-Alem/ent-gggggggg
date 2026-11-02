// Liste « Avant de commencer » : compteur et barre de progression.
export function initChecklist(root: HTMLElement): void {
  const boxes = Array.from(root.querySelectorAll<HTMLInputElement>("[data-check]"));
  const count = root.querySelector<HTMLElement>("[data-check-count]");
  const bar = root.querySelector<HTMLElement>("[data-check-bar]");
  const done = root.querySelector<HTMLElement>("[data-check-done]");
  const fill = bar?.querySelector<HTMLElement>("span");

  const update = (): void => {
    const n = boxes.filter((b) => b.checked).length;
    const total = boxes.length;
    if (count) count.textContent = `${n} sur ${total} prêts`;
    if (fill) fill.style.width = `${(n / total) * 100}%`;
    bar?.classList.toggle("is-full", n === total);
    if (done) done.hidden = n !== total;
  };
  boxes.forEach((b) => b.addEventListener("change", update));
  update();
}
