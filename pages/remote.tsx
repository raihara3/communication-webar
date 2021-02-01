import { useEffect, useState } from "react"
import io from 'socket.io-client'
import { Button } from '@material-ui/core';
import WebGL from '../core/src/WebGL'
import { messageHandler, sendMesh } from '../core/src/messaging'
import { createMesh } from '../core/src/mesh'

const Remote = () => {
  const [isSupported, setIsSupported] = useState(false)

  const onStartWebAR = async() => {
    const canvas = document.getElementById('webAR') as HTMLCanvasElement
    const webGL = new WebGL(canvas)

    await fetch('api/room')
    const socket = await io()
    messageHandler(socket, webGL.scene)

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
      sendMesh(socket, {
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
        <Button
          variant='outlined'
          color='primary'
          onClick={() => onStartWebAR()}
        >
          START AR
        </Button>
      ) : (
        <a href='https://immersiveweb.dev/'>
          WebXR not available
        </a>
      )}
      <canvas id='webAR'></canvas>
    </>
  )
}

export default Remote
