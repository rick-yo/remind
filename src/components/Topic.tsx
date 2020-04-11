import React, { FC } from 'react'

interface TopicProps {
  title: string
  x: number | string
  y: number | string
}

const Topic: FC<TopicProps> = (props: TopicProps) => {
  const { title, x, y } = props
  return (
    <text x={x} y={y} fill="black">
      {title}
    </text>
  )
}

export default Topic
