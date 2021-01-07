import io from 'socket.io-client'
import { scene, createObject } from './ThreeObject'

let socket:any = null

class SocketIO {
  socket: any

  constructor() {
    this.socket = null
  }

  async connect() {
    await fetch('api/socketio')
    socket = io()

    socket.on('connect', () => this.handleAddUser())
    socket.on('add user', this.joinUser)
    socket.on('disconnect', this.disconnect)
    socket.on('get three mesh', this.getData)
    socket.on('join', this.join)
    socket.on('copy scene', this.copyScene)
    socket.on('get scene', this.getScene)
  }

  private joinUser(id: string) {
    console.log(`joinUserId: ${id}`)
  }

  private disconnect() {
    console.log('disconnect')
  }

  private getData(data) {
    console.log('get three mesh', data)
    createObject(data)
    console.log('ok')
  }

  private join(id: string) {
    console.log(`myId: ${id}`)
  }

  private copyScene(targetId: string) {
    console.log('owner')
    socket.emit('send scene', {
      targetId: targetId,
      sceneJson: scene.toJSON()
    })
  }

  private getScene(sceneJson) {
    console.log('scene', sceneJson)
  }

  handleAddUser() {
    socket.emit('add user')
  }

  handleSendData(data) {
    socket.emit('send three mesh', data)
  }
}

export default SocketIO
