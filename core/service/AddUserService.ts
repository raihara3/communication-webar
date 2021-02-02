import { BroadCast } from '../src/BroadCaster'
import UserMessagingRepository from '../repository/user/UserMessagingRepository'
import UserRepository from '../../core/repository/user/redis'
import MeshRepository from '../../core/repository/mesh/redis'

class AddUserService {
  userRepository: UserRepository
  meshRepository: MeshRepository
  userMessagingRepository: UserMessagingRepository

  constructor(ur, mr, listener: BroadCast, broadcast: BroadCast) {
    this.userRepository = ur
    this.meshRepository = mr
    this.userMessagingRepository = new UserMessagingRepository(listener, broadcast)
  }

  async execute(listener: BroadCast, roomID: string) {
    this.userMessagingRepository.toAll('addUseer', listener.id)

    if(!roomID) {
      throw new Error('The roomID or socketID is incorrect')
    }
    this.userRepository.add(roomID, listener.id)
    const meshList: Array<string> = await this.meshRepository.list(roomID)
    this.userMessagingRepository.toMyself('getMesh', meshList.map(mesh => JSON.parse(mesh)))
  }
}

export default AddUserService
