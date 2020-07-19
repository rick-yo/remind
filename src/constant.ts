const CANVAS_WIDTH = window.innerWidth;
const CANVAS_HEIGHT = window.innerHeight;

const TOPIC_FONT_SIZE = 22;
const TOPIC_FONT_FAMILY = '微软雅黑,-apple-system';
const TOPIC_RADIUS = 5;
const TOPIC_HORIZENTAL_MARGIN = 50;
const MAX_TOPIC_WIDTH = 240;
const MIN_TOPIC_HEIGHT = 30;

const canvasContext = document
  .createElement('canvas')
  .getContext('2d') as CanvasRenderingContext2D;

const ATTACHED_KEY: string = 'attached';

enum EDITOR_MODE {
  regular,
  drag,
  edit,
}

const KEY_MAPS: Record<string, string> = {
  Backspace: 'Backspace',
  Tab: 'Tab',
  Enter: 'Enter',
  Escape: 'Escape',
  Space: 'Space',
  ArrowLeft: 'ArrowLeft',
  ArrowRight: 'ArrowRight',
  ArrowUp: 'ArrowUp',
  ArrowDown: 'ArrowDown',
};

const HOTKEYS = {
  tab: 'tab',
  space: 'space',
  backspace: 'backspace',
  left: 'left',
  right: 'right',
  up: 'up,top',
  down: 'down',
  undo: 'command+z,ctrl+z',
  redo: 'command+shift+z,ctrl+shift+z',
};

const EDITOR_ID = 'mindx-editor';
const CORE_EDITOR_ID = 'mindx-core-editor';
const TOPIC_CLASS = 'mindx-topic';

export {
  CANVAS_HEIGHT,
  CANVAS_WIDTH,
  TOPIC_FONT_SIZE,
  MAX_TOPIC_WIDTH,
  TOPIC_RADIUS,
  canvasContext,
  MIN_TOPIC_HEIGHT,
  ATTACHED_KEY,
  EDITOR_MODE,
  KEY_MAPS,
  EDITOR_ID,
  TOPIC_HORIZENTAL_MARGIN,
  TOPIC_FONT_FAMILY,
  CORE_EDITOR_ID,
  TOPIC_CLASS,
  HOTKEYS,
};
