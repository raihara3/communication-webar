import { createMeshGroup, Data } from '../Mesh'

export const receiveMessagingHandler = async(socket: SocketIOClient.Socket, scene: THREE.Scene) => {
  socket.on('addUser', (id: string) => {
    console.log(`join: ${id}`)
  })

  socket.on('getMesh', (data: Array<Data>) => {
    console.log(data)
    try {
      createMeshGroup(scene, data)
    } catch (e) {
      console.error('Faild to synchronize scene')
      console.error(e)
    }
  })

  socket.on('disconnect', () => {
    console.log('disconnect!!')
  })
}

export const sendMeshHandler = (socket: SocketIOClient.Socket, data: Data) => {
  socket.emit('sendMesh', data)
}
