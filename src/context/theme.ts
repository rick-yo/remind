import React from 'react';

interface Theme {
  link: {
    stroke: string;
    strokeWidth: number;
  };
  topic: {
    borderColor: string;
  };
  canvasWidth: number;
  canvasHeight: number;
}

const defaultTheme: Theme = {
  link: {
    stroke: '#000',
    strokeWidth: 0.5,
  },
  topic: {
    borderColor: '#4dc4ff',
  },
  canvasWidth: window.innerWidth,
  canvasHeight: window.innerHeight,
};

const ThemeContext = React.createContext(defaultTheme);

export { ThemeContext, defaultTheme, Theme };
