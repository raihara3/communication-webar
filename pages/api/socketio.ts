import { Server } from 'socket.io'

const ioHandler = (_, res) => {
  if (!res.socket.server.io) {
    console.log('*First use, starting socket.io')

    const io = new Server(res.socket.server)
    io.on('connection', socket => {

      socket.on('add user', () => {
        socket.broadcast.emit('add user', 'hoge')
      })

      socket.on('send three mesh', data => {
        console.log(data)
        socket.broadcast.emit('get three mesh', data)
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
