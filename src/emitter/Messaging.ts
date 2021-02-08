import { createMeshGroup, Data } from '../Mesh'
import { createPeerOffer, createPeerAnswer, setPeerAnswer } from '../WebRTC'

export const receiveMessagingHandler = async(socket: SocketIOClient.Socket, scene: THREE.Scene) => {
  socket.on('addUser', async(inviteUserID: string) => {
    console.log(`join: ${inviteUserID}`)
    const offer = await createPeerOffer(inviteUserID)
    sendPeerOfferHandler(socket, inviteUserID, offer)
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

  socket.on('getOffer', async ({senderID, sdp}) => {
    const answer = await createPeerAnswer(senderID, sdp)
    sendPeerAnswerHandler(socket, senderID, answer)
  })

  socket.on('getAnswer', async ({senderID, sdp}) => {
    setPeerAnswer(senderID, sdp)
  })

  socket.on('disconnect', () => {
    console.log('disconnect!!')
  })

  socket.on('connectionFaild', (message: string) => {
    console.error('Connection faild.', message)
  })
}

export const sendMeshHandler = (socket: SocketIOClient.Socket, data: Data) => {
  socket.emit('sendMesh', data)
}

export const sendPeerOfferHandler = async(socket: SocketIOClient.Socket, targetID: string, offer: RTCSessionDescriptionInit) => {
  socket.emit('sendPeerOffer', {
    targetID: targetID,
    senderID: socket.id,
    sdp: offer
  })
}

export const sendPeerAnswerHandler = async(socket: SocketIOClient.Socket, targetID: string, answer: RTCSessionDescriptionInit) => {
  socket.emit('sendPeerAnswer', {
    targetID: targetID,
    senderID: socket.id,
    sdp: answer
  })
}
