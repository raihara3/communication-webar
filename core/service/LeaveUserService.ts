import UserRepository from '../repository/user/UserRepository'
import MeshRepository from '../repository/mesh/MeshRepository'
import UserMessagingRepository from '../repository/user/UserMessagingRepository'

class LeaveUserService {
  userRepository: UserRepository
  meshRepository: MeshRepository
  userMessagingRepository: UserMessagingRepository

  constructor(ur, mr, userMessagingRepository) {
    this.userRepository = ur
    this.meshRepository = mr
    this.userMessagingRepository = userMessagingRepository
  }

  async execute(roomID: string, userID: string, hasMember: boolean) {
    this.userRepository.remove(roomID, userID)
    this.userMessagingRepository.toOther('leaveUser', userID)
    if(!hasMember) {
      this.meshRepository.delete(roomID)
    }
  }
}

export default LeaveUserService
