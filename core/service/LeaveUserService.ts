import UserRepository from '../repository/user/UserRepository'
import MeshRepository from '../repository/mesh/MeshRepository'
import { RoomIDException } from '../exception/Exception'

class LeaveUserService {
  userRepository: UserRepository
  meshRepository: MeshRepository

  constructor(ur, mr) {
    this.userRepository = ur
    this.meshRepository = mr
  }

  execute(roomID: string, userID: string, hasMember: boolean) {
    if(!roomID) throw RoomIDException()

    console.log(`disconnect: ${userID}`)
    this.userRepository.remove(roomID, userID)
    if(!hasMember) {
      this.meshRepository.delete(roomID)
    }
  }
}

export default LeaveUserService
