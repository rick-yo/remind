import { createContext } from 'preact'
import { Theme } from '../interface/theme'

const defaultTheme: Theme = {
  link: {
    stroke: '#000',
    strokeWidth: 0.5,
  },
  topic: {},
  mainColor: '#4dc4ff',
}

const ThemeContext = createContext(defaultTheme)

export { ThemeContext, defaultTheme }
