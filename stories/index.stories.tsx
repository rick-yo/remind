import React from 'react';
import Xminder from '../src';

export default {
  title: 'Welcome',
};

// By passing optional props to this story, you can control the props of the component when
// you consume the story in a test.
export const normalRender = () => {
  const root = {
    title: 'Root',
    children: [
      {
        title: 'SubTreeNode1',
        children: [
          {
            title: 'SubTreeNode1.1',
          },
          {
            title: 'SubTreeNode1.2',
          },
        ],
      },
      {
        title: 'SubTreeNode2',
      },
    ],
  };

  return <Xminder root={root} />;
};
