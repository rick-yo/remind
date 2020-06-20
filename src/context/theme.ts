import React from 'react';

const defaultTheme = {
  link: {
    stroke: '#000',
  },
  topic: {
    stroke: '#000',
    borderColor: '#4dc4ff',
  },
};

const ThemeContext = React.createContext(defaultTheme);

export { ThemeContext, defaultTheme };
