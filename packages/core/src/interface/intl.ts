type IntlLanguage = 'en' | 'cn' | 'ja'

interface IntlContent {
  open: string
  subTopic: string
  focus: string
  cancelFocus: string
  link: string

  font: string
  background: string
  tag: string
  icon: string
}

export type { IntlLanguage, IntlContent }
