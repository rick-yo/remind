import {
  Contribution,
  useEffect,
  h,
  useState,
  Slot,
  ViewType,
} from 'remind-core'
import { createElement } from './utils'

const href = 'https://at.alicdn.com/t/font_1924427_4b37bvd5e4o.css'
const toolbarCss = `
.toolbar {
  position: absolute;
  bottom: -50px;
  right: -50px;
  background: #fff;
  padding: 5px;
  border-radius: 5px;
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.2);
}
.toolbar i {
  margin: 0 5px;
}
`

const useToolbar: Contribution = (api) => {
  const { view } = api
  const [scale, setScale] = useState(1)
  async function requestFullScreen() {
    await view.current?.requestFullscreen()
  }

  useEffect(() => {
    const linkElement = createElement('link', {
      rel: 'stylesheet',
      href,
    })
    document.querySelector('head')?.appendChild(linkElement)
    return () => {
      linkElement.remove()
    }
  }, [])

  useEffect(() => {
    const linkElement = createElement('style')
    linkElement.textContent = toolbarCss
    document.querySelector('head')?.appendChild(linkElement)
    return () => {
      linkElement.remove()
    }
  }, [])

  useEffect(() => {
    view.current.style.transform = `scale(${scale}, ${scale})`
  }, [scale])

  const toolbar: Slot = h('div', {
    className: 'toolbar',
    children: [
      h('i', {
        className: 'iconfont icon-full-screen',
        onClick: requestFullScreen,
      }),
      h('i', {
        className: 'iconfont icon-location',
        onClick() {
          setScale(1)
        },
      }),
      h('i', {
        className: 'iconfont icon-subtract',
        onClick() {
          setScale(scale * 0.8)
        },
      }),
      h('i', {
        className: 'iconfont icon-plus',
        onClick() {
          setScale(scale * 1.2)
        },
      }),
    ],
  })
  toolbar.viewType = ViewType.mindmap

  return {
    slots: [toolbar],
  }
}

export { useToolbar }
