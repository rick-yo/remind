import { render } from 'preact'
import { Mindmap, MindmapProps } from './view/Mindmap'
import { defaultRoot, Model } from './model'
import { ViewModel } from './viewModel'
import { ThemeContext, defaultTheme } from './context/theme'
import { defaultLocale, LocaleContext } from './context/locale'

function MindmapApp(props: MindmapProps) {
  const {
    value = defaultRoot,
    theme = defaultTheme,
    locale = defaultLocale.locale,
  } = props
  return (
    <ViewModel.Provider>
      <Model.Provider
        initialState={{
          root: value,
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

function createMindmap(el: HTMLElement, options?: MindmapProps) {
  render(<MindmapApp {...options} />, el)
}

export { createMindmap }
