/** @jsx jsx */
import { FC } from 'react';
import OpenFile from './OpenFile';
import { css, jsx } from '@emotion/core';

interface HeaderProps {}

const Header: FC<HeaderProps> = () => {
  return (
    <header
      css={css`
        padding: 12px 24px;
      `}
    >
      <OpenFile />
    </header>
  );
};

export default Header;
