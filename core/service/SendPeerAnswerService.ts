import UserMessagingRepository from '../repository/user/UserMessagingRepository'

class SendPeerAnswerService {
  userMessagingRepository: UserMessagingRepository

  constructor(userMessagingRepository) {
    this.userMessagingRepository = userMessagingRepository
  }

  async execute(data: {targetID: string, senderID: string, data: any}) {
    this.userMessagingRepository.to('getAnswer', data, data.targetID)
  }
}

export default SendPeerAnswerService
