import UserMessagingRepository from '../repository/user/UserMessagingRepository'

class SendIceCandidateService {
  userMessagingRepository: UserMessagingRepository

  constructor(userMessagingRepository) {
    this.userMessagingRepository = userMessagingRepository
  }

  async execute(data: {targetID: string, senderID: string, ice: any}) {
    this.userMessagingRepository.to('getIceCandidate', {
      senderID: data.senderID,
      ice: data.ice
    }, data.targetID)
  }
}

export default SendIceCandidateService
