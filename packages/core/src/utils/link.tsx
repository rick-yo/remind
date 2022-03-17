import { Color } from '../constant'
import type { LinkRender } from '../interface/theme'

interface Point {
  x: number
  y: number
}

const pathCommand = {
  m: (p: Point) => `M ${p.x} ${p.y}`,
  l: (p: Point) => `L ${p.x} ${p.y}`,
  q: (cp: Point, ep: Point) => `Q ${cp.x} ${cp.y} ${ep.x} ${ep.y}`,
  join: (...commands: string[]) => commands.join(' '),
}

const horizontalLinkRender: LinkRender = (parent, child, options) => {
  const parentOffset = 20
  const controlPointOffset = 60
  const { justify } = options
  const [parentWidth, parentHeight] = parent.size
  const [childWidth, childHeight] = child.size
  const parentRight = parent.x + parentWidth
  const parentCenterY = parent.y + parentHeight / 2
  const childRight = child.x + childWidth
  const childCenterY = child.y + childHeight / 2

  const startPoint = {
    x:
      justify === 'start'
        ? parent.x + parentOffset
        : parentRight - parentOffset,
    y: parentCenterY,
  }
  const endPoint = {
    x: justify === 'start' ? childRight : child.x,
    y: childCenterY,
  }
  const controlPoint = {
    x:
      justify === 'start'
        ? endPoint.x + controlPointOffset
        : endPoint.x - controlPointOffset,
    y: endPoint.y,
  }
  return renderPath(
    pathCommand.join(
      pathCommand.m(startPoint),
      pathCommand.q(controlPoint, endPoint),
    ),
  )
}

const verticalLinkRender: LinkRender = (parent, child) => {
  const parentOffset = 20
  const controlPointOffset = 70
  const [parentWidth, parentHeight] = parent.size
  const [childWidth] = child.size
  const parentBottom = parent.y + parentHeight
  const parentCenterX = parent.x + parentWidth / 2
  const childCenterX = child.x + childWidth / 2
  const startPoint = {
    x: parentCenterX,
    y: parentBottom + parentOffset,
  }
  const endPoint = {
    x: childCenterX,
    y: child.y,
  }
  const controlPoint = {
    x: endPoint.x,
    y: endPoint.y - controlPointOffset,
  }

  if (parent.children.length === 1) {
    return renderPath(
      pathCommand.join(
        pathCommand.m({
          x: startPoint.x,
          y: parentBottom,
        }),
        pathCommand.l(endPoint),
      ),
    )
  }

  return (
    <g>
      {renderPath(
        pathCommand.join(
          pathCommand.m({
            x: startPoint.x,
            y: parent.y,
          }),
          pathCommand.l(startPoint),
        ),
      )}
      {renderPath(
        pathCommand.join(
          pathCommand.m(startPoint),
          pathCommand.q(controlPoint, endPoint),
        ),
      )}
    </g>
  )
}

export { horizontalLinkRender, verticalLinkRender }

function renderPath(d: string) {
  return <path key={d} d={d} fill="none" stroke={Color.white} strokeWidth={3} />
}
