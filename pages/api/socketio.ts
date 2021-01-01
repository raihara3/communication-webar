import { Server } from 'socket.io'

const ioHandler = (_, res) => {
  if (!res.socket.server.io) {
    console.log('*First use, starting socket.io')

    const io = new Server(res.socket.server)
    io.on('connection', socket => {

      socket.on('add user', () => {
        socket.broadcast.emit('add user', 'hoge')
      })

      socket.on('send data', data => {
        console.log(data)
        socket.emit('get data', data)
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
