import { sendIceCandidate } from './emitter/Messaging'
import peerStore from './store/peer'

const createPeerConnection = async(sender: any, targetID: string): Promise<RTCPeerConnection> => {
  const peerConnection = new RTCPeerConnection({
    iceServers: [{ urls: 'stun:stun.l.test.com:19000' }]
  })
  const stream = await navigator.mediaDevices.getUserMedia({audio: true})
  stream.getTracks().forEach(track => peerConnection.addTrack(track, stream))
  peerConnection.ontrack = async(event) => {
    const video = document.getElementById(targetID) as HTMLVideoElement
    video.srcObject = event.streams[0]
    await video.play()
  }
  peerConnection.onicecandidate = ({ candidate }) => {
    candidate && sendIceCandidate(sender, targetID, candidate)
  }
  return peerConnection
}

export const createPeerOffer = async(sender, targetID): Promise<RTCSessionDescriptionInit> => {
  const peerConnection = await createPeerConnection(sender, targetID)
  const offer = await peerConnection.createOffer()
  await peerConnection.setLocalDescription(offer)
  peerStore().add(targetID, peerConnection)
  return offer
}

export const createPeerAnswer = async(sender, targetID, offerSdp): Promise<RTCSessionDescriptionInit> => {
  const peerConnection = await createPeerConnection(sender, targetID)
  peerConnection.setRemoteDescription(offerSdp)
  const answer = await peerConnection.createAnswer()
  peerConnection.setLocalDescription(answer)
  peerStore().add(targetID, peerConnection)
  return answer
}

export const setPeerSdp = async(targetID: string, answerSdp: any) => {
  const peerConnection: RTCPeerConnection = peerStore().get(targetID)
  peerConnection.setRemoteDescription(answerSdp)
  peerStore().add(targetID, peerConnection)
}

export const setIceCandidate = async(targetID: string, ice: any) => {
  const peerConnection: RTCPeerConnection = peerStore().get(targetID)
  await peerConnection?.addIceCandidate(new RTCIceCandidate(ice))
}

export const leavePeerConnection = (id: string) => {
  peerStore().del(id)
}
