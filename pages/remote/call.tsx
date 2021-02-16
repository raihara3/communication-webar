import React, { useEffect, useState } from "react"
import io from 'socket.io-client'
import styled from 'styled-components'
import { Button, Link, Input, makeStyles } from '@material-ui/core'
import { Alert } from '@material-ui/lab'
import Video from '../../components/atoms/Video'
import WebGL from '../../src/WebGL'
import { receiveMessagingHandler, sendMeshHandler } from '../../src/emitter/Messaging'
import { createMesh } from '../../src/Mesh'
import Header from '../../components/layout/Header'
import Footer from '../../components/layout/Footer'
import Card from '../../components/molecules/Card'

const useStyles = makeStyles(() => ({
  input: {
    '& > *': {
      color: '#ffffff',
    },
  },
}))

const Call = () => {
  const [isSupported, setIsSupported] = useState(false)
  const [isAudioPermission, setIsAudioPermission] = useState(true)
  const [memberList, setMemberList] = useState<string[]>([])
  const [hasRoomID, setHasRoomID] = useState<boolean>(true)
  const [hasError, setHasError] = useState<boolean>(false)

  const classes = useStyles()

  useEffect(() => {
    setHasError(!isSupported || !isAudioPermission || !hasRoomID)
  }, [isSupported, isAudioPermission, hasRoomID])

  const onStartWebAR = async() => {
    const res = await fetch('../api/call')
    if(!res.ok) {
      const json = await res.json()
      console.error(new Error(json.message))
      setHasRoomID(false)
      return
    }

    try {
      await window.navigator.mediaDevices.getUserMedia({
        audio: true,
        echoCancellationType: 'system'
      })
    } catch (error) {
      console.error(error)
      setIsAudioPermission(false)
      return
    }
    // const audioTracks = stream.getAudioTracks()
    // if(!audioTracks[0].enabled) return

    const socket = await io()
    const canvas = document.getElementById('webAR') as HTMLCanvasElement
    const webGL = new WebGL(canvas)
    receiveMessagingHandler(socket, webGL.scene, (list) => setMemberList(list))

    const session = await navigator['xr'].requestSession('immersive-ar', {
      requiredFeatures: ['local', 'hit-test']
    })
    await webGL.context.makeXRCompatible()
    webGL.renderer.xr.setReferenceSpaceType('local')
    webGL.renderer.xr.setSession(session)

    const controller = webGL.renderer.xr.getController(0)
    controller.addEventListener('selectend', () => {
      const mesh = createMesh(controller.position)
      webGL.scene.add(mesh)
      sendMeshHandler(socket, {
        json: mesh.toJSON(),
        position: controller.position
      })
    })
  }

  useEffect(() => {
    (async() => {
      const res = await fetch('../api/getRoom')
      if(!res.ok) {
        const json = await res.json()
        console.error(new Error(json.message))
        setHasRoomID(false)
      }
    })()

    setIsSupported('xr' in navigator)

    // const params: any = getUrlParams(window.location.href)
    // if(params.room) {
    //   setHasRoomID(true)
    // }
  }, [])

  return (
    <>
      <Header />
      <Wrap>
        {!hasRoomID && (
          <ErrorBox>
            <Alert severity="error">
              The URL is incorrect.<br />
              Do you want to create a new room?<br />
              <Link href='/'>
                Create a Room
              </Link>
            </Alert>
          </ErrorBox>
        )}
        {!isAudioPermission && (
          <ErrorBox>
            <Alert severity="error">
              Please allow the use of the microphone.
            </Alert>
          </ErrorBox>
        )}
        <span>Allow the use of the microphone and camera.</span>
        <Card
          title='Set your nickname.'
        >
          <InputBox>
            <Input
              className={classes.input}
              placeholder='Nickname'
            />
          </InputBox>
          {isSupported ? (
            <Button
              variant='contained'
              color='primary'
              onClick={() => onStartWebAR()}
              disabled={hasError}
            >
              START AR
            </Button>
          ) : (
            <a href='https://immersiveweb.dev/'>
              WebXR not available
            </a>
          )}
        </Card>
        {memberList.map(id => (
          <Video id={id} key={id} />
        ))}
        <canvas id='webAR'></canvas>
      </Wrap>
      <Footer />
    </>
  )
}

const Wrap = styled.div`
  width: 90%;
  margin: auto;
`

const ErrorBox = styled.div`
  margin: 0 0 10px;
`

const InputBox = styled.div`
  margin: 0 0 10px;
`

export default Call
