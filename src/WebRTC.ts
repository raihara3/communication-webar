const peerStore = () => {
  const peerList = {}

  return {
    add: (id, sdp) => {
      peerList[id] = sdp
    },
    get: (id) => {
      return peerList[id]
    }
  }
}

export const createPeerOffer = async(targetID) => {
  const peerConnection = new RTCPeerConnection()
  const offer = await peerConnection.createOffer()
  await peerConnection.setLocalDescription(offer)
  peerStore().add(targetID, peerConnection)
  return offer
}

export const createPeerAnswer = async(targetID, offerSdp) => {
  const peerConnection = new RTCPeerConnection()
  peerConnection.setRemoteDescription(offerSdp)
  const answer = await peerConnection.createAnswer()
  peerConnection.setLocalDescription(answer)
  peerStore().add(targetID, peerConnection)
  return answer
}

export const setPeerAnswer = async(targetID, answerSdp) => {
  const peerConnection: RTCPeerConnection = peerStore().get(targetID)
  peerConnection.setRemoteDescription(answerSdp)
  peerStore().add(targetID, peerConnection)
}
