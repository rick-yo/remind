/** @jsx jsx */
import { FC } from 'react';
import OpenFile from './OpenFile';
import { css, jsx } from '@emotion/core';
import Export from './Export';

interface HeaderProps {}

const Header: FC<HeaderProps> = () => {
  return (
    <header
      css={css`
        padding: 12px 24px;
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
