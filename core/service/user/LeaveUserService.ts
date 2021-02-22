import UserRepository from '../../repository/user/MemberRepository'
import MeshRepository from '../../repository/mesh/MeshRepository'
import UserMessagingRepository from '../../repository/user/UserMessagingRepository'
import UserNameRepository from '../../repository/user/UserNameRepository'

class LeaveUserService {
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

  async execute(roomID: string, userID: string) {
    this.userNameRepository.remove(userID)
    this.userRepository.remove(roomID, userID)
    const memberList = await this.userRepository.list(roomID)
    this.userMessagingRepository.toOther('leaveUser', {
      userID: userID,
      memberList: memberList
    })
    if(memberList.length === 0) {
      this.meshRepository.delete(roomID)
    }
  }
}

export default LeaveUserService
