import React, { useEffect, useState } from "react"
import io from 'socket.io-client'
import { Button } from '@material-ui/core'
import WebGL from '../src/WebGL'
import { receiveMessagingHandler, sendMeshHandler } from '../src/emitter/Messaging'
import { createMesh } from '../src/Mesh'

const Remote = () => {
  const [isSupported, setIsSupported] = useState(false)
  const [isAudioPermission, setIsAudioPermission] = useState(true)

  const onStartWebAR = async() => {
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

    const canvas = document.getElementById('webAR') as HTMLCanvasElement
    const webGL = new WebGL(canvas)

    await fetch('api/room')
    const socket = await io()
    receiveMessagingHandler(socket, webGL.scene)

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
    setIsSupported('xr' in navigator)
  }, [])

  return (
    <>
      <div>remote</div>
      {isSupported ? (
        <>
          {!isAudioPermission && (
            <div>Please allow the use of the microphone</div>
          )}
          <Button
            variant='outlined'
            color='primary'
            onClick={() => onStartWebAR()}
          >
            START AR
          </Button>
        </>
      ) : (
        <a href='https://immersiveweb.dev/'>
          WebXR not available
        </a>
      )}
      <canvas id='webAR'></canvas>
      <video id='voice' autoPlay></video>
    </>
  )
}

export default Remote
