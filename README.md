# Remind

[![Build packages](https://github.com/luvsic3/remind/actions/workflows/main.yml/badge.svg)](https://github.com/luvsic3/remind/actions/workflows/main.yml)
![Azure Static Web Apps CI/CD](https://github.com/luvsic3/remind/workflows/Azure%20Static%20Web%20Apps%20CI/CD/badge.svg)
[![Quality Gate Status](https://sonarcloud.io/api/project_badges/measure?project=unhandledrejection_mindx&metric=alert_status)](https://sonarcloud.io/dashboard?id=unhandledrejection_mindx) 

A headless, framework-agnostic and extendable mindmap editor.

<img src="./demo.jpg" alt="drawing" width="600"/>

- [Try remind](https://remind.applet.ink)
- [Play online](https://stackblitz.com/edit/typescript-nwp9sk?file=index.ts)
- [See roadmap](https://github.com/luvsic3/remind/projects/1)

## Feature

 * Highly extendable, take full control over styling and behavior
 * With default undo, redo, navigation, drag, CRUD, shortcut implementation (but can be replaced)
 * Framework-agnostic, remind can work with vanilla javascript, vue, react or any other framework
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

### Create mindmap

`instance: RefObject<ContributionAPI> = createMindmap(containerNode, options)` 

Render mindmap into containerNode, and return a instance.

### options

| option        | type                         | description                   | default | optional |
| ------------- | ---------------------------- | ----------------------------- | ------- | -------- |
| value         | TopicData                    | set mindmap value             | -       | true     |
| onChange      | (value: TopicData) => void   | listen to value change        | -       | true     |
| layout        | 'mindmap' &#124; 'structure' | set mindmap layout            | mindmap | true     |
| locale        | 'en' &#124; 'cn' &#124; 'ja' | language localization         | en      | true     |
| theme         | Theme                        | custom theme                  | -       | true     |
| contributions | Contribution[]               | extend editor's functionality | []      | true     |

Contribution let you extend editor's functionality, custom editor's behavior or add custom render content.
For more information, see `packages/contributions/src` 

### Export mindmap as svg/image

See `/packages/core/src/utils/to`, how to use it

### types

```typescript
interface ContributionAPI {
  model: IModelStructure & IModelTrait
  viewModel: IViewModelStructure & IViewModelTrait
  view: RefObject<HTMLDivElement>
  locale: IntlContent
}
```

```typescript
interface TopicData {
  id: string
  /**
   * topic text content
   */
  title: string
  children?: TopicData[]
  /**
   * control layout direction, should only set on root node's child node
   * for horizontal layout tree, `start` place node to left side of parent node, `end` place node to right.
   * `justify` is only supported in `mindmap` layout
   */
  justify?: 'start' | 'end'
}
```

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
