/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import { htmlToCanvas } from '../utils/dom';
import { CORE_EDITOR_ID_SELECTOR } from '../constant';

const Export = () => {
  async function exportImage() {
    const editorEl = document.querySelector<HTMLElement>(
      `#${CORE_EDITOR_ID_SELECTOR}`
    );
    if (!editorEl) return;
    const dataUrl = await htmlToCanvas(editorEl);
    if (!dataUrl) return;
    const link = document.createElement('a');
    link.href = dataUrl;
    link.download = 'mindx.png';
    link.click();
    link.remove();
  }
  return (
    <i
      className="iconfont icon-export"
      css={css`
        font-size: 22px;
      `}
      onClick={exportImage}
    ></i>
  );
};

export default Export;
