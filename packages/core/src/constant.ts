const TopicStyle = {
  maxWidth: 240,
  minHeight: 30,
  padding: 8,
  margin: 120,
  fontSize: 20,
  fontFamily: `"Microsoft Yahei", "PingFang SC"`,
  lineHeight: 1.2,
}

const canvasContext = document.createElement('canvas').getContext('2d')!

enum EDITOR_MODE {
  none,
  drag,
  edit,
}

enum ViewType {
  mindmap,
  topic,
  link,
}

export { canvasContext, EDITOR_MODE, TopicStyle, ViewType }
