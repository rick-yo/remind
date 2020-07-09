import 'react-app-polyfill/ie11';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Mindmap } from '../src';
import { TopicData } from 'xmind-model/types/models/topic';

const App = () => {
  const id = 'mindx-state-storage';
  const [mindState, setMindState] = React.useState<TopicData | undefined>(
    undefined
  );
  function onChange(root: TopicData) {
    localStorage.setItem(id, JSON.stringify(root));
  }
  React.useEffect(() => {
    try {
      const storage = localStorage.getItem(id);
      if (!storage) return;
      const mindState = JSON.parse(storage);
      setMindState(mindState);
    } catch (e) {
      console.error(e);
    }
  }, []);
  return (
    <div>
      <Mindmap data={mindState} onChange={onChange} />
    </div>
  );
};

ReactDOM.render(<App />, document.getElementById('root'));
