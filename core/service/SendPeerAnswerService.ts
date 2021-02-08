import UserMessagingRepository from '../repository/user/UserMessagingRepository'

class SendPeerAnswerService {
  userMessagingRepository: UserMessagingRepository

  constructor(userMessagingRepository) {
    this.userMessagingRepository = userMessagingRepository
  }

  async execute(data: {targetID: string, senderID: string, sdp: any}) {
    this.userMessagingRepository.to('getAnswer', {
      senderID: data.senderID,
      sdp: data.sdp
    }, data.targetID)
  }
}

export default SendPeerAnswerService
