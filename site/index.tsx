import 'react-app-polyfill/ie11';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Mindmap } from '../src';
import useLocalStorageState from './useLocalStorageState';
import { customData } from '../stories/index.stories';

const App = () => {
  const [storageState, setStorageState] = useLocalStorageState(
    'mindx-storage-state',
    customData
  );
  return (
    <div>
      <Mindmap data={storageState} onChange={setStorageState} />
    </div>
  );
};

ReactDOM.render(<App />, document.getElementById('root'));
