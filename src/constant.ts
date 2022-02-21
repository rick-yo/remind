const TopicStyle = {
  fontSize: 22,
  fontFamily: '微软雅黑,-apple-system',
  radius: 5,
  padding: 5,
  maxWidth: 240,
  minHeight: 30,
  defaultSize: [150, 40],
}

const canvasContext = document.createElement('canvas').getContext('2d')!

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
}

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
}

const EDITOR_ID = 'remind-editor'
const CORE_EDITOR_ID = 'remind-core-editor'
const TOPIC_CLASS = 'remind-topic'

export {
  canvasContext,
  EDITOR_MODE,
  KEY_MAPS,
  EDITOR_ID,
  CORE_EDITOR_ID,
  TOPIC_CLASS,
  HOTKEYS,
  TopicStyle,
}
