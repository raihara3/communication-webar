import UserMessagingRepository from '../repository/user/UserMessagingRepository'
import UserRepository from '../repository/user/UserRepository'
import MeshRepository from '../repository/mesh/MeshRepository'
import { RoomIDException } from '../exception/Exception'

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
    if(!roomID) throw RoomIDException()

    this.meshRepository.add(roomID, JSON.stringify(data))
    this.userMessagingRepository.toOther('getMesh', [data])
  }
}

export default SendMeshService
