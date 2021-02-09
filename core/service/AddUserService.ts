import UserMessagingRepository from '../repository/user/UserMessagingRepository'
import UserRepository from '../repository/user/UserRepository'
import MeshRepository from '../repository/mesh/MeshRepository'

class AddUserService {
  userRepository: UserRepository
  meshRepository: MeshRepository
  userMessagingRepository: UserMessagingRepository

  constructor(ur, mr, userMessagingRepository) {
    this.userRepository = ur
    this.meshRepository = mr
    this.userMessagingRepository = userMessagingRepository
  }

  async execute(roomID: string, userID: string) {
    this.userMessagingRepository.toSender('join', userID)
    this.userMessagingRepository.toOther('addUser', userID)

    this.userRepository.add(roomID, userID)
    const meshList: Array<string> = await this.meshRepository.list(roomID)
    this.userMessagingRepository.toSender('getMesh', meshList.map(mesh => JSON.parse(mesh)))
  }
}

export default AddUserService
