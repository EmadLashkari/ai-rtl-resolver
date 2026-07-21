import { initFontInjection } from '../lib/fonts';
import { checkEnabled, observeToggle } from '../lib/storage';
import { initKimi } from '../sites/kimi';

const SITE_ID = 'kimi';

checkEnabled(SITE_ID).then((enabled) => {
  if (enabled) {
    initFontInjection();
    initKimi();
  }
  observeToggle(SITE_ID, (isEnabled) => {
    if (isEnabled) {
      location.reload();
    }
  });
});
