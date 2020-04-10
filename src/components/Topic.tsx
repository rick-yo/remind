import React, { FC } from 'react'
import { useStoreSelector, useStoreDispatch } from '../store'
import { setTheme } from '../store/editor/action'

interface TopicProps {
  title: string
  x: number | string
  y: number | string
}

const Topic: FC<TopicProps> = (props: TopicProps) => {
  const theme = useStoreSelector(state => state.editor.theme)
  const { title, x, y } = props
  return (
    <text x={x} y={y} fill="black">
      {title}
    </text>
  )
}

export default Topic
