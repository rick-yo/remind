import Mindmap from './Mindmap'
import { defaultRoot, RootStoreProvider } from './store/root'
import EditorStore from './store/editor'
import { ThemeContext, defaultTheme, Theme } from './context/theme'
import { defaultLocale, LocaleContext } from './context/locale'
import { normalizeTopicSide } from './utils/tree'
import { IntlKey } from './utils/Intl'
import { TopicData } from './types'
import { noop } from './utils/common'

export interface MindmapProps {
  theme?: Partial<Theme>
  locale?: IntlKey
  value?: TopicData
  readonly?: boolean
  onChange?: (value: TopicData) => void
}

function EnhancedMindMap({
  readonly = false,
  value = defaultRoot,
  theme = defaultTheme,
  locale = defaultLocale.locale,
  onChange = noop,
}: MindmapProps) {
  const rootWithSide = normalizeTopicSide(value)
  return (
    <EditorStore.Provider
      initialState={{
        readonly,
      }}
    >
      <RootStoreProvider
        initialState={{
          timeline: [rootWithSide],
          onChange,
          readonly,
        }}
      >
        <ThemeContext.Provider
          value={{
            ...defaultTheme,
            ...theme,
          }}
        >
          <LocaleContext.Provider value={{ locale }}>
            <Mindmap />
          </LocaleContext.Provider>
        </ThemeContext.Provider>
      </RootStoreProvider>
    </EditorStore.Provider>
  )
}

export { EnhancedMindMap as Mindmap }
