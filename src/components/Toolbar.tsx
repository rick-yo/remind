/** @jsx jsx */
import { css, jsx } from '@emotion/react';
import { EDITOR_ID } from '../constant';
import { memo } from 'react';
import EditorStore from '../store/editor';

const Toolbar = () => {
  const { scale, SET_SCALE, SET_TRANSLATE } = EditorStore.useContainer();
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
        onClick={() => {
          SET_SCALE(1);
          SET_TRANSLATE([0, 0]);
        }}
      ></i>
      <i
        className="iconfont icon-subtract"
        onClick={() => SET_SCALE(scale * 0.8)}
      ></i>
      <i
        className="iconfont icon-plus"
        onClick={() => SET_SCALE(scale * 1.2)}
      ></i>
    </div>
  );
};

export default memo(Toolbar);
