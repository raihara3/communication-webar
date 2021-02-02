import { BroadCast } from '../src/BroadCaster'
import UserMessagingRepository from '../repository/user/UserMessagingRepository'
import UserRepository from '../repository/user/redis'
import MeshRepository from '../repository/mesh/redis'

class LeaveUserService {
  userRepository: UserRepository
  meshRepository: MeshRepository
  userMessagingRepository: UserMessagingRepository

  constructor(ur, mr, listener: BroadCast, broadcast: BroadCast) {
    this.userRepository = ur
    this.meshRepository = mr
    this.userMessagingRepository = new UserMessagingRepository(listener, broadcast)
  }

  execute(listener: BroadCast, roomID: string) {
    if(!roomID) {
      throw new Error('The roomID or socketID is incorrect')
    }
    console.log(`disconnect: ${listener.id}`)
    this.userRepository.remove(roomID, listener.id)
    if(!listener.adapter.rooms.has(roomID)) {
      this.meshRepository.delete(roomID)
    }
  }
}

export default LeaveUserService
