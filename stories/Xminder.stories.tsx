import React from 'react';
import Xminder from '../src';
import { XminderProps } from 'Xminder';

export default {
  title: 'Welcome',
};

// By passing optional props to this story, you can control the props of the component when
// you consume the story in a test.
export const Default = (props: XminderProps) => <Xminder {...props} />;
