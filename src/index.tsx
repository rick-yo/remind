import Mindmap from './view/Mindmap'
import { defaultRoot, Model } from './model'
import { ViewModel } from './viewModel'
import { ThemeContext, defaultTheme } from './context/theme'
import { defaultLocale, LocaleContext } from './context/locale'
import { normalizeTopicSide } from './utils/tree'
import { noop } from './utils/common'
import { MindmapProps } from './types'

function EnhancedMindMap(props: MindmapProps) {
  const {
    readonly = false,
    value = defaultRoot,
    theme = defaultTheme,
    locale = defaultLocale.locale,
    onChange = noop,
  } = props
  const rootWithSide = normalizeTopicSide(value)
  return (
    <ViewModel.Provider
      initialState={{
        readonly,
      }}
    >
      <Model.Provider
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
            <Mindmap {...props} />
          </LocaleContext.Provider>
        </ThemeContext.Provider>
      </Model.Provider>
    </ViewModel.Provider>
  )
}

export { EnhancedMindMap as Mindmap }
