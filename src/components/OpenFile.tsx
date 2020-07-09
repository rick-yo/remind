/** @jsx jsx */
import { FC, useRef, Fragment } from 'react';
import { css, jsx } from '@emotion/core';
// import { useLocale } from '../context/locale';
// import JSZip from 'jszip';
// FIXME support import xmind file
// import { loadFromXMind } from 'xmind-viewer/src';

const OpenFile: FC = () => {
  // const locale = useLocale();
  const fileRef = useRef<HTMLInputElement>(null);
  function handleOpen() {
    fileRef.current?.click();
  }
  // function handleFile() {
  //   const inputEle = fileRef.current;
  //   if (!inputEle) return;
  //   if (!inputEle.files) {
  //     return;
  //   }

  //   const file = inputEle.files[0];
  //   const fileName = inputEle.value;
  //   const reader = new FileReader();
  //   reader.onload = e => {
  //     const jszip = new JSZip();
  //     const result = e.target?.result;
  //     if (!result) return Promise.reject();
  //     return Promise.all([
  //       Promise.resolve(fileName),
  //       jszip.loadAsync(result).then(zip => {
  //         loadFromXMind(zip).then(result => {
  //           console.log(result);
  //         });
  //       }),
  //     ]);
  //   };

  //   reader.readAsArrayBuffer(file);
  // }
  return (
    <Fragment>
      <input
        ref={fileRef}
        type="file"
        style={{
          display: 'none',
        }}
        // onInput={handleFile}
      />
      <i
        className="iconfont icon-open"
        css={css`
          font-size: 24px;
        `}
        onClick={handleOpen}
      ></i>
    </Fragment>
  );
};

export default OpenFile;
