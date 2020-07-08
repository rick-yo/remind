import React from 'react';
import { Mindmap } from '../src';
import { TopicData } from 'xmind-model/types/models/topic';

export default {
  title: 'Mind map',
};

// By passing optional props to this story, you can control the props of the component when
// you consume the story in a test.
export const NormalRender = () => {
  const data : TopicData = {
    id: '545be2df-3fe3-43d8-8038-7bf8fd567273',
    title: 'Central Topic',
    children: {
      attached: [
        {
          title: 'main topic 2',
          id: 'd5b93d9e-4a3b-49fe-83a0-f4cb61397246',
        },
        {
          title: 'main topic',
          id: '7312ed2e-b90f-44a8-b0bd-fa4df6c9708c',
          children: {
            attached: [
              {
                title: 'sub topic 1',
                id: 'd5b93d9e-4a3b-49fe-83a0-f4cb61397241',
              },
            ],
          },
        },
        {
          title: 'main topic 3',
          id: 'd5b93d9e-4a3b-49fe-83a0-f4cb6139024d',
          children: {
            attached: [
              {
                title: 'sub topic 2',
                id: 'd5b93d9e-4a3b-49fe-83a0-f45b61397241',
              },
            ],
          },
        },
        {
          title: 'main topic 4',
          id: 'd5b93d9e-4a3b-49fe-83a0-f4cb6139724d',
        },
      ],
    },
  }
  return <Mindmap data={data} />;
};

export const ReadOnly = () => {
  const data : TopicData = {
    id: '545be2df-3fe3-43d8-8038-7bf8fd567273',
    title: 'ReadOnly Topic',
    children: {
      attached: [
        {
          title: 'main topic 2',
          id: 'd5b93d9e-4a3b-49fe-83a0-f4cb61397246',
        },
        {
          title: 'main topic',
          id: '7312ed2e-b90f-44a8-b0bd-fa4df6c9708c',
          children: {
            attached: [
              {
                title: 'sub topic 1',
                id: 'd5b93d9e-4a3b-49fe-83a0-f4cb61397241',
              },
            ],
          },
        },
      ],
    },
  }
  return <Mindmap data={data} readonly={true} />;
};
