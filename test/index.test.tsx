import React from 'react';
import * as ReactDOM from 'react-dom';
import { Mindmap } from '../src';
import { ReadOnly } from '../stories/index.stories';

describe('Mindmap', () => {
  it('renders without crashing', () => {
    const div = document.createElement('div');
    ReactDOM.render(<Mindmap />, div);
    ReactDOM.unmountComponentAtNode(div);
  });

  it('renders readonly Mindmap', () => {
    const div = document.createElement('div');
    ReactDOM.render(<ReadOnly />, div);
    ReactDOM.unmountComponentAtNode(div);
  });
});
