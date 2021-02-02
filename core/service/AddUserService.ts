import UserMessagingRepository from '../repository/user/UserMessagingRepository'
import UserRepository from '../../core/repository/user/redis'
import MeshRepository from '../../core/repository/mesh/redis'

interface Listener {
  id: string
  broadcast: {
    emit: (eventName, data) => void
  }
}

class AddUserService {
  userRepository: UserRepository
  meshRepository: MeshRepository

  constructor(ur, mr) {
    this.userRepository = ur
    this.meshRepository = mr
  }

  async execute(listener: Listener, roomID: string) {
    const userMessagingRepository = new UserMessagingRepository(listener, listener.broadcast)
    userMessagingRepository.toAll('addUseer', listener.id)

    if(!roomID) {
      throw new Error('The roomID or socketID is incorrect')
    }
    this.userRepository.add(roomID, listener.id)
    const meshList: Array<string> = await this.meshRepository.list(roomID)
    userMessagingRepository.toMyself('getMesh', meshList.map(mesh => JSON.parse(mesh)))
  }
}

export default AddUserService
