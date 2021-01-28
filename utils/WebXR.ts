import io from 'socket.io-client'
import * as THREE from 'three'
import { messageHandler, sendMesh } from '../core/service/messaging'
import WebGL from '../core/service/WebGL'
import { createMesh } from '../core/service/mesh'

class WebXR {
  webGL: WebGL
  sessionInit: any
  currentSession: THREE.XRSession | null
  session: THREE.XRSession | null
  xrRefSpace: THREE.XRReferenceSpace | null
  xrHitTestSource: THREE.XRHitTestSource | null
  socket: SocketIOClient.Socket | null

  constructor(webGL: WebGL, sessionInit) {
    this.webGL = webGL
    this.sessionInit = sessionInit
    this.currentSession = null
    this.session = null
    this.xrRefSpace = null
    this.xrHitTestSource = null
    this.socket = null
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
    await fetch('api/room')
    this.socket = await io()
    messageHandler(this.socket, this.webGL.scene)

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
    const context: any = this.webGL.context
    await context.makeXRCompatible()

    if(!this.session || !this.webGL.renderer) return
    this.session.addEventListener('end', this.onSessionEnded)
    this.webGL.renderer.xr.setReferenceSpaceType('local')
    this.webGL.renderer.xr.setSession(this.session)
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
    if(!this.webGL.renderer) return

    const controller = this.webGL.renderer.xr.getController(0)
    if(!controller.userData.isSelecting || !this.socket) return

    const mesh = createMesh(controller.position)
    this.webGL.scene.add(mesh)

    sendMesh(
      this.socket,
      {
        json: mesh.toJSON(),
        position: controller.position
      },
    )

    controller.userData.isSelecting = false
  }
}

export default WebXR
