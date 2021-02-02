import UserMessagingRepository from '../repository/user/UserMessagingRepository'
import UserRepository from '../repository/user/UserRepository'
import MeshRepository from '../repository/mesh/redis'

class SendMeshService {
  userRepository: UserRepository
  meshRepository: MeshRepository
  userMessagingRepository: UserMessagingRepository

  constructor(ur, mr, userMessagingRepository) {
    this.userRepository = ur
    this.meshRepository = mr
    this.userMessagingRepository = userMessagingRepository
  }

  execute(roomID: string, data: any) {
    if(!roomID) {
      throw new Error('The roomID or socketID is incorrect')
    }
    this.meshRepository.add(roomID, JSON.stringify(data))
    this.userMessagingRepository.toOther('getMesh', [data])
  }
}

export default SendMeshService
