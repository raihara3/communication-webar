import { sendIceCandidate } from './emitter/Messaging'

const peerList = {}
const peerStore = (id: string) => {
  return {
    add: (data: any) => {
      peerList[id] = data
    },
    get: () => {
      return peerList[id]
    },
    del: () => {
      delete peerList[id]
    }
  }
}

const createPeerConnection = async(sender: any, targetID: string): Promise<RTCPeerConnection> => {
  const peerConnection = new RTCPeerConnection({
    iceServers: [{ urls: 'stun:stun.l.test.com:19000' }]
  })
  const stream = await navigator.mediaDevices.getUserMedia({audio: true})
  stream.getTracks().forEach(track => peerConnection.addTrack(track, stream))
  peerConnection.ontrack = async(event) => {
    // Code that needs to be improved ---->
    const video = document.getElementById('voice') as HTMLVideoElement
    video.srcObject = event.streams[0]
    // <---- Code that needs to be improved
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
  peerStore(targetID).add(peerConnection)
  return offer
}

export const createPeerAnswer = async(sender, targetID, offerSdp): Promise<RTCSessionDescriptionInit> => {
  const peerConnection = await createPeerConnection(sender, targetID)
  peerConnection.setRemoteDescription(offerSdp)
  const answer = await peerConnection.createAnswer()
  peerConnection.setLocalDescription(answer)
  peerStore(targetID).add(peerConnection)
  return answer
}

export const setPeerSdp = async(targetID: string, answerSdp: any) => {
  const peerConnection: RTCPeerConnection = peerStore(targetID).get()
  peerConnection.setRemoteDescription(answerSdp)
  peerStore(targetID).add(peerConnection)
}

export const setIceCandidate = async(targetID: string, ice: any) => {
  const peerConnection: RTCPeerConnection = peerStore(targetID).get()
  await peerConnection?.addIceCandidate(new RTCIceCandidate(ice))
}

export const leavePeerConnection = (id: string) => {
  peerStore(id).del()
}
