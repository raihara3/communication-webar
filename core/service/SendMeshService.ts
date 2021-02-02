import { BroadCast } from '../src/BroadCaster'
import UserMessagingRepository from '../repository/user/UserMessagingRepository'
import UserRepository from '../repository/user/redis'
import MeshRepository from '../repository/mesh/redis'

class SendMeshService {
  userRepository: UserRepository
  meshRepository: MeshRepository
  userMessagingRepository: UserMessagingRepository

  constructor(ur, mr, listener: BroadCast, broadcast: BroadCast) {
    this.userRepository = ur
    this.meshRepository = mr
    this.userMessagingRepository = new UserMessagingRepository(listener, broadcast)
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
