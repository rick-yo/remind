import { useEffect, useRef, useMemo, useImperativeHandle } from 'preact/hooks'
import { RefObject } from 'preact'
import { forwardRef } from 'preact/compat'
import { Model } from '../model'
import { ViewModel } from '../viewModel'
import { useContributions, useContributionAPI } from '../contribute'
import { toPX } from '../utils/common'
import { Theme } from '../interface/theme'
import { IntlLanguage } from '../interface/intl'
import { LayoutTopic, TopicData } from '../interface/topic'
import { Contribution, ContributionAPI } from '../interface/contribute'
import { ViewType } from '../constant'
import { debug } from '../utils/debug'
import { doLayout } from '../layout'
import { LayoutType } from '../interface/layout'
import { useTextEditor } from '../utils/useTextEditor'
import { Links } from './Links'
import Topic from './Topic'
import styles from './index.module.css'

interface MindmapProps {
  theme: Theme
  locale: IntlLanguage
  value: TopicData
  onChange: (value: TopicData) => void
  contributions: Contribution[]
  layout: LayoutType
}

const Mindmap = forwardRef(
  (props: MindmapProps, ref: RefObject<ContributionAPI>) => {
    const { onChange, contributions, layout, theme } = props
    const model = Model.useContainer()
    const viewModel = ViewModel.useContainer()
    const editorRef = useRef<HTMLDivElement>(null)
    const { root } = model
    const textEditor = useTextEditor()
    const contributionAPI = useContributionAPI({
      view: editorRef,
      layout,
      textEditor,
    })
    const { slots } = useContributions(contributionAPI, contributions)
    const mindmapSlots = slots.filter(
      (slot) => slot?.viewType === ViewType.mindmap,
    )

    const { layoutRoot, canvasWidth, canvasHeight } = useMemo(() => {
      return doLayout(root, { layout, theme })
    }, [root, layout, theme])

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
        draggable
      >
        <svg
          className={styles.svgCanvas}
          width={canvasWidth}
          height={canvasHeight}
          xmlns="http://www.w3.org/2000/svg"
        >
          <Links layoutRoot={layoutRoot} layout={layout} />
          <Topics layoutRoot={layoutRoot} />
        </svg>
        {textEditor.editor}
        {mindmapSlots}
      </div>
    )
  },
)

function Topics({ layoutRoot }: { layoutRoot: LayoutTopic }) {
  return (
    <g className="topics">
      {layoutRoot.descendants().map((node) => {
        return <Topic key={node.data.id} node={node} />
      })}
    </g>
  )
}

export { Mindmap }
export type { MindmapProps }
