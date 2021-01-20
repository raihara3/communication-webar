import { Server } from 'socket.io'
import Redis from './redis'

// TODO: change to the RoomID
const roomID = 'testRoom'

const ioHandler = (_, res) => {
  if (!res.socket.server.io) {
    console.log('*First use, starting socket.io')

    const redis = new Redis()

    const io = new Server(res.socket.server)
    io.on('connection', async socket => {

      socket.join(roomID)

      const rooms = await io.allSockets()

      socket.on('addUser', async () => {
        socket.broadcast.emit('addUser', socket.id)
        socket.emit('join', socket.id)

        const meshs: Array<string> = await redis.getMeshs(roomID)
        socket.emit('getMeshData', meshs.map(mesh => JSON.parse(mesh)))

        redis.addUser(roomID, socket.id)

        const ownerId = rooms.values().next().value
        if(ownerId !== socket.id) {
          io.to(ownerId).emit('copy scene', socket.id)
        }
      })

      socket.on('sendMesh', data => {
        redis.addMesh(roomID, JSON.stringify(data))
        socket.broadcast.emit('getMeshData', [data])
      })

      socket.on('disconnect', () => {
        redis.removeUser(roomID, socket.id)
        if(!socket.adapter.rooms.has(roomID)) {
          redis.removeAllMesh(roomID)
        }
      })
    })

    res.socket.server.io = io
  } else {
    console.log('socket.io already running')
  }
  res.end()
}

export const config = {
  api: {
    bodyParser: false
  }
}

export default ioHandler
