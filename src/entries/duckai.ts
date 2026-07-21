import { initFontInjection } from '../lib/fonts';
import { checkEnabled, observeToggle } from '../lib/storage';
import { initDuckai } from '../sites/duckai';

const SITE_ID = 'duckai';

checkEnabled(SITE_ID).then((enabled) => {
  if (enabled) {
    initFontInjection();
    initDuckai();
  }
  observeToggle(SITE_ID, (isEnabled) => {
    if (isEnabled) {
      location.reload();
    }
  });
});
