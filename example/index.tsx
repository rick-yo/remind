import 'react-app-polyfill/ie11';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Mindmap } from '../src';

const App = () => {
  return (
    <div>
      <Mindmap />
    </div>
  );
};

ReactDOM.render(<App />, document.getElementById('root'));
