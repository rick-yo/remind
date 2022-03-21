import { createTopic } from 'remind-core'

export const subTopic = createTopic('Sub topic', {
  children: [
    createTopic('Sub sub topic'),
    createTopic('Sub sub topic'),
    createTopic('Sub sub topic'),
    createTopic('Sub sub topic'),
    createTopic('Sub sub topic', {
      children: [
        createTopic('Sub sub topic'),
        createTopic('Sub sub topic'),
        createTopic('Sub sub topic'),
        createTopic('Sub sub topic'),
      ],
    }),
  ],
})
