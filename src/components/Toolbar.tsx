import { EDITOR_ID } from '../constant'
import EditorStore from '../store/editor'
import styles from '../index.module.css'

const Toolbar = () => {
  const { scale, setScale, setTranslate } = EditorStore.useContainer()
  async function requestFullScreen() {
    await document.querySelector(`#${EDITOR_ID}`)?.requestFullscreen()
  }

  return (
    <div className={styles.toolbar}>
      <i className="iconfont icon-full-screen" onClick={requestFullScreen} />
      <i
        className="iconfont icon-location"
        onClick={() => {
          setScale(1)
          setTranslate([0, 0])
        }}
      />
      <i
        className="iconfont icon-subtract"
        onClick={() => {
          setScale(scale * 0.8)
        }}
      />
      <i
        className="iconfont icon-plus"
        onClick={() => {
          setScale(scale * 1.2)
        }}
      />
    </div>
  )
}

export default Toolbar
