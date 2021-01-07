import io from 'socket.io-client'
import { createObject } from './ThreeObject'

class SocketIO {
  socket: any

  constructor() {
    this.socket = null
  }

  async connect() {
    await fetch('api/socketio')
    this.socket = io()

    this.socket.on('connect', () => this.handleAddUser())
    this.socket.on('add user', this.addUser)
    this.socket.on('disconnect', this.disconnect)
    this.socket.on('get three mesh', this.getData)
    this.socket.on('join', this.join)
  }

  private addUser(id: string) {
    console.log(`add user: ${id}`)
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
    console.log(`my id: ${id}`)
  }

  handleAddUser() {
    this.socket.emit('add user')
  }

  handleSendData(data) {
    this.socket.emit('send three mesh', data)
  }
}

export default SocketIO
