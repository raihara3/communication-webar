import { useEffect, useState, useRef } from "react"
import io from 'socket.io-client'
import { Button } from '@material-ui/core';
import * as THREE from 'three'
import WebXR from '../utils/WebXR'

const Remote = () => {
  const connectWebsocket = async() => {
    await fetch('api/socketio')
    const socket = io()

    socket.on('connect', () => {
      socket.emit('add user')
      console.log(`join`)
    })

    socket.on('disconnect', () => {
      console.log('disconnect')
    })

    socket.on('add user', data => {
      console.log(`add user: ${data}`)
    })

    socket.on('get data', data => {
      console.log('get data', data)
    })

    socket.emit('send data', ({
      hoge: 'hoge',
      fuga: 'fuga',
      num: [1,2,3]
    }))
  }

  const [ARRenderer, setARRenderer] = useState<THREE.WebGLRenderer>()
  const [ARScene, setARScene] = useState<THREE.Scene>()
  const [isSupported, setIsSupported] = useState(false)
  const canvasContext = useRef<WebGLRenderingContext | null>()

  useEffect(() => {
    connectWebsocket()

    setIsSupported('xr' in navigator)

    const scene = new THREE.Scene()
    setARScene(scene)

    const canvas = document.getElementById('webAR') as HTMLCanvasElement
    canvasContext.current = canvas.getContext('webgl')

    const renderer = new THREE.WebGLRenderer({
      canvas: canvas,
      antialias: true,
      alpha: true
    })
    renderer.setPixelRatio(window.devicePixelRatio)
    renderer.setSize(window.innerWidth, window.innerHeight)
    renderer.xr.enabled = true
    setARRenderer(renderer)

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
  }, [])

  const setSession = async() => {
    const webXR = new WebXR(ARRenderer, ARScene, {requiredFeatures: ['local', 'hit-test']}, canvasContext.current)
    const isSupported = await webXR.isSupported()
    if(!isSupported) return

    webXR.createSession()
  }

  return (
    <>
      <div>remote</div>
      {isSupported ? (
        <Button
          variant='outlined'
          color='primary'
          onClick={() => setSession()}
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
