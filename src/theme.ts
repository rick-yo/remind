import React from 'react';

const defaultTheme = {
  link: {
    stroke: "#000",
  },
  topic: {
    stroke: "#000",
    rx: 5,
    ry: 5,
  }
};

const ThemeContext = React.createContext(defaultTheme);

export {
  ThemeContext,
  defaultTheme
};