import { createMindmap, createTopic, TopicData } from 'remind-core'
import 'remind-core/dist/style.css'
import { contributions } from 'remind-contributions'

const customData: TopicData = {
  ...createTopic('How to use Remind 🤔'),
  children: [
    {
      ...createTopic('Basic shortcut 🍩'),
      children: [
        createTopic('tab - Create a child topic'),
        createTopic('del - Remove a topic'),
        createTopic('space or double click - Edit a topic'),
        createTopic('Enter - Save edited topic'),
      ],
    },
    {
      ...createTopic('Advanced shortcut 🏂'),
      children: [
        createTopic('command+z - Undo'),
        createTopic('command+shift+z - Redo'),
        createTopic('up, down, left, right - navigate between topics'),
      ],
    },
    {
      ...createTopic('Bottom menu 🥙'),
      children: [
        createTopic('Full screen'),
        createTopic('Return to Center'),
        createTopic('Zoom in'),
        createTopic('Zoom out'),
      ],
    },
    {
      ...createTopic('Draggable 🏑'),
      children: [createTopic('Drag a node to target one and append to it')],
    },
  ],
}

createMindmap(document.querySelector('#app')!, {
  value: customData,
  contributions,
  // layout: 'structure',
})
