import type { TextRenderOption } from './utils/textRender'

const TopicStyle = {
  maxWidth: 240,
  get minHeight() {
    return this.rootTopicFontSize * this.lineHeight + this.padding * 2
  },
  padding: 8,
  margin: 80,
  rootTopicFontSize: 18,
  fontFamily: `"Microsoft Yahei", "PingFang SC"`,
  lineHeight: 1.2,
}

const TopicTextRenderOptions: Omit<TextRenderOption, 'style'> = {
  box: {
    width: TopicStyle.maxWidth,
    height: 10_000,
  },
  padding: TopicStyle.padding,
}

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

export { EDITOR_MODE, TopicStyle, ViewType, TopicTextRenderOptions }
