import {
  applyDetectedDirection,
  forceLtrDirection,
  getElementText,
  observeBodyMutations,
} from '../lib/dom';

const LTR_ONLY_SELECTOR =
  'pre, code, .code-block, [id^="heading-"][id*="assistant-message"]';
const APPLY_DIRECTION_SELECTOR =
  '[name="user-prompt"], [data-testid="user-message"] p, [id*="assistant-message"]:not([id^="heading-"]) p';

function fixDuckaiDirection(): void {
  applyDetectedDirection(
    document.querySelectorAll(APPLY_DIRECTION_SELECTOR),
    getElementText,
  );
  forceLtrDirection(document.querySelectorAll(LTR_ONLY_SELECTOR));
}

export function initDuckai(): void {
  fixDuckaiDirection();
  observeBodyMutations(fixDuckaiDirection);
}
