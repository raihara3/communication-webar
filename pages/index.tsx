import React, { useState, useRef } from 'react'
import { Button } from '@material-ui/core'
import { FileCopy } from '@material-ui/icons'
import styled from 'styled-components'
import colors from '../components/colors'
import Header from '../components/layout/Header'
import Footer from '../components/layout/Footer'

const Index = () => {
  const [roomID, setRoomID] = useState<string>('')
  const [roomURL, setRoomURL] = useState<string>('https://')
  const roomURLBox = useRef<HTMLTextAreaElement>(null)

  const createRoom = async() => {
    const res: any = await fetch('../api/createRoom')
    const json = await res.json()
    console.log(json.roomID)
    setRoomID(json.roomID)
    setRoomURL(`${window.location.href}remote/call?room=${json.roomID}`)
  }

  const copyRoomID = () => {
    roomURLBox.current?.select()
    document.execCommand('copy')
    roomURLBox.current?.blur()
  }

  return (
    <>
      <Header />
      <Wrap>
        <span>
          This is a service that allows multiple people to play with WebAR while talking on the phone.
        </span>
        <Card>
          <CardTitle>Step1. Create a Room</CardTitle>
          <CardContents>
            No account is required, just create a Room.<br />
            It will expire in 3 days.
          </CardContents>
          <Button
            variant='contained'
            color='primary'
            disabled={!!roomID}
            onClick={() => createRoom()}
          >
            CREATE ROOM
          </Button>
        </Card>
        <Card>
          <CardTitle>Step2. Share</CardTitle>
          <CardContents>
            Copy the room URL and share it with your friends!
          </CardContents>
          <Textarea
            ref={roomURLBox}
            value={roomURL}
            readOnly
          />
          <Button
            variant='contained'
            color='primary'
            startIcon={<FileCopy />}
            disabled={!roomID}
            onClick={() => copyRoomID()}
          >
            COPY URL
          </Button>
        </Card>
        <Card>
          <CardTitle>Step3. Let's play!</CardTitle>
          <CardContents>
            Let's access and play with the issued Room.
          </CardContents>
          <Button
            variant='contained'
            color='primary'
            href={roomURL}
            disabled={!roomID}
          >
            Go to Room
          </Button>
        </Card>
      </Wrap>
      <Footer />
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
  color: rgba(255,255,255,0.3);
  font-size: 10px;
`

const Wrap = styled.div`
  width: 90%;
  margin: auto;
`

const Card = styled.div`
  margin: 10px 0 0;
  padding: 10px 15px;
  background-color: ${colors.gray};
  border: 1px solid rgba(255,255,255,0.12);
  border-radius: 4px;
`

const CardTitle = styled.h2`
  font-size: 20px;
  font-weight: normal;
`

const CardContents = styled.div`
  margin: 10px 0;
`

export default Index
