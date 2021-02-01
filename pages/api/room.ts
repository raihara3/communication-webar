import { Server } from 'socket.io'
import redis from 'redis'
import UserRepository from '../../core/repository/user/redis'
import MeshRepository from '../../core/repository/mesh/redis'
import UserService from '../../core/service/AddUserService'

// in testcode
// const mockUserRepsository = new sinon().Expect('add').Count(1)
// const mockMeshRepsository = new sinon().Expect('add').Count(1)
// new AddUserService(mockUserRepsository, mockMeshRepsository).Execute(doSomeThing)
//

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
    const userService = new UserService(userRepository, meshRepository)
    const io = new Server(res.socket.server)

    io.on('connect', socket => {
      socket.join(roomID)
      socket.on('addUser', async() => {
        socket.broadcast.emit('addUser', socket.id)
        socket.emit('addUser', socket.id)
        const ret = await userService.add(roomID, socket.id)
        socket.emit('getMesh', ret)
      })

      socket.on('sendMesh', data => {
        meshRepository.add(roomID, JSON.stringify(data))
        socket.broadcast.emit('getMesh', [data])
      })

      socket.on('disconnect', () => {
        console.log(`disconnect: ${socket.id}`)
        const hasActiveMember = socket.adapter.rooms.has(roomID)
        userService.remove(roomID, socket.id, hasActiveMember)
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
