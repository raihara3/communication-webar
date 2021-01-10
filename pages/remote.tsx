import { useEffect, useState, useRef } from "react"
import { Button } from '@material-ui/core';
import * as THREE from 'three'
import WebXR from '../utils/WebXR'
import { socketConnect, socket } from '../utils/SocketIO'
import { scene } from '../utils/ThreeObject'

const Remote = () => {
  const [isSupported, setIsSupported] = useState(false)
  const webXR = useRef<WebXR>()

  useEffect(() => {
    setIsSupported('xr' in navigator)

    const canvas = document.getElementById('webAR') as HTMLCanvasElement
    const canvasContext = canvas.getContext('webgl')

    const renderer = new THREE.WebGLRenderer({
      canvas: canvas,
      antialias: true,
      alpha: true
    })
    renderer.setPixelRatio(window.devicePixelRatio)
    renderer.setSize(window.innerWidth, window.innerHeight)
    renderer.xr.enabled = true

    const fov = 70
    const near = 0.01
    const far = 20
    const aspect = window.innerWidth / window.innerHeight
    const camera = new THREE.PerspectiveCamera(fov, aspect, near, far)
    window.addEventListener('resize', () => {
      camera.aspect = aspect
      camera.updateProjectionMatrix()
      renderer.setSize(window.innerWidth, window.innerHeight)
    }, false)

    const controller = renderer.xr.getController(0)
    controller.addEventListener('selectend', () => {
      controller.userData.isSelecting = true
    })

    renderer.setAnimationLoop(() =>
      renderer.render(scene, camera)
    )

    webXR.current = new WebXR(renderer, scene, {requiredFeatures: ['local', 'hit-test']}, canvasContext)
  }, [])

  return (
    <>
      <div>remote</div>
      {isSupported ? (
        <Button
          variant='outlined'
          color='primary'
          onClick={async() => {
            await socketConnect()
            webXR.current?.createSession()
          }}
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
