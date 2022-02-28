# Remind

[![Build packages](https://github.com/luvsic3/remind/actions/workflows/main.yml/badge.svg)](https://github.com/luvsic3/remind/actions/workflows/main.yml)
![Azure Static Web Apps CI/CD](https://github.com/luvsic3/remind/workflows/Azure%20Static%20Web%20Apps%20CI/CD/badge.svg)
[![Quality Gate Status](https://sonarcloud.io/api/project_badges/measure?project=unhandledrejection_mindx&metric=alert_status)](https://sonarcloud.io/dashboard?id=unhandledrejection_mindx) 

A headless, framework-agnostic and extendable mindmap editor.

![](./demo.jpg)

Try it on https://remind.applet.ink

## Feature

 * Highly extendable, take full control over styling and behaviour
 * With default undo, redo, navigation, drag, CRUD, shortcut implemention (but can be replaced)
 * Framework-agnostic, remind can work with vanilla javaScript, vue, react or any other framework
 * TypeScript, remind is written is typescript and has great typescript support

## Installation

```shell
npm i remind-core remind-contributions
```

## Quick Start

```JavaScript
import { createMindmap, TopicData } from 'remind-core'
import 'remind-core/dist/style.css'
import { contributions } from 'remind-contributions'

const customData: TopicData = {
  id: '7bf8fd567273',
  title: 'Central Topic',
  children: [
    {
      title: 'main topic 1',
      id: 'f4cb61397246',
    },
    {
      title: 'main topic 2',
      id: 'fa4df6c9708c',
      children: [
        {
          title: 'sub topic 1',
          id: 'f4cb61397241',
        },
      ],
    },
  ],
}

createMindmap(document.querySelector('#app')!, {
  value: customData,
  contributions,
})
```

## API
Mindmap options

| option   | type                         | description                    | default | optional |
| -------- | ---------------------------- | ------------------------------ | ------- | -------- |
| value    | TopicData                    | control mindmap value          | -       | true     |
| onChange | (value: TopicData) => void   | listen to mindmap value change | -       | true     |
| locale   | 'en' &#124; 'cn' &#124; 'ja' | language localization          | en      | true     |
| theme    | Theme                        | custom theme                   | -       | true     |

TopicData

```typescript
interface TopicData {
  id: string
  title: string
  children?: TopicData[]
  depth?: number
}
```

Theme

```typescript
interface Theme {
  link: {
    stroke: string
    strokeWidth: number
  }
  topic: Record<string, unknown>
  mainColor: string
}
```

## License

[MIT License](https://github.com/luvsic3/remind/blob/master/LICENSE)
