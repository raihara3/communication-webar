import ThreeJS from '../../utils/ThreeJS'

export const messageHandler = async(socket) => {
  socket.on('connect', () => {
    socket.emit('addUser')
  })

  socket.on('addUser', (id: string) => {
    console.log(`join: ${id}`)
  })

  socket.on('getMesh', (data: any) => {
    console.log(data)
    const threeJS = new ThreeJS('webAR')
    threeJS.createMesh(data)
  })

  socket.on('disconnect', () => {
    console.log('disconnect!!')
  })
}

export const sendMesh = (socket: SocketIOClient.Socket, data: any) => {
  socket.emit('sendMesh', data)
}
