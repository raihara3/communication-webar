import UserMessagingRepository from '../repository/user/UserMessagingRepository'
import UserRepository from '../repository/user/UserRepository'
import MeshRepository from '../../core/repository/mesh/redis'

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
    this.userMessagingRepository.toAll('addUseer', userID)

    if(!roomID) {
      throw new Error('The roomID or socketID is incorrect')
    }
    this.userRepository.add(roomID, userID)
    const meshList: Array<string> = await this.meshRepository.list(roomID)
    this.userMessagingRepository.toMyself('getMesh', meshList.map(mesh => JSON.parse(mesh)))
  }
}

export default AddUserService
