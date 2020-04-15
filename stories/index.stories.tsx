import React from 'react';
import Xminder from '../src';

export default {
  title: 'Welcome',
};

// By passing optional props to this story, you can control the props of the component when
// you consume the story in a test.
export const WithNormalRender = () => {
  const root = {
    id: '545be2df-3fe3-43d8-8038-7bf8fd567273',
    title: 'Central Topic',
    style: { id: '1e083a71-9f42-44dd-838e-3b13c5799ef3', properties: {} },
    children: {
      attached: [
        {
          title: 'main topic 2',
          id: 'd5b93d9e-4a3b-49fe-83a0-f4cb61397246',
          style: { id: '052e665a-23dd-41fe-b034-7382705ef863', properties: {} },
        },
        {
          title: 'main topic 1',
          id: '7312ed2e-b90f-44a8-b0bd-fa4df6c9708c',
          style: { id: '17b8ae83-9b85-4cfc-9787-595b6a4bae90', properties: {} },
          children: {
            attached: [
              {
                title: 'main topic sub topic 1',
                id: 'd5b93d9e-4a3b-49fe-83a0-f4cb61397246',
                style: { id: '052e665a-23dd-41fe-b034-7382705ef863', properties: {} },
              },
            ]
          }
        },
      ],
    },
  };
  // @ts-ignore
  return <Xminder root={root} />;
};
