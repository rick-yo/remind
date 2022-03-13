import { useContext } from 'preact/hooks'
import { ThemeContext } from '../context/theme'
import {
  EDITOR_MODE,
  TopicStyle,
  TopicTextRenderOptions,
  ViewType,
} from '../constant'
import { getTopicTextStyle } from '../layout/shared'
import { ViewModel } from '../viewModel'
import { LayoutNode } from '../interface/topic'
import { renderText } from '../utils/textRender'
import styles from './index.module.css'

type TopicProps = {
  node: LayoutNode
}

const Topic = (props: TopicProps) => {
  const viewModel = ViewModel.useContainer()
  const $theme = useContext(ThemeContext)
  const { node } = props
  const {
    data: { title, id },
    x,
    y,
    depth,
    size,
  } = node
  const { mode, selection } = viewModel
  const isSelected = id === selection
  const isEditing = isSelected && mode === EDITOR_MODE.edit
  const isMainTopic = depth <= 1
  const [width, height] = size

  const outline = isSelected
    ? {
        stroke: $theme.mainColor,
        strokeWidth: TopicStyle.borderWidth,
      }
    : {}
  const background = isMainTopic || isEditing ? '#fff' : 'transparent'

  const textStyle = getTopicTextStyle(node.data)
  const { lines } = renderText(title, {
    ...TopicTextRenderOptions,
    style: textStyle,
  })

  if (isEditing) return null
  return (
    <g
      className={styles.topic}
      data-id={id}
      data-type={ViewType.topic}
      transform={`translate(${x} ${y})`}
    >
      <rect
        width={width}
        height={height}
        fill={background}
        radius={5}
        {...outline}
      ></rect>
      <text style={textStyle}>
        {lines.map((line) => (
          <tspan x={line.x} y={line.y}>
            {line.text}
          </tspan>
        ))}
      </text>
    </g>
  )
}

export default Topic
