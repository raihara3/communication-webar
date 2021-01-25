import { Server } from 'socket.io'
import redis from 'redis'
import UserRepository from '../../core/repository/user/redis'
import MeshRepository from '../../core/repository/mesh/redis'

const roomHandler = (_, res) => {
  // TODO: change to the RoomID
  const roomID = 'testRoom'

  if(res.socket.server.io) {
    console.log('socket.io already running')
  }else {
    console.log('*First use, starting socket.io')
    const client = redis.createClient()
    const userRepository = new UserRepository(client)
    const meshRepository = new MeshRepository(client)
    const io = new Server(res.socket.server)

    io.on('connect', socket => {
      socket.join(roomID)
      socket.on('addUser', async() => {
        socket.broadcast.emit('addUser', socket.id)
        socket.emit('join', socket.id)
        userRepository.add(roomID, socket.id)

        const meshList: Array<string> = await meshRepository.get(roomID)
        socket.emit('getMeshData', meshList.map(mesh => JSON.parse(mesh)))
      })

      socket.on('sendMesh', data => {
        meshRepository.add(roomID, JSON.stringify(data))
        socket.broadcast.emit('getMeshData', [data])
      })

      socket.on('disconnect', () => {
        console.log(`disconnect: ${socket.id}`)
        userRepository.remove(roomID, socket.id)
        if(!socket.adapter.rooms.has(roomID)) {
          meshRepository.delete(roomID)
        }
      })
    })
    res.socket.server.io = io
  }
  res.end()
}

export const config = {
  api: {
    bodyParser: false
  }
}

export default roomHandler
