import { Server } from 'socket.io'
import redis from 'redis'
import UserRepository from '../../core/repository/user/UserRepository'
import MeshRepository from '../../core/repository/mesh/MeshRepository'
import UserMessagingRepository from '../../core/repository/user/UserMessagingRepository'
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
      const logger = (e) => {
        console.log(e)
        console.log(`roomID: ${roomID}, userID: ${socket.id}`)
      }

      const sender = (eventName, data) => socket.emit(eventName, data)
      const broadcast = (eventName, data) => socket.broadcast.emit(eventName, data)
      const userMessagingRepository = new UserMessagingRepository(sender, broadcast)
      new AddUserService(userRepository, meshRepository, userMessagingRepository).execute(roomID, socket.id).catch(e => logger(e))

      socket.join(roomID)

      socket.on('sendMesh', data =>
        new SendMeshService(userRepository, meshRepository, userMessagingRepository).execute(roomID, data).catch(e => logger(e))
      )

      socket.on('disconnect', () =>
        new LeaveUserService(userRepository, meshRepository).execute(roomID, socket.id, socket.adapter.rooms.has(roomID)).catch(e => logger(e))
      )
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
