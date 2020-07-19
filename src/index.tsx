import React from 'react';
import Mindmap from './Mindmap';
import { Provider, defaultRoot } from './store/root';
import EditorStore from './store/editor';
import { ThemeContext, defaultTheme, Theme } from './context/theme';
import { defaultLocale } from './context/locale';
import { normalizeTopicSide } from './utils/tree';
import produce from 'immer';
import { LocaleContext } from './context/locale';
import { IntlKey } from './utils/Intl';
import { TopicData } from 'xmind-model/types/models/topic';

export interface MindmapProps {
  theme?: Partial<Theme>;
  locale?: IntlKey;
  value?: TopicData;
  readonly?: boolean;
  onChange?: (value: TopicData) => void;
}

function EnhancedMindMap({
  readonly = false,
  value = defaultRoot,
  theme = defaultTheme,
  locale = defaultLocale.locale,
  onChange = () => {},
}: MindmapProps) {
  const rootWithSide = produce(value, normalizeTopicSide);
  return (
    <EditorStore.Provider
      initialState={{
        ...EditorStore.getState(),
        readonly: readonly,
      }}
    >
      <Provider
        initialState={{
          current: 0,
          timeline: [rootWithSide],
          onChange,
          readonly,
        }}
      >
        <ThemeContext.Provider
          value={{
            ...defaultTheme,
            ...theme,
          }}
        >
          <LocaleContext.Provider value={{ locale }}>
            <Mindmap></Mindmap>
          </LocaleContext.Provider>
        </ThemeContext.Provider>
      </Provider>
    </EditorStore.Provider>
  );
}

export { EnhancedMindMap as Mindmap };
