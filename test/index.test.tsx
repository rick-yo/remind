import React from 'react';
import * as ReactDOM from 'react-dom';
import { WithNormalRender } from '../stories/index.stories';

describe('Xmind', () => {
  it('renders without crashing', () => {
    const div = document.createElement('div');
    ReactDOM.render(<WithNormalRender />, div);
    ReactDOM.unmountComponentAtNode(div);
  });
});
