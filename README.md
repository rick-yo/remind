# Mindx

![CI](https://github.com/unhandledrejection/mindx/workflows/CI/badge.svg) 
![Azure Static Web Apps CI/CD](https://github.com/unhandledrejection/mindx/workflows/Azure%20Static%20Web%20Apps%20CI/CD/badge.svg) 
[![Quality Gate Status](https://sonarcloud.io/api/project_badges/measure?project=unhandledrejection_mindx&metric=alert_status)](https://sonarcloud.io/dashboard?id=unhandledrejection_mindx) 

Mindx is a free, open source mindmap editor based on React.

![](./demo.jpg)

Try it on https://mindx.applet.ink

## Installation

```shell
npm i mindx
```

## Quick Start

```JavaScript
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Mindmap } from 'mindx';

const App = () => {
  function onChange(root) {
    console.log(root)
  }
  return (
    <div>
      <Mindmap onChange={onChange} />
    </div>
  );
};

ReactDOM.render(<App />, document.getElementById('root'));
```

## API
Mindmap props

| prop     | type                         | description                   | default | optional |
| -------- | ---------------------------- | ----------------------------- | ------- | -------- |
| data     | TopicData                    | control mindmap data          | -       | true     |
| readonly | boolean                      | is mindmap readonly           | false   | true     |
| onChange | (data: TopicData) => void    | listen to mindmap data change | -       | true     |
| locale   | 'en' &#124; 'cn' &#124; 'ja' | language localization         | en      | true     |
| theme    |                              | custom theme                  | -       | true     |

TopicData

```typescript
interface TopicData {
  id: string;
  title: string;
  children?: {
      attached: Array<TopicData>;
  };
}
```

## License

[MIT License](https://github.com/unhandledrejection/mindx/blob/master/LICENSE)
