import { createRef, RefObject, render } from 'preact'
import { forwardRef } from 'preact/compat'
import { Mindmap, MindmapProps } from './view/Mindmap'
import { defaultRoot, Model } from './model'
import { ViewModel } from './viewModel'
import { ThemeContext, defaultTheme } from './context/theme'
import { defaultLocale, LocaleContext } from './context/locale'
import { ContributionAPI } from './interface/contribute'
import { noop } from './utils/common'

const defaultProps: MindmapProps = {
  value: defaultRoot,
  theme: defaultTheme,
  locale: defaultLocale.locale,
  onChange: noop,
  contributions: [],
  layout: 'mindmap',
}

const MindmapApp = forwardRef(
  (props: Partial<MindmapProps>, ref: RefObject<ContributionAPI>) => {
    const {
      value = defaultProps.value,
      theme = defaultTheme,
      locale = defaultProps.locale,
    } = props
    return (
      <ViewModel.Provider>
        <Model.Provider
          initialState={{
            root: value,
          }}
        >
          <ThemeContext.Provider value={theme}>
            <LocaleContext.Provider value={{ locale }}>
              <Mindmap {...defaultProps} {...props} ref={ref} />
            </LocaleContext.Provider>
          </ThemeContext.Provider>
        </Model.Provider>
      </ViewModel.Provider>
    )
  },
)

function createMindmap(el: HTMLElement, options?: Partial<MindmapProps>) {
  const ref = createRef<ContributionAPI>()
  render(<MindmapApp ref={ref} {...options} />, el)
  return ref
}

export { createMindmap }
