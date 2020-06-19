import React from 'react';
import { Sind } from '../src';

export default {
  title: 'Welcome',
};

// By passing optional props to this story, you can control the props of the component when
// you consume the story in a test.
export const WithNormalRender = () => {
  return (
    <div style={{
      background: '#f6f6f6'
    }}>
      <Sind />
    </div>
  );
};
