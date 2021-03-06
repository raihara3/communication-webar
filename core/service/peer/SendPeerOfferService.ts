import UserMessagingRepository from '../../repository/user/UserMessagingRepository'

interface PeerOfferData {
  targetID: string
  senderID: string
  sdp: any
}

class SendPeerOfferService {
  userMessagingRepository: UserMessagingRepository

  constructor(userMessagingRepository) {
    this.userMessagingRepository = userMessagingRepository
  }

  async execute(data: PeerOfferData) {
    if(!Object.keys(data).length) return
    this.userMessagingRepository.to('getOffer', {
      senderID: data.senderID,
      sdp: data.sdp
    }, data.targetID)
  }
}

export default SendPeerOfferService
