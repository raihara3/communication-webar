import io from 'socket.io-client'
import { createObject } from './ThreeObject'

interface Mesh {
  geometryJson: any
  materialJson: any
  position: any
}

class SocketIO {
  socket: SocketIOClient.Socket | null

  constructor() {
    this.socket = null
    this.connectSocket()
  }

  private async connectSocket() {
    await fetch('api/socketio')
    this.socket = io()

    this.socket.on('connect', this.connect)
    this.socket.on('addUser', this.addUser)
    this.socket.on('disconnect', this.disconnect)
    this.socket.on('getMeshData', this.getMeshData)
    this.socket.on('join', this.join)
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
    createObject(data)
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
