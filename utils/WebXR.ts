import * as THREE from 'three'
// import Reticle from './Reticle'

class WebXR {
  renderer: THREE.WebGLRenderer
  scene: THREE.Scene
  sessionInit: any
  currentSession: THREE.XRSession | null
  session: THREE.XRSession | null
  xrRefSpace: THREE.XRReferenceSpace | null
  xrHitTestSource: THREE.XRHitTestSource | null
  // reticle: Reticle
  canvasContext: WebGLRenderingContext

  constructor(renderer, scene, sessionInit, canvasContext) {
    this.renderer = renderer
    this.scene = scene
    this.sessionInit = sessionInit
    this.currentSession = null
    this.session = null
    this.xrRefSpace = null
    this.xrHitTestSource = null
    // this.reticle = new Reticle()
    this.canvasContext = canvasContext
  }

  isSupported() {
    try {
      navigator['xr'].isSessionSupported('immersive-ar')
      return true
    }catch(e) {
      console.error(e)
      return false
    }
  }

  async createSession() {
    if(this.currentSession) {
      this.currentSession.end()
      return
    }

    this.session = await navigator['xr'].requestSession('immersive-ar', this.sessionInit)
    this.onSessionStarted()

    if(!this.session) return
    const refSpace = await this.session.requestReferenceSpace('viewer')
    this.xrHitTestSource = await this.session.requestHitTestSource({space: refSpace})
    this.xrRefSpace = await this.session.requestReferenceSpace('local')
    this.session.requestAnimationFrame((_, frame) => this.onXRFrame(_, frame))
  }

  private async onSessionStarted() {
    await this.canvasContext.makeXRCompatible()

    if(!this.session) return
    this.session.addEventListener('end', this.onSessionEnded)
    this.renderer.xr.setReferenceSpaceType('local')
    this.renderer.xr.setSession(this.session)
    this.currentSession = this.session

    // const reticle = this.reticle.create()
    // this.scene.add(reticle)
  }

  private onSessionEnded() {
    if(!this.currentSession) return
    this.currentSession.removeEventListener('end', this.onSessionEnded)
    this.currentSession = null
  }

  private onXRFrame(_, frame: THREE.XRFrame) {
    // if(!this.reticle.display) return

    this.session = frame.session
    let pose: THREE.XRViewerPose | undefined
    if(this.xrRefSpace) {
      pose = frame.getViewerPose(this.xrRefSpace)
    }

    if(this.xrHitTestSource && pose && this.xrRefSpace) {
      let hitTestResults = frame.getHitTestResults(this.xrHitTestSource)
      if(hitTestResults.length > 0) {
        let pose = hitTestResults[0].getPose(this.xrRefSpace)
        pose && this.handleController(pose.transform)
        // pose && this.reticle.updateMatrix(pose)
      }
    }

    this.session.requestAnimationFrame((_, frame) => this.onXRFrame(_, frame))
  }

  private handleController(_: THREE.XRRigidTransform) {
    const controller = this.renderer.xr.getController(0)
    if(!controller.userData.isSelecting) return

    const geometry = new THREE.BoxGeometry(0.01, 0.01, 0.01)
    const material = new THREE.MeshBasicMaterial({color: 0x00ff00})
    const cube = new THREE.Mesh(geometry, material)
    cube.position.set(
      controller.position.x,
      controller.position.y,
      controller.position.z
    )
    this.scene.add(cube)

    controller.userData.isSelecting = false
    // this.reticle.remove(this.scene)
  }
}

export default WebXR
