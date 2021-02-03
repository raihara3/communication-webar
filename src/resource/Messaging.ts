import { createGroup } from '../Mesh'

export const receiveMessagingHandler = async(socket: SocketIOClient.Socket, scene: THREE.Scene) => {
  socket.on('addUser', (id: string) => {
    console.log(`join: ${id}`)
  })

  socket.on('getMesh', (data: any) => {
    console.log(data)
    createGroup(scene, data)
  })

  socket.on('disconnect', () => {
    console.log('disconnect!!')
  })
}

export const sendMeshHandler = (socket: SocketIOClient.Socket, data: {json: any, position: any}) => {
  socket.emit('sendMesh', data)
}
