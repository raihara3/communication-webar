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

  socket.on('getOffer', async ({targetID, senderID, sdp}) => {
    const answer = await createPeerAnswer(senderID, sdp)

    // Code that needs to be improved ---->
    const stream = await window.navigator.mediaDevices.getUserMedia({
      audio: true,
      echoCancellationType: 'system'
    })
    const video = document.getElementById('voice') as HTMLVideoElement
    video.srcObject = stream
    // <---- Code that needs to be improved

    sendPeerAnswerHandler(socket, targetID, answer)
  })

  socket.on('getAnswer', async (data: {targetID: string, senderID: string, sdp: any}) => {
    setPeerAnswer(data.targetID, data.sdp)

    // Code that needs to be improved ---->
    const stream = await window.navigator.mediaDevices.getUserMedia({
      audio: true,
      echoCancellationType: 'system'
    })
    const video = document.getElementById('voice') as HTMLVideoElement
    video.srcObject = stream
    // <---- Code that needs to be improved
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
