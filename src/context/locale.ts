import React, { useContext } from 'react';
import { Intl, IntlResult } from '../utils/Intl';

interface Locale {
  locale: 'en' | 'cn' | 'jp';
}

const defaultLocale: Locale = {
  locale: 'en',
};

const LocaleContext = React.createContext(defaultLocale);

function useLocale(): IntlResult {
  const locale = useContext(LocaleContext).locale;
  return Intl[locale];
}

export { LocaleContext, defaultLocale, useLocale, Locale };
