import { useEffect, useRef, useMemo } from 'preact/hooks'
import { mindmap } from '../layout/mindmap'
import { Model } from '../model'
import { ViewModel } from '../viewModel'
import { debug } from '../utils/debug'
import { LayoutNode, MindmapProps } from '../types'
import { useContributions, ViewType } from '../contribute'
import { toPX } from '../utils/common'
import { normalizeTopic } from '../utils/tree'
import { Links } from './Links'
import styles from './index.module.css'
import Topic from './Topic'

const Mindmap = (props: MindmapProps) => {
  const { onChange, contributions = [] } = props
  const model = Model.useContainer()
  const viewModel = ViewModel.useContainer()
  const editorRef = useRef<HTMLDivElement>(null)
  const { root } = model
  const { slots } = useContributions({ view: editorRef, contributions })
  const mindmapSlots = slots.filter(
    (slot) => slot?.viewType === ViewType.mindmap,
  )

  const { layoutRoot, canvasWidth, canvasHeight } = useMemo(() => {
    return mindmap(normalizeTopic(root))
  }, [root])

  debug('mindMap', layoutRoot)
  console.count('mindMap rerender')

  useEffect(() => {
    onChange?.(root)
  }, [root])

  useEffect(() => {
    viewModel.setMindmap(layoutRoot)
  }, [layoutRoot])

  return (
    <div
      ref={editorRef}
      data-type={ViewType.mindmap}
      className={styles.editor}
      style={{
        width: toPX(canvasWidth),
        height: toPX(canvasHeight),
      }}
    >
      <svg
        width={canvasWidth}
        height={canvasHeight}
        xmlns="http://www.w3.org/2000/svg"
        className={styles.svgCanvas}
      >
        <Links mindmap={layoutRoot} />
      </svg>
      <Topics mindMap={layoutRoot} />
      {mindmapSlots}
    </div>
  )
}

function Topics({ mindMap }: { mindMap: LayoutNode }) {
  return (
    <div className="topics">
      {mindMap.descendants().map((node) => {
        return <Topic key={node.data.id} node={node} />
      })}
    </div>
  )
}

export { Mindmap }
