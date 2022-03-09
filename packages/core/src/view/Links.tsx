import { useContext } from 'preact/hooks'
import { ThemeContext } from '../context/theme'
import { LayoutNode } from '../interface/topic'
import { LayoutType } from '../layout'

interface LinksProps {
  layoutRoot: LayoutNode
  layout: LayoutType
}
type LinkGenerator = (parent: LayoutNode, child: LayoutNode) => string

const generateHorizontalLink: LinkGenerator = (parent, child) => {
  const [parentWidth, parentHeight] = parent.size
  const [, childHeight] = child.size
  const x1 = parent.x + parentWidth
  const y1 = parent.y + parentHeight / 2
  const x2 = child.x
  const y2 = child.y + childHeight / 2
  return `${x1},${y1} ${x2},${y2}`
}

const generateVerticalLink: LinkGenerator = (parent, child) => {
  const [parentWidth, parentHeight] = parent.size
  const [childWidth] = child.size
  const x1 = parent.x + parentWidth / 2
  const y1 = parent.y + parentHeight
  const x2 = child.x + childWidth / 2
  const y2 = child.y
  return `${x1},${y1} ${x2},${y2}`
}

const linkGenerator: Record<LayoutType, LinkGenerator> = {
  mindmap: generateHorizontalLink,
  structure: generateVerticalLink,
}

const Links = (props: LinksProps) => {
  const { layoutRoot, layout } = props
  const linkTheme = useContext(ThemeContext).link
  const links: string[] = []

  layoutRoot.each((node) => {
    node.children?.forEach((child) => {
      links.push(linkGenerator[layout](node, child))
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
