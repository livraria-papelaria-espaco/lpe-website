import { addLocaleData } from 'react-intl';
import { reduce } from 'lodash';
import en from 'react-intl/locale-data/en';
import pt from 'react-intl/locale-data/pt';
import trads from './translations';

// We dismiss pt-BR and zh-Hans locales since they are not supported by react-intl
const locales = {
  en,
  pt,
};
const languages = Object.keys(trads);

/**
 * Dynamically generate `translationsMessages object`.
 */
const translationMessages = reduce(
  languages,
  (result, language) => {
    const obj = result;
    obj[language] = trads[language];

    if (locales[language]) {
      addLocaleData(locales[language]);
    }

    return obj;
  },
  {}
);

export { languages, translationMessages };
