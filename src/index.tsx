import React from 'react';
import Mindmap from './Mindmap';
import { Provider, defaultRoot } from './store/root';
import EditorStore, { initialState } from './store/editor';
import { ThemeContext, defaultTheme } from './context/theme';
import { defaultLocale } from './context/locale';
import { normalizeTopicSide } from './utils/tree';
import produce from 'immer';
import { LocaleContext } from './context/locale';
import { IntlKey } from './utils/Intl';
import { TopicData } from 'xmind-model/types/models/topic';

export interface MindmapProps {
  theme?: typeof defaultTheme;
  locale?: IntlKey;
  data?: TopicData;
  readonly?: boolean;
  onChange?: (data: TopicData) => void;
}

function EnhancedMindMap({
  readonly = false,
  data = defaultRoot,
  theme = defaultTheme,
  locale = defaultLocale.locale,
  onChange = () => {},
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
          onChange,
        }}
      >
        <ThemeContext.Provider value={theme}>
          <LocaleContext.Provider value={{ locale }}>
            <Mindmap></Mindmap>
          </LocaleContext.Provider>
        </ThemeContext.Provider>
      </Provider>
    </EditorStore.Provider>
  );
}

export { EnhancedMindMap as Mindmap };
