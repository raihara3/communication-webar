import React, { useState, useRef } from 'react'
import { Button, IconButton, Link } from '@material-ui/core'
import { FileCopy } from '@material-ui/icons'

const Remote = () => {
  const [roomID, setRoomID] = useState<string>('')
  const roomURL = useRef<HTMLTextAreaElement>(null)

  const createRoom = async() => {
    const res: any = await fetch('../api/createRoom')
    const json = await res.json()
    console.log(json.roomID)
    setRoomID(json.roomID)
  }

  const copyRoomID = () => {
    roomURL.current?.select()
    document.execCommand('copy')
    roomURL.current?.blur()
  }

  return (
    <>
      <h1>Create a Room</h1>
      <Button
        variant='contained'
        color='primary'
        disabled={!!roomID}
        onClick={() => createRoom()}
      >
        CREATE
      </Button>
      {roomID && (
        <>
          <Link
            href={`${window.location.href}/call?room=${roomID}`}
          >
            <textarea
              ref={roomURL}
              value={`${window.location.href}/call?room=${roomID}`}
              readOnly
            />
          </Link>
          <IconButton
            aria-label='FileCopy'
            onClick={() => copyRoomID()}
          >
            <FileCopy />
          </IconButton>
        </>
      )}
    </>
  )
}

export default Remote
