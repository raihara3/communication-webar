import io from 'socket.io-client'
import ThreeJS from './ThreeJS'

interface Mesh {
  geometryJson: any
  materialJson: any
  position: any
}

class SocketIO {
  threeJS: ThreeJS
  socket: SocketIOClient.Socket | null

  constructor(threeJS: ThreeJS) {
    this.threeJS = threeJS
    this.socket = null
    this.connectSocket()
  }

  private async connectSocket() {
    await fetch('api/socketio')
    this.socket = await io()

    this.socket.on('connect', () => this.connect())
    this.socket.on('addUser', (id: string) => this.addUser(id))
    this.socket.on('disconnect', () => this.disconnect())
    this.socket.on('getMeshData', (data: Array<Mesh>) => this.getMeshData(data))
    this.socket.on('join', (id: string) => this.join(id))
  }

  private connect() {
    if(!this.socket) return
    this.socket.emit('addUser')
  }

  private addUser(id: string) {
    console.log(`join: ${id}`)
  }

  private disconnect() {
    console.log('disconnect')
  }

  private getMeshData(data: Array<Mesh>) {
    this.threeJS.createMesh(data)
  }

  private join(id: string) {
    console.log(`my id: ${id}`)
  }

  sendMeshData(data: Mesh) {
    if(!this.socket) return
    this.socket.emit('sendMesh', data)
  }
}

export default SocketIO
