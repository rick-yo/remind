import React, { FC } from 'react';
import Xminder, { XminderProps } from './Xminder';

const XmindWithStore: FC<XminderProps> = (props: XminderProps) => {
  return <Xminder {...props} />;
};

export default XmindWithStore;
