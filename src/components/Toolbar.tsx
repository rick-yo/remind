/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import { EDITOR_ID } from '../constant';
import editorStore from '../store/editor';

const Toolbar = () => {
  const scale = editorStore.useSelector(s => s.scale);
  function requestFullScreen() {
    document.querySelector(`#${EDITOR_ID}`)?.requestFullscreen();
  }

  return (
    <div
      css={css`
        position: absolute;
        bottom: 10px;
        right: 15px;
        background: #fff;
        padding: 5px;
        border-radius: 5px;
        box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.2);
        i {
          margin: 0 5px;
        }
      `}
    >
      <i className="iconfont icon-full-screen" onClick={requestFullScreen}></i>
      <i
        className="iconfont icon-location"
        onClick={() => editorStore.dispatch('SET_SCALE', 1)}
      ></i>
      <i
        className="iconfont icon-plus"
        onClick={() => editorStore.dispatch('SET_SCALE', scale * 1.2)}
      ></i>
      <i
        className="iconfont icon-subtract"
        onClick={() => editorStore.dispatch('SET_SCALE', scale * 0.8)}
      ></i>
    </div>
  );
};

export default Toolbar;
