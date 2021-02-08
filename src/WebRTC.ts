const peerList = {}

const createPeerConnection = async(): Promise<RTCPeerConnection> => {
  const peerConnection = new RTCPeerConnection({
    iceServers: [{ urls: 'stun:stun.l.test.com:19000' }]
  })
  const stream = await navigator.mediaDevices.getUserMedia({
    audio: true,
  })
  stream.getTracks().forEach(track => peerConnection.addTrack(
    track,
    stream,
  ))
  peerConnection.ontrack = async(event) => {
    console.log('ontrack!!!')
    // Code that needs to be improved ---->
    const video = document.getElementById('voice') as HTMLVideoElement
    video.srcObject = event.streams[0]
    // <---- Code that needs to be improved
    await video.play()
  }
  return peerConnection
}

export const createPeerOffer = async(targetID) => {
  const peerConnection = await createPeerConnection()
  const offer = await peerConnection.createOffer()
  await peerConnection.setLocalDescription(offer)
  peerList[targetID] = peerConnection
  return offer
}

export const createPeerAnswer = async(targetID, offerSdp) => {
  const peerConnection = await createPeerConnection()
  peerConnection.setRemoteDescription(offerSdp)
  const answer = await peerConnection.createAnswer()
  peerConnection.setLocalDescription(answer)
  peerList[targetID] = peerConnection
  return answer
}

export const setPeerAnswer = async(targetID, answerSdp) => {
  const peerConnection: RTCPeerConnection = peerList[targetID]
  peerConnection.setRemoteDescription(answerSdp)
  peerList[targetID] = peerConnection
}
