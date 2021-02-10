import React, { memo } from 'react'

interface Props {
  id: string
  autoPlay?: boolean
}

const Video: React.FC<Props> = ({
  id,
  autoPlay = true
}) => {
  return (
    <video id={id} autoPlay={autoPlay} />
  )
}

export default memo(Video)
