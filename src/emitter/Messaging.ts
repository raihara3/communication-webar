import { createMeshGroup, Data } from '../Mesh'
import { createPeerOffer, createPeerAnswer, setPeerSdp, setIceCandidate, leavePeerConnection } from '../WebRTC'

export const receiveMessagingHandler = async(socket: SocketIOClient.Socket, scene: THREE.Scene, setMemberList: (list: any) => void) => {
  socket.on('addUser', async({ newEntryID, memberList }) => {
    console.log(`join: ${newEntryID}`)
    setMemberList(memberList)
    const offer = await createPeerOffer(socket, newEntryID)
    sendPeerOfferHandler(socket, newEntryID, offer)
  })

  socket.on('join', ({ myID, memberList }) => {
    setMemberList(memberList)
    console.log(`myID: ${myID}`)
  })

  socket.on('getMesh', (data: Array<Data>) => {
    try {
      createMeshGroup(scene, data)
    } catch (e) {
      console.error('Faild to synchronize scene', e)
    }
  })

  socket.on('getOffer', async ({senderID, sdp}) => {
    const answer = await createPeerAnswer(socket, senderID, sdp)
    sendPeerAnswerHandler(socket, senderID, answer)
  })

  socket.on('getAnswer', async ({senderID, sdp}) => {
    setPeerSdp(senderID, sdp)
  })

  socket.on('getIceCandidate', ({senderID, ice}) => {
    setIceCandidate(senderID, ice)
  })

  socket.on('leaveUser', ({ id, memberList}) => {
    setMemberList(memberList)
    leavePeerConnection(id)
  })

  socket.on('disconnect', () => {
    console.log('disconnect!!')
  })
}

export const sendMeshHandler = (socket: SocketIOClient.Socket, data: Data) => {
  socket.emit('sendMesh', data)
}

export const sendPeerOfferHandler = (socket: SocketIOClient.Socket, targetID: string, offer: RTCSessionDescriptionInit) => {
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

export const sendIceCandidate = (socket: SocketIOClient.Socket, targetID: string, ice: any) => {
  socket.emit('sendIceCandidate', {
    targetID: targetID,
    senderID: socket.id,
    ice: ice
  })
}
