import UserMessagingRepository from '../../repository/user/UserMessagingRepository'

class SendPeerOfferService {
  userMessagingRepository: UserMessagingRepository

  constructor(userMessagingRepository) {
    this.userMessagingRepository = userMessagingRepository
  }

  async execute(data: {targetID: string, senderID: string, sdp: any}) {
    if(!Object.keys(data).length) return
    this.userMessagingRepository.to('getOffer', {
      senderID: data.senderID,
      sdp: data.sdp
    }, data.targetID)
  }
}

export default SendPeerOfferService
