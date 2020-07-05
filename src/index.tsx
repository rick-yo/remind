import React from 'react';
import Mindmap, { MindmapProps } from './Mindmap';
import { Provider, defaultRoot } from './store/root';
import EditorStore from './store/editor';

function EnhancedMindMap(props: MindmapProps) {
  return (
    <EditorStore.Provider>
      <Provider
        initialState={{
          current: 0,
          timeline: [props.data || defaultRoot],
        }}
      >
        <Mindmap {...props}></Mindmap>
      </Provider>
    </EditorStore.Provider>
  );
}

export { EnhancedMindMap as Mindmap };
