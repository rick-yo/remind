import React from 'react';
import * as ReactDOM from 'react-dom';
import {
  WithReadOnly,
  WithoutData,
  WithCustomData,
  WithCustomTheme,
} from '../stories/index.stories';

describe('Mindmap', () => {
  it('renders mindmap without value', () => {
    const div = document.createElement('div');
    ReactDOM.render(<WithoutData />, div);
    ReactDOM.unmountComponentAtNode(div);
  });

  it('renders readonly mindmap', () => {
    const div = document.createElement('div');
    ReactDOM.render(<WithReadOnly />, div);
    ReactDOM.unmountComponentAtNode(div);
  });

  it('renders mindmap with custom value', () => {
    const div = document.createElement('div');
    ReactDOM.render(<WithCustomData />, div);
    ReactDOM.unmountComponentAtNode(div);
  });

  it('renders mindmap with custom theme', () => {
    const div = document.createElement('div');
    ReactDOM.render(<WithCustomTheme />, div);
    ReactDOM.unmountComponentAtNode(div);
  });
});
