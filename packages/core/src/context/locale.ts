import { createContext } from 'preact'
import { useContext } from 'preact/hooks'
import { IntlLanguage, IntlContent } from '../interface/intl'

interface Locale {
  locale: IntlLanguage
}

const IntlContents: Record<IntlLanguage, IntlContent> = {
  cn: {
    open: '打开文件',
    subTopic: '子主题',

    focus: '专注',
    cancelFocus: '取消专注',
    link: '连接',

    font: '文字',
    background: '背景',
    tag: '标签',
    icon: '图标',
  },
  en: {
    open: 'Open File',
    subTopic: 'Sub Topic',

    focus: 'Focus Mode',
    cancelFocus: 'Cancel Focus Mode',
    link: 'Link',

    font: 'Font',
    background: 'Background',
    tag: 'Tag',
    icon: 'Icon',
  },
  ja: {
    open: '開いたファイル',
    subTopic: 'サブテーマ',

    focus: '集中',
    cancelFocus: '集中解除',
    link: 'コネクト',

    font: 'フォント',
    background: 'バックグラウンド',
    tag: 'タグ',
    icon: 'アイコン',
  },
}

const defaultLocale: Locale = {
  locale: 'en',
}

const LocaleContext = createContext(defaultLocale)

function useLocale(): IntlContent {
  const { locale } = useContext(LocaleContext)
  return IntlContents[locale]
}

export { LocaleContext, defaultLocale, useLocale }
export type { Locale }
