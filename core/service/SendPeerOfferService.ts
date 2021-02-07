import UserMessagingRepository from '../repository/user/UserMessagingRepository'

class SendPeerOfferService {
  userMessagingRepository: UserMessagingRepository

  constructor(userMessagingRepository) {
    this.userMessagingRepository = userMessagingRepository
  }

  async execute(data: {targetID: string, senderID: string, sdp: any}) {
    this.userMessagingRepository.to('getOffer', data, data.targetID)
  }
}

export default SendPeerOfferService
