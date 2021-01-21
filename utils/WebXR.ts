import * as THREE from 'three'
import SocketIO from '../utils/SocketIO'
import ThreeJS from './ThreeJS'

class WebXR {
  threeJS: ThreeJS
  sessionInit: any
  currentSession: THREE.XRSession | null
  session: THREE.XRSession | null
  xrRefSpace: THREE.XRReferenceSpace | null
  xrHitTestSource: THREE.XRHitTestSource | null
  socketIO: SocketIO | null

  constructor(threeJS: ThreeJS, sessionInit) {
    this.threeJS = threeJS
    this.sessionInit = sessionInit
    this.currentSession = null
    this.session = null
    this.xrRefSpace = null
    this.xrHitTestSource = null
    this.socketIO = null
  }

  static isSupported() {
    try {
      navigator['xr'].isSessionSupported('immersive-ar')
      return true
    }catch(e) {
      console.error(e)
      return false
    }
  }

  async createSession() {
    this.socketIO = await new SocketIO(this.threeJS)

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
    const context: any = this.threeJS.context
    await context.makeXRCompatible()

    if(!this.session || !this.threeJS.renderer) return
    this.session.addEventListener('end', this.onSessionEnded)
    this.threeJS.renderer.xr.setReferenceSpaceType('local')
    this.threeJS.renderer.xr.setSession(this.session)
    this.currentSession = this.session
  }

  private onSessionEnded() {
    if(!this.currentSession) return
    this.currentSession.removeEventListener('end', this.onSessionEnded)
    this.currentSession = null
  }

  private onXRFrame(_, frame: THREE.XRFrame) {
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
      }
    }

    this.session.requestAnimationFrame((_, frame) => this.onXRFrame(_, frame))
  }

  private handleController(_: THREE.XRRigidTransform) {
    if(!this.threeJS.renderer) return

    const controller = this.threeJS.renderer.xr.getController(0)
    if(!controller.userData.isSelecting) return

    const geometryInfo = {
      type: 'BoxGeometry',
      width: 0.01,
      height: 0.01,
      depth: 0.01
    }
    const materialInfo = {
      type: 'MeshBasicMaterial',
      color: 0x00ff00
    }
    const { geometry, material, mesh } = this.threeJS.buildMesh(geometryInfo, materialInfo, controller.position)

    this.threeJS.scene.add(mesh)

    this.socketIO?.sendMeshData({
      position: controller.position,
      geometryJson: geometry.toJSON(),
      materialJson: material.toJSON()
    })

    controller.userData.isSelecting = false
  }
}

export default WebXR
