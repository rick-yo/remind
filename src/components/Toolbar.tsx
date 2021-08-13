import { EDITOR_ID } from '../constant'
import { memo } from 'react'
import EditorStore from '../store/editor'
import styles from '../index.module.css'

const Toolbar = () => {
  const { scale, SET_SCALE, SET_TRANSLATE } = EditorStore.useContainer()
  function requestFullScreen () {
    document.querySelector(`#${EDITOR_ID}`)?.requestFullscreen()
  }

  return (
    <div
      className={styles.toolbar}
    >
      <i className='iconfont icon-full-screen' onClick={requestFullScreen} />
      <i
        className='iconfont icon-location'
        onClick={() => {
          SET_SCALE(1)
          SET_TRANSLATE([0, 0])
        }}
      />
      <i
        className='iconfont icon-subtract'
        onClick={() => SET_SCALE(scale * 0.8)}
      />
      <i
        className='iconfont icon-plus'
        onClick={() => SET_SCALE(scale * 1.2)}
      />
    </div>
  )
}

export default memo(Toolbar)
