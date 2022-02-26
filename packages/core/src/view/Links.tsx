import { useContext } from 'preact/hooks'
import { ThemeContext } from '../context/theme'
import { LayoutNode } from '../types'

interface LinksProps {
  mindmap: LayoutNode
}

const Links = (props: LinksProps) => {
  const { mindmap } = props
  const linkTheme = useContext(ThemeContext).link
  const links: string[] = []

  mindmap.each((node) => {
    if (node.depth === 0) {
      node.children?.forEach((child) => {
        links.push(getMainTopicLink(node, child))
      })
    } else {
      node.children?.forEach((child) => {
        links.push(getSubTopicLink(node, child))
      })
    }
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

function getMainTopicLink(parent: LayoutNode, child: LayoutNode) {
  const [parentWidth, parentHeight] = parent.size
  const [, childHeight] = child.size
  const x1_offset = parentWidth - 50

  const x1 = parent.x + x1_offset
  const y1 = parent.y + parentHeight / 2
  const x2 = child.x
  const y2 = child.y + childHeight / 2

  return `${x1},${y1} ${x2},${y2}`
}

function getSubTopicLink(parent: LayoutNode, child: LayoutNode) {
  const [parentWidth, parentHeight] = parent.size
  const [, childHeight] = child.size
  const x1 = parent.x + parentWidth
  const y1 = parent.y + parentHeight / 2
  const x2 = child.x
  const y2 = child.y + childHeight / 2
  return `${x1},${y1} ${x2},${y2}`
}

export { Links }
