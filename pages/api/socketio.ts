import { Server } from 'socket.io'
import redis from 'redis'
import UserRepository from '../../core/repository/user/redis'
import MeshRepository from '../../core/repository/mesh/redis'

// TODO: change to the RoomID
const roomID = 'testRoom'

class RoomHandler {
  socket: any
  userRepository: UserRepository
  meshRepository: MeshRepository

  constructor(socket, userRepository, meshRepository) {
    this.socket = socket
    this.userRepository = userRepository
    this.meshRepository = meshRepository

    this.socket.join(roomID)
    this.socket.on('addUser', () => this.addUser())
    this.socket.on('sendMesh', data => this.sendMesh(data))
    this.socket.on('disconnect', () => this.disconnect())
  }

  private async addUser() {
    this.socket.broadcast.emit('addUser', this.socket.id)
    this.socket.emit('join', this.socket.id)

    const meshList: Array<string> = await this.meshRepository.get(roomID)
    this.socket.emit('getMeshData', meshList.map(mesh => JSON.parse(mesh)))

    this.userRepository.add(roomID, this.socket.id)
  }

  // TODO: create getMeshData function

  private sendMesh(data) {
    this.meshRepository.add(roomID, JSON.stringify(data))
    this.socket.broadcast.emit('getMeshData', [data])
  }

  private disconnect() {
    console.log(`disconnect: ${this.socket.id}`)
    this.userRepository.remove(roomID, this.socket.id)
    if(!this.socket.adapter.rooms.has(roomID)) {
      this.meshRepository.delete(roomID)
    }
  }
}

const roomHandler = (_, res) => {
  if(!res.socket.server.io) {
    console.log('*First use, starting socket.io')
    const io = new Server(res.socket.server)
    const client = redis.createClient()
    io.on('connect', socket => {
      new RoomHandler(
        socket,
        new UserRepository(client),
        new MeshRepository(client)
      )
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

export default roomHandler
