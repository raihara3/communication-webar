let stream: MediaStream

export const setAudioTrack = async(peerConnection: RTCPeerConnection) => {
  stream = await navigator.mediaDevices.getUserMedia({audio: true})
  const track = stream.getAudioTracks()[0]
  peerConnection.addTrack(track, stream)
}

export const switchAudio = () => {
  const enabled = stream.getAudioTracks()[0].enabled
  stream.getAudioTracks()[0].enabled = !enabled
  return !enabled
}
