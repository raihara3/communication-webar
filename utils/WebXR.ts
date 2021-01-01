import * as THREE from 'three'
import Reticle from './Reticle'

class WebXR {
  renderer: THREE.WebGLRenderer
  scene: THREE.Scene
  sessionInit: any
  currentSession: THREE.XRSession | null
  session: THREE.XRSession | null
  xrRefSpace: THREE.XRReferenceSpace | null
  xrHitTestSource: THREE.XRHitTestSource | null
  reticle: Reticle

  constructor(renderer, scene, sessionInit) {
    this.renderer = renderer
    this.scene = scene
    this.sessionInit = sessionInit
    this.currentSession = null
    this.session = null
    this.xrRefSpace = null
    this.xrHitTestSource = null
    this.reticle = new Reticle()
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
    const canvas = document.getElementById('ar-canvas') as HTMLCanvasElement
    const gl = canvas.getContext('webgl')
    console.log(gl)
    await gl?.makeXRCompatible()

    if(!this.session) return
    this.session.addEventListener('end', this.onSessionEnded)
    this.renderer.xr.setReferenceSpaceType('local')
    this.renderer.xr.setSession(this.session)
    this.currentSession = this.session

    const reticle = this.reticle.create()
    this.scene.add(reticle)
  }

  private onSessionEnded() {
    // const renderDom = document.getElementById('renderer')
    // renderDom && renderDom.firstChild && renderDom.removeChild(renderDom.firstChild)
    if(!this.currentSession) return
    this.currentSession.removeEventListener('end', this.onSessionEnded)
    this.currentSession = null
  }

  private onXRFrame(_, frame: THREE.XRFrame) {
    if(!this.reticle.display) return

    this.session = frame.session
    let pose: THREE.XRViewerPose | undefined
    if(this.xrRefSpace) {
      pose = frame.getViewerPose(this.xrRefSpace)
    }

    if(this.xrHitTestSource && pose && this.xrRefSpace) {
      let hitTestResults = frame.getHitTestResults(this.xrHitTestSource)
      if(hitTestResults.length > 0) {
        let pose = hitTestResults[0].getPose(this.xrRefSpace)
        console.log(pose?.transform)
        pose && this.handleController(pose.transform)
        pose && this.reticle.updateMatrix(pose)
      }
    }

    this.session.requestAnimationFrame((_, frame) => this.onXRFrame(_, frame))
  }

  private handleController(_: THREE.XRRigidTransform) {
    const controller = this.renderer.xr.getController(0)
    if(!controller.userData.isSelecting) return

    // const light = new THREE.DirectionalLight(0xffffff)
    // light.castShadow = true
    // light.shadow.mapSize.width = 1024
    // light.shadow.mapSize.height = 1024

    // const gallery = new Gallery()
    // const room = gallery.createRoom()
    // room.rotateY(0.25 * Math.PI)

    // const setMeshPosition = new SetMeshPosition(transform)
    // new GLTFLoader().load('model/host.gltf', (gltf) => {
    //   const model = gltf.scene
    //   model.scale.set(0.025, 0.025, 0.025)

    //   this.scene.add(
    //     setMeshPosition.set(light, 0, {x:0, y:10, z:15}),
    //     setMeshPosition.set(room, 0.25 * Math.PI),
    //     setMeshPosition.set(model)
    //   )
    // })

    controller.userData.isSelecting = false
    this.reticle.remove(this.scene)
  }
}

export default WebXR
