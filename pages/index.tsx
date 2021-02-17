import React, { useState, useRef } from 'react'
import { Button } from '@material-ui/core'
import { FileCopy } from '@material-ui/icons'
import styled from 'styled-components'
import Header from '../components/layout/Header'
import Footer from '../components/layout/Footer'
import Card from '../components/molecules/Card'
import InputField from '../components/atoms/InputField'

const Index = () => {
  const [roomID, setRoomID] = useState<string>('')
  const [roomURL, setRoomURL] = useState<string>('https://')
  const roomURLBox = useRef<HTMLInputElement>(null)

  const createRoom = async() => {
    const res: any = await fetch('../api/createRoom')
    const json = await res.json()
    console.log(json.roomID)
    setRoomID(json.roomID)
    setRoomURL(`${window.location.href}remote/call?room=${json.roomID}`)
  }

  const copyRoomID = () => {
    roomURLBox.current?.focus()
    roomURLBox.current?.select()
    document.execCommand('copy')
  }

  return (
    <>
      <Header />
      <Wrap>
        <span>
          This is a service that allows multiple people to play with WebAR while talking on the phone.
        </span>
        <Card
          title='Step1. Create a Room'
          description='No account is required, just create a Room. It will expire in 3 days.'
        >
          <Button
            variant='outlined'
            color='primary'
            disabled={!!roomID}
            onClick={() => createRoom()}
          >
            CREATE ROOM
          </Button>
        </Card>
        <Card
          title='Step2. Share'
          description='Copy the room URL and share it with your friends!'
        >
          <InputField
            inputRef={roomURLBox}
            defaultValue={roomURL}
            readonly={true}
          />
          <Button
            variant='outlined'
            color='primary'
            startIcon={<FileCopy />}
            disabled={!roomID}
            onClick={() => copyRoomID()}
          >
            COPY URL
          </Button>
        </Card>
        <Card
          title="Step3. Let's play!"
          description="Let's access and play with the issued Room."
        >
          <Button
            variant='outlined'
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

const Wrap = styled.div`
  width: 90%;
  margin: auto;
`

export default Index
