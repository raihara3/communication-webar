import React, { useState, useRef } from 'react'
import { Button, IconButton, Link } from '@material-ui/core'
import { FileCopy } from '@material-ui/icons'
import styled from 'styled-components'
import Header from '../components/layout/Header'

const Index = () => {
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
      <Header />
      <Wrap>
        <div>
          This is a service that allows multiple people to play with WebAR while talking on the phone.
        </div>
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
              href={`${window.location.href}remote/call?room=${roomID}`}
            >
              <Textarea
                ref={roomURL}
                value={`${window.location.href}remote/call?room=${roomID}`}
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
      </Wrap>
    </>
  )
}

const Textarea = styled.textarea`
  -webkit-appearance: none;
  -moz-appearance: none;
  appearance: none;
  resize: none;
  width: 100%;
  height: 1.5rem;
  padding: 0;
  border: 0;
  outline: none;
  background: transparent;
  color: inherit;
`

const Wrap = styled.div`
  width: 90%;
  margin: auto;
`

export default Index
