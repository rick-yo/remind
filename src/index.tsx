import Mindmap from './Mindmap'
import { defaultRoot, RootStore } from './store/root'
import EditorStore from './store/editor'
import { ThemeContext, defaultTheme } from './context/theme'
import { defaultLocale, LocaleContext } from './context/locale'
import { normalizeTopicSide } from './utils/tree'
import { noop } from './utils/common'
import { MindmapProps } from './types'

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
      <RootStore.Provider
        initialState={{
          root: rootWithSide,
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
      </RootStore.Provider>
    </EditorStore.Provider>
  )
}

export { EnhancedMindMap as Mindmap }
