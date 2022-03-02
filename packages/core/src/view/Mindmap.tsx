import { useEffect, useRef, useMemo } from 'preact/hooks'
import { mindmap } from '../layout/mindmap'
import { Model } from '../model'
import { ViewModel } from '../viewModel'
import { useContributions } from '../contribute'
import { toPX } from '../utils/common'
import { normalizeTopic } from '../utils/tree'
import { Theme } from '../interface/theme'
import { IntlLanguage } from '../interface/intl'
import { LayoutNode, TopicData } from '../interface/topic'
import { Contribution } from '../interface/contribute'
import { ViewType } from '../constant'
import { Links } from './Links'
import Topic from './Topic'
import styles from './index.module.css'

interface MindmapProps {
  theme?: Partial<Theme>
  locale?: IntlLanguage
  value?: TopicData
  onChange?: (value: TopicData) => void
  contributions?: Contribution[]
}

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

  console.log('layoutRoot', layoutRoot)
  console.count('MindMap rerender')

  useEffect(() => {
    onChange?.(root)
  }, [root])

  useEffect(() => {
    viewModel.setLayoutRoot(layoutRoot)
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
        <Links layoutRoot={layoutRoot} />
      </svg>
      <Topics layoutRoot={layoutRoot} />
      {mindmapSlots}
    </div>
  )
}

function Topics({ layoutRoot }: { layoutRoot: LayoutNode }) {
  return (
    <div className="topics">
      {layoutRoot.descendants().map((node) => {
        return <Topic key={node.data.id} node={node} />
      })}
    </div>
  )
}

export { Mindmap }
export type { MindmapProps }
