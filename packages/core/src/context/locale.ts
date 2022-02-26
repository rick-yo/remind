import { createContext } from 'preact'
import { useContext } from 'preact/hooks'
import { Intl, IntlValue, IntlKey } from '../utils/Intl'

interface Locale {
  locale: IntlKey
}

const defaultLocale: Locale = {
  locale: 'en',
}

const LocaleContext = createContext(defaultLocale)

function useLocale(): IntlValue {
  const { locale } = useContext(LocaleContext)
  return Intl[locale]
}

export { LocaleContext, defaultLocale, useLocale }
export type { Locale }
