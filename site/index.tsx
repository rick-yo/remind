import 'react-app-polyfill/ie11';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Mindmap } from '../src';
import { TopicData } from 'xmind-model/types/models/topic';
import { createTopic } from '../src/utils/tree';

const defaultRoot: TopicData = {
  ...createTopic('How to use Remind 🤔'),
  children: {
    attached: [
      {
        ...createTopic('Basic shortcut 🍩'),
        children: {
          attached: [
            createTopic('tab - Create a child topic'),
            createTopic('del - Remove a topic'),
            createTopic('space or doubleclick - Edit a topic'),
            createTopic('Enter - Save edited topic'),
          ],
        },
      },
      {
        ...createTopic('Advanced shortcut 🏂'),
        children: {
          attached: [
            createTopic('command+z - Undo'),
            createTopic('command+shift+z - Redo'),
            createTopic('up, down, left, right - navigate between topics'),
          ],
        },
      },
      {
        ...createTopic('Bottom menu 🥙'),
        children: {
          attached: [
            createTopic('Full screen'),
            createTopic('Return to Center'),
            createTopic('Zoom in'),
            createTopic('Zoom out'),
          ],
        },
      },
      {
        ...createTopic('Draggable 🏑'),
        children: {
          attached: [createTopic('Drag a node to target one and append to it')],
        },
      },
    ],
  },
};

const App = () => {
  const id = 'remind-state-storage';
  const [mindState, setMindState] = React.useState<TopicData | undefined>(
    defaultRoot
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
      <Mindmap value={mindState} onChange={onChange} />
    </div>
  );
};

ReactDOM.render(<App />, document.getElementById('root'));
