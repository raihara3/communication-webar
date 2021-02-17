import UserMessagingRepository from '../../repository/user/UserMessagingRepository'
import UserRepository from '../../repository/user/MemberRepository'
import MeshRepository from '../../repository/mesh/MeshRepository'

class SendMeshService {
  userRepository: UserRepository
  meshRepository: MeshRepository
  userMessagingRepository: UserMessagingRepository

  constructor(ur, mr, userMessagingRepository) {
    this.userRepository = ur
    this.meshRepository = mr
    this.userMessagingRepository = userMessagingRepository
  }

  async execute(roomID: string, data: any) {
    this.meshRepository.add(roomID, JSON.stringify(data))
    this.userMessagingRepository.toOther('getMesh', [data])
  }
}

export default SendMeshService
