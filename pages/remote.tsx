import { useEffect, useState } from "react"
import io from 'socket.io-client'
import * as THREE from 'three'

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

  useEffect(() => {
    connectWebsocket()

    const scene = new THREE.Scene()
    setARScene(scene)

    const renderer = new THREE.WebGLRenderer({
      canvas: document.getElementById('webAR') as HTMLCanvasElement,
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

  return (
    <>
      <div>remote</div>
      <canvas id='webAR'></canvas>
    </>
  )
}

export default Remote
