import { Server } from 'socket.io'
import Redis from './redis'

// TODO: change to the RoomID
const roomID = 'testRoom'

class WebSocket {
  redis: Redis
  socket: any

  constructor(socket) {
    this.redis = new Redis()
    this.socket = socket
    this.connection()
  }

  connection() {
    this.socket.join(roomID)

    this.socket.on('addUser', () => this.addUser())
    this.socket.on('sendMesh', data => this.sendMesh(data))
    this.socket.on('disconnect', () => this.disconnect())
  }

  private async addUser() {
    this.socket.broadcast.emit('addUser', this.socket.id)
    this.socket.emit('join', this.socket.id)

    const meshs: Array<string> = await this.redis.getMeshs(roomID)
    this.socket.emit('getMeshData', meshs.map(mesh => JSON.parse(mesh)))

    this.redis.addUser(roomID, this.socket.id)
  }

  private sendMesh(data) {
    this.redis.addMesh(roomID, JSON.stringify(data))
    this.socket.broadcast.emit('getMeshData', [data])
  }

  private disconnect() {
    console.log(`disconnect: ${this.socket.id}`)
    this.redis.removeUser(roomID, this.socket.id)
    if(!this.socket.adapter.rooms.has(roomID)) {
      this.redis.removeAllMesh(roomID)
    }
  }
}

const webSocketHandler = (_, res) => {
  if(!res.socket.server.io) {
    console.log('*First use, starting socket.io')
    const io = new Server(res.socket.server)
    io.on('connect', socket => {
      new WebSocket(socket)
    })
    res.socket.server.io = io
  }else {
    console.log('socket.io already running')
  }
  res.end()
}

export const config = {
  api: {
    bodyParser: false
  }
}

export default webSocketHandler
