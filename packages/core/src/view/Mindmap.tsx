import { useEffect, useRef, useMemo, useImperativeHandle } from 'preact/hooks'
import { RefObject } from 'preact'
import { forwardRef } from 'preact/compat'
import { Model } from '../model'
import { ViewModel } from '../viewModel'
import { useContributions, useContributionAPI } from '../contribute'
import { toPX } from '../utils/common'
import { normalizeTopic } from '../utils/tree'
import { Theme } from '../interface/theme'
import { IntlLanguage } from '../interface/intl'
import { LayoutNode, TopicData } from '../interface/topic'
import { Contribution, ContributionAPI } from '../interface/contribute'
import { ViewType } from '../constant'
import { debug } from '../utils/debug'
import { doLayout, LayoutType } from '../layout'
import { Links } from './Links'
import Topic from './Topic'
import styles from './index.module.css'

interface MindmapProps {
  theme?: Partial<Theme>
  locale?: IntlLanguage
  value?: TopicData
  onChange?: (value: TopicData) => void
  contributions?: Contribution[]
  layout?: LayoutType
}

const Mindmap = forwardRef(
  (props: MindmapProps, ref: RefObject<ContributionAPI>) => {
    const { onChange, contributions = [], layout = 'structure' } = props
    const model = Model.useContainer()
    const viewModel = ViewModel.useContainer()
    const editorRef = useRef<HTMLDivElement>(null)
    const { root } = model
    const contributionAPI = useContributionAPI({
      view: editorRef,
    })
    const { slots } = useContributions(contributionAPI, contributions)
    const mindmapSlots = slots.filter(
      (slot) => slot?.viewType === ViewType.mindmap,
    )

    const { layoutRoot, canvasWidth, canvasHeight } = useMemo(() => {
      return doLayout(normalizeTopic(root), layout)
    }, [root])

    debug('layoutRoot', layoutRoot)

    useEffect(() => {
      onChange?.(root)
    }, [root])

    useEffect(() => {
      viewModel.setLayoutRoot(layoutRoot)
    }, [layoutRoot])

    useImperativeHandle(ref, () => contributionAPI, [contributionAPI])

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
          <Links layoutRoot={layoutRoot} layout={layout} />
        </svg>
        <Topics layoutRoot={layoutRoot} />
        {mindmapSlots}
      </div>
    )
  },
)

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
