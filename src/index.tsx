import React, { FC } from 'react';
import Sind, { SindProps } from './sind';

const SindWithStore: FC<SindProps> = (props: SindProps) => {
  return <Sind {...props} />;
};

export default SindWithStore;
