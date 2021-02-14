import UserMessagingRepository from '../../repository/user/UserMessagingRepository'
import UserRepository from '../../repository/user/UserRepository'
import MeshRepository from '../../repository/mesh/MeshRepository'

class AddUserService {
  userRepository: UserRepository
  meshRepository: MeshRepository
  userMessagingRepository: UserMessagingRepository

  constructor(ur, mr, userMessagingRepository) {
    this.userRepository = ur
    this.meshRepository = mr
    this.userMessagingRepository = userMessagingRepository
  }

  async execute(roomID: string, newEntryID: string, memberList: Array<string>) {
    this.userMessagingRepository.toSender('join', {
      myID: newEntryID,
      memberList: memberList
    })
    this.userMessagingRepository.toOther('addUser', {
      newEntryID: newEntryID,
      memberList: memberList
    })

    this.userRepository.add(roomID, newEntryID)
    const meshList: Array<string> = await this.meshRepository.list(roomID)
    this.userMessagingRepository.toSender('getMesh', meshList.map(mesh => JSON.parse(mesh)))
  }
}

export default AddUserService
