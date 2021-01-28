import ThreeJS from '../../utils/ThreeJS'

export const messageHandler = async(socket: SocketIOClient.Socket, threeJS: ThreeJS) => {
  socket.on('connect', () => {
    socket.emit('addUser')
  })

  socket.on('addUser', (id: string) => {
    console.log(`join: ${id}`)
  })

  socket.on('getMesh', (data: any) => {
    console.log(data)
    threeJS.createMesh(data)
  })

  socket.on('disconnect', () => {
    console.log('disconnect!!')
  })
}

export const sendMesh = (socket: SocketIOClient.Socket, data: {json: any, position: any}) => {
  socket.emit('sendMesh', data)
}
