import { render } from 'preact'
import { Mindmap } from './view/Mindmap'
import { defaultRoot, Model } from './model'
import { ViewModel } from './viewModel'
import { ThemeContext, defaultTheme } from './context/theme'
import { defaultLocale, LocaleContext } from './context/locale'
import { normalizeTopicSide } from './utils/tree'
import { MindmapProps } from './types'

function MindmapApp(props: MindmapProps) {
  const {
    value = defaultRoot,
    theme = defaultTheme,
    locale = defaultLocale.locale,
  } = props
  const rootWithSide = normalizeTopicSide(value)
  return (
    <ViewModel.Provider>
      <Model.Provider
        initialState={{
          root: rootWithSide,
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

function createMindmap(el: HTMLElement, options: MindmapProps) {
  render(<MindmapApp {...options} />, el)
}

export { createMindmap }
