import io from 'socket.io-client'
import ThreeObject from './ThreeObject'

interface Mesh {
  geometryJson: any
  materialJson: any
  position: any
}

class SocketIO {
  socket: SocketIOClient.Socket | null
  threeObject: ThreeObject

  constructor() {
    this.socket = null
    this.threeObject = new ThreeObject()
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
    this.threeObject.createMesh(data)
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
