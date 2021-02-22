let stream: MediaStream

export const getAudio = async () => {
  stream = await window.navigator.mediaDevices.getUserMedia({
    audio: true,
  })
}

export const setAudioTrack = async(peerConnection: RTCPeerConnection) => {
  const track = stream.getAudioTracks()[0]
  peerConnection.addTrack(track, stream)
}

export const switchAudio = () => {
  const enabled = stream.getAudioTracks()[0].enabled
  stream.getAudioTracks()[0].enabled = !enabled
  return !enabled
}
