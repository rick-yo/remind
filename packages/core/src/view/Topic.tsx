import { useContext } from 'preact/hooks'
import { ThemeContext } from '../context/theme'
import { EDITOR_MODE, ViewType } from '../constant'
import { createTopicTextRenderBox, getTopicTextStyle } from '../layout/shared'
import { ViewModel } from '../viewModel'
import { LayoutTopic } from '../interface/topic'
import { renderText } from '../utils/textRender'
import styles from './index.module.css'

type TopicProps = {
  node: LayoutTopic
}

const Topic = (props: TopicProps) => {
  const viewModel = ViewModel.useContainer()
  const theme = useContext(ThemeContext)
  const {
    topic: { borderWidth, borderColor },
  } = theme
  const { node } = props
  const {
    data: { title, id },
    x,
    y,
    size,
  } = node
  const { mode, selection } = viewModel
  const isSelected = id === selection
  const isEditing = isSelected && mode === EDITOR_MODE.edit
  const [width, height] = size

  const outline = isSelected
    ? {
        stroke: borderColor,
        strokeWidth: borderWidth,
      }
    : {}

  const textStyle = getTopicTextStyle(theme, node)
  const { lines } = renderText(title, {
    ...createTopicTextRenderBox(theme, node),
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
        fill={textStyle.background}
        rx={textStyle.borderRadius}
        ry={textStyle.borderRadius}
        {...outline}
      ></rect>
      <text style={textStyle} fill={textStyle.color}>
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
