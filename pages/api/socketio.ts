import { Server } from 'socket.io'

const ioHandler = (_, res) => {
  if (!res.socket.server.io) {
    console.log('*First use, starting socket.io')

    const io = new Server(res.socket.server)
    io.on('connection', socket => {

      // console.log(socket.handshake.headers.referer)

      socket.on('add user', async () => {
        socket.broadcast.emit('add user', socket.id)
        socket.emit('join', socket.id)

        const rooms = await io.allSockets()
        const ownerId = rooms.values().next().value
        if(ownerId !== socket.id) {
          io.to(ownerId).emit('copy scene', socket.id)
        }
      })

      socket.on('send three mesh', data => {
        console.log(data)
        socket.broadcast.emit('get three mesh', data)
      })

      socket.on('send scene', ({targetId, sceneJson}) => {
        io.to(targetId).emit('get scene', sceneJson)
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
