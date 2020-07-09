import React from 'react';
import * as ReactDOM from 'react-dom';
import {
  ReadOnly,
  WithoutData,
  WithCustomData,
} from '../stories/index.stories';

describe('Mindmap', () => {
  it('renders mindmap without data', () => {
    const div = document.createElement('div');
    ReactDOM.render(<WithoutData />, div);
    ReactDOM.unmountComponentAtNode(div);
  });

  it('renders readonly mindmap', () => {
    const div = document.createElement('div');
    ReactDOM.render(<ReadOnly />, div);
    ReactDOM.unmountComponentAtNode(div);
  });

  it('renders mindmap with custom data', () => {
    const div = document.createElement('div');
    ReactDOM.render(<WithCustomData />, div);
    ReactDOM.unmountComponentAtNode(div);
  });
});
