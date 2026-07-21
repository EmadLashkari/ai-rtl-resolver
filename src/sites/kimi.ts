import { observeBodyMutations } from '../lib/dom';

const KIMI_SELECTOR = 'div.paragraph';

function applyFont(): void {
  document.querySelectorAll(KIMI_SELECTOR).forEach(el => {
    el.classList.add('vazir');
  });
}

export function initKimi(): void {
  applyFont();
  observeBodyMutations(applyFont);
}
