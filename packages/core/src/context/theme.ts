import { createContext } from 'preact'

interface Theme {
  link: {
    stroke: string
    strokeWidth: number
  }
  topic: Record<string, unknown>
  mainColor: string
}

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
export type { Theme }
