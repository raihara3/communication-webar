import React from 'react'
import { Button, IconButton } from '@material-ui/core'
import { FileCopy } from '@material-ui/icons'

const Remote = () => {
  return (
    <>
      <h1>Create a Room</h1>
      <Button
        variant="contained"
        color="primary"
      >
        CREATE
      </Button>
      <div>url</div>
      <IconButton aria-label="FileCopy">
        <FileCopy />
      </IconButton>
    </>
  )
}

export default Remote
