import { useEffect, useRef, useMemo, useContext } from 'preact/hooks'
import { EDITOR_ID, TopicStyle } from '../constant'
import { mindmap } from '../layout/mindmap'
import { Model } from '../model'
import { ViewModel } from '../viewModel'
import { debug } from '../utils/debug'
import { ThemeContext } from '../context/theme'
import { LayoutNode, MindmapProps } from '../types'
import { useContributions, ViewType } from '../contribute'
import Links from './Links'
import styles from './index.module.css'
import Topic from './Topic'

const Mindmap = (props: MindmapProps) => {
  const { onChange, contributions = [] } = props
  const model = Model.useContainer()
  const viewModel = ViewModel.useContainer()
  const editorRef = useRef<HTMLDivElement>(null)
  const theme = useContext(ThemeContext)
  const { root } = model
  const { canvasWidth, canvasHeight } = theme
  const { slots } = useContributions({ view: editorRef, contributions })
  const mindmapSlots = slots.filter(
    (slot) => slot?.viewType === ViewType.mindmap,
  )

  const mindMap = useMemo(() => {
    const map = mindmap(root)
    // Move mindmap to canvas central positon
    map.each((node) => {
      node.x += canvasWidth / 2 - TopicStyle.maxWidth
      node.y += canvasHeight / 2
    })
    return map
  }, [root, canvasWidth, canvasHeight])

  debug('mindMap', mindMap)

  useEffect(() => {
    onChange?.(root)
  }, [root])

  useEffect(() => {
    viewModel.setMindmap(mindMap)
  }, [mindMap])

  return (
    <div
      ref={editorRef}
      id={EDITOR_ID}
      data-type={ViewType.mindmap}
      className={styles.editor}
      style={{
        fontFamily: TopicStyle.fontFamily,
        width: `${canvasWidth}px`,
        height: `${canvasHeight}px`,
      }}
    >
      <svg
        width={10_000}
        height={10_000}
        xmlns="http://www.w3.org/2000/svg"
        className={styles.svgCanvas}
      >
        <Links mindmap={mindMap} />
      </svg>
      <Topics mindMap={mindMap} />
      {mindmapSlots}
    </div>
  )
}

function Topics({ mindMap }: { mindMap: LayoutNode }) {
  return (
    <>
      {mindMap.descendants().map((node) => {
        return <Topic key={node.data.id} node={node} />
      })}
    </>
  )
}

export default Mindmap
