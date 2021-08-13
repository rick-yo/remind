import { useContext, memo } from 'react'
import { ThemeContext } from '../context/theme'
import { HierachyNodeWithTopicData } from '../utils/tree'
import { TOPIC_HORIZENTAL_MARGIN } from '../constant'

interface LinksProps {
  mindmap: HierachyNodeWithTopicData
}

function getMainTopicLinkPosition (
  root: HierachyNodeWithTopicData,
  child: HierachyNodeWithTopicData
) {
  const x1Offset = child.side === 'right' ? root.width - 50 : 50
  const x3Offset = child.side === 'right' ? 0 : child.width
  const x1 = root.x + x1Offset
  const y1 = root.y + root.height / 2
  const x2 =
    child.side === 'right'
      ? x1 + TOPIC_HORIZENTAL_MARGIN
      : x1 - TOPIC_HORIZENTAL_MARGIN
  const y2 = child.y + child.height / 2
  const x3 = child.x + x3Offset
  const y3 = y2
  return `${x1},${y1} ${x2},${y2} ${x3},${y3}`
}

const Links = (props: LinksProps) => {
  const { mindmap } = props
  const linkTheme = useContext(ThemeContext).link
  const links: string[] = []

  mindmap.eachNode((node) => {
    if (node.depth === 0) {
      node.children?.forEach((child) => {
        links.push(getMainTopicLinkPosition(node, child))
      })
      return
    }
    node.children?.forEach((child) => {
      const x1 = node.x + (child.side === 'right' ? node.width : 0)
      const y1 = node.y + node.height / 2
      const x2 = x1 + (child.side === 'right' ? 10 : -10)
      const y2 = y1
      const x3 = child.x + (child.side === 'right' ? 0 : child.width)
      const y3 = child.y + child.height / 2
      links.push(`${x1},${y1} ${x2},${y2} ${x3},${y3}`)
    })
  })
  return (
    <g>
      {links.map((link) => {
        return (
          <polyline
            key={link}
            points={link}
            fill='transparent'
            stroke={linkTheme.stroke}
            strokeWidth={linkTheme.strokeWidth}
          />
        )
      })}
    </g>
  )
}

export default memo(Links)
