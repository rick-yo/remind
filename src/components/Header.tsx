/** @jsx jsx */
import OpenFile from './OpenFile';
import { css, jsx } from '@emotion/core';
import Export from './Export';

const Header = () => {
  return (
    <header
      css={css`
        padding: 12px 24px;
        position: absolute;
        left: 0px;
        top: 0px;
        z-index: 1;
        & > * {
          margin-right: 10px;
        }
      `}
    >
      <OpenFile />
      <Export />
    </header>
  );
};

export default Header;
