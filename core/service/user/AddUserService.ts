import UserMessagingRepository from '../../repository/user/UserMessagingRepository'
import UserRepository from '../../repository/user/MemberRepository'
import MeshRepository from '../../repository/mesh/MeshRepository'
import UserNameRepository from '../../repository/user/UserNameRepository'

class AddUserService {
  userRepository: UserRepository
  userNameRepository: UserNameRepository
  meshRepository: MeshRepository
  userMessagingRepository: UserMessagingRepository

  constructor(ur, userNameRepository, mr, userMessagingRepository) {
    this.userRepository = ur
    this.userNameRepository = userNameRepository
    this.meshRepository = mr
    this.userMessagingRepository = userMessagingRepository
  }

  async execute(roomID: string, newEntryID: string, userName: string) {
    this.userNameRepository.add(newEntryID, userName)
    this.userRepository.add(roomID, newEntryID)
    const memberList = await this.userRepository.list(roomID)

    this.userMessagingRepository.toSender('join', {
      myID: newEntryID,
      userName: userName,
      memberList: memberList
    })
    this.userMessagingRepository.toOther('addUser', {
      newEntryID: newEntryID,
      userName: userName,
      memberList: memberList
    })

    const meshList: Array<string> = await this.meshRepository.list(roomID)
    this.userMessagingRepository.toSender('getMesh', meshList.map(mesh => JSON.parse(mesh)))
  }
}

export default AddUserService
