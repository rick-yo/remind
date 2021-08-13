import React, { useContext } from 'react'
import { Intl, IntlValue, IntlKey } from '../utils/Intl'

interface Locale {
  locale: IntlKey
}

const defaultLocale: Locale = {
  locale: 'en'
}

const LocaleContext = React.createContext(defaultLocale)

function useLocale (): IntlValue {
  const locale = useContext(LocaleContext).locale
  return Intl[locale]
}

export { LocaleContext, defaultLocale, useLocale, Locale }
