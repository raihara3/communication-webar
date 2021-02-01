import * as THREE from 'three'

class WebGL {
  context: WebGLRenderingContext
  scene: THREE.Scene
  renderer: THREE.WebGLRenderer

  constructor(canvas) {
    this.context = canvas.getContext('webgl')
    this.scene = new THREE.Scene()

    this.renderer = new THREE.WebGLRenderer({
      canvas: canvas,
      antialias: true,
      alpha: true
    })
    this.renderer.setPixelRatio(window.devicePixelRatio)
    this.renderer.setSize(window.innerWidth, window.innerHeight)
    this.renderer.xr.enabled = true
    this.renderer.setAnimationLoop(() => {
      this.renderer.render(this.scene, camera)
    })

    const aspect = window.innerWidth / window.innerHeight
    const camera = new THREE.PerspectiveCamera(70, aspect, 0.01, 20)
    window.addEventListener('resize', () => {
      camera.aspect = aspect
      camera.updateProjectionMatrix()
      this.renderer.setSize(window.innerWidth, window.innerHeight)
    }, false)
  }
}

export default WebGL
