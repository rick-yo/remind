import { useEffect, useRef, useMemo, useContext } from 'preact/hooks'
import { JSX } from 'preact'
import { EDITOR_ID, TopicStyle } from '../constant'
import { mindmap } from '../layout/mindmap'
import { Model } from '../model'
import { ViewModel } from '../viewModel'
import { debug } from '../utils/debug'
import { useIconFont } from '../utils/dom'
import { ThemeContext } from '../context/theme'
import { MindmapProps } from '../types'
import { useContributions, ViewType } from '../contribute'
import Toolbar from './Toolbar'
import Links from './Links'
import styles from './index.module.css'
import Topic from './Topic'

const Mindmap = (props: MindmapProps) => {
  const { onChange, contributions = [] } = props
  const model = Model.useContainer()
  const viewModel = ViewModel.useContainer()
  const { root } = model
  const theme = useContext(ThemeContext)
  const { scale } = viewModel
  const { canvasWidth, canvasHeight } = theme
  const mindMap = useMemo(() => {
    const map = mindmap(root)
    // Move mindmap to canvas central positon
    map.each((node) => {
      node.x += canvasWidth / 2 - TopicStyle.maxWidth
      node.y += canvasHeight / 2
    })
    return map
  }, [root, canvasWidth, canvasHeight])

  const editorRef = useRef<HTMLDivElement>(null)
  useIconFont()

  const topics: JSX.Element[] = useMemo(() => {
    return mindMap.descendants().map((node) => {
      return <Topic key={node.data.id} node={node} />
    })
  }, [mindMap])

  debug('mindMap', mindMap)

  useEffect(() => {
    onChange?.(root)
  }, [root])

  useEffect(() => {
    viewModel.setMindmap(mindMap)
  }, [mindMap])

  useContributions({ view: editorRef, contributions })

  return (
    <div
      ref={editorRef}
      id={EDITOR_ID}
      className={styles.editorContainer}
      data-type={ViewType.mindmap}
      style={{
        fontFamily: TopicStyle.fontFamily,
        width: `${canvasWidth}px`,
        height: `${canvasHeight}px`,
      }}
    >
      <div
        className={styles.editor}
        style={{
          transform: `scale(${scale}, ${scale})`,
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
        {topics}
      </div>
      <Toolbar />
    </div>
  )
}

export default Mindmap
