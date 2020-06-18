import 'react-app-polyfill/ie11';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Sind } from '../src';

const App = () => {
  return (
    <div>
      <Sind />
    </div>
  );
};

ReactDOM.render(<App />, document.getElementById('root'));
