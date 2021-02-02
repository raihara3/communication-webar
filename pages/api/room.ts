import { Server } from 'socket.io'
import redis from 'redis'
import UserRepository from '../../core/repository/user/redis'
import MeshRepository from '../../core/repository/mesh/redis'
import AddUserService from '../../core/service/AddUserService'
import LeaveUserService from '../../core/service/LeaveUserService'
import SendMeshService from '../../core/service/SendMeshService'

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
      socket.on('addUser', () => {
        new AddUserService(userRepository, meshRepository, socket, socket.broadcast).execute(roomID, socket.id)
      })

      socket.on('sendMesh', data => {
        new SendMeshService(userRepository, meshRepository, socket, socket.broadcast).execute(roomID, data)
      })

      socket.on('disconnect', () => {
        new LeaveUserService(userRepository, meshRepository, socket).execute(roomID)
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
