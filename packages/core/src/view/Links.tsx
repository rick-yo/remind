import { useContext } from 'preact/hooks'
import { ThemeContext } from '../context/theme'
import { LayoutType } from '../interface/layout'
import { LayoutTopic, TopicData } from '../interface/topic'
import { Model } from '../model'

interface LinksProps {
  layoutRoot: LayoutTopic
  layout: LayoutType
}
type LinkGenerator = (
  parent: LayoutTopic,
  child: LayoutTopic,
  justify: TopicData['justify'],
) => string

const generateHorizontalLink: LinkGenerator = (parent, child, justify) => {
  const [parentWidth, parentHeight] = parent.size
  const [childWidth, childHeight] = child.size
  const x1 = justify === 'start' ? parent.x : parent.x + parentWidth
  const y1 = parent.y + parentHeight / 2
  const x2 = justify === 'start' ? child.x + childWidth : child.x
  const y2 = child.y + childHeight / 2
  return `${x1},${y1} ${x2},${y2}`
}

const generateVerticalLink: LinkGenerator = (parent, child, justify) => {
  const [parentWidth, parentHeight] = parent.size
  const [childWidth, childHeight] = child.size
  const x1 = parent.x + parentWidth / 2
  const y1 = justify === 'start' ? parent.y : parent.y + parentHeight
  const x2 = child.x + childWidth / 2
  const y2 = justify === 'start' ? child.y + childHeight : child.y
  return `${x1},${y1} ${x2},${y2}`
}

const linkGenerator: Record<LayoutType, LinkGenerator> = {
  mindmap: generateHorizontalLink,
  structure: generateVerticalLink,
}

const Links = (props: LinksProps) => {
  const { layoutRoot, layout } = props
  const linkTheme = useContext(ThemeContext).link
  const model = Model.useContainer()
  const links: string[] = []

  layoutRoot.each((node) => {
    node.children?.forEach((child) => {
      links.push(
        linkGenerator[layout](node, child, model.getNodeJustify(child.data.id)),
      )
    })
  })
  return (
    <g className="links">
      {links.map((link) => {
        return (
          <polyline
            key={link}
            points={link}
            fill="transparent"
            stroke={linkTheme.stroke}
            strokeWidth={linkTheme.strokeWidth}
          />
        )
      })}
    </g>
  )
}

export { Links }
