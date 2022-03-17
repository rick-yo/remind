import { JSX } from 'preact'
import { useContext } from 'preact/hooks'
import { ThemeContext } from '../context/theme'
import { LayoutType } from '../interface/layout'
import { LayoutTopic } from '../interface/topic'
import { Model } from '../model'

interface LinksProps {
  layoutRoot: LayoutTopic
  layout: LayoutType
}

const Links = (props: LinksProps) => {
  const { layoutRoot, layout } = props
  const linkTheme = useContext(ThemeContext).link
  const model = Model.useContainer()
  const links: JSX.Element[] = []

  layoutRoot.each((node) => {
    node.children?.forEach((child) => {
      links.push(
        linkTheme.render(node, child, {
          layout,
          justify: model.getNodeJustify(child.data.id),
        }),
      )
    })
  })
  return <g className="links">{links}</g>
}

export { Links }
