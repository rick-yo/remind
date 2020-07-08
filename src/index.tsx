import React from 'react';
import Mindmap, { MindmapProps } from './Mindmap';
import { Provider, defaultRoot } from './store/root';
import EditorStore, { initialState } from './store/editor';
import { defaultTheme } from './context/theme';
import { defaultLocale } from './context/locale';
import { normalizeTopicSide } from './utils/tree';
import produce from 'immer';

function EnhancedMindMap({
  readonly = false,
  data = defaultRoot,
  theme = defaultTheme,
  locale = defaultLocale.locale,
}: MindmapProps) {
  const rootWithSide = produce(data, normalizeTopicSide);
  return (
    <EditorStore.Provider
      initialState={{
        ...initialState,
        readonly: readonly,
      }}
    >
      <Provider
        initialState={{
          current: 0,
          timeline: [rootWithSide],
        }}
      >
        <Mindmap
          theme={theme}
          locale={locale}
          data={rootWithSide}
          readonly={readonly}
        ></Mindmap>
      </Provider>
    </EditorStore.Provider>
  );
}

export { EnhancedMindMap as Mindmap };
