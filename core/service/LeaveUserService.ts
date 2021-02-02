import { BroadCast } from '../src/BroadCaster'
import UserRepository from '../repository/user/redis'
import MeshRepository from '../repository/mesh/redis'

class LeaveUserService {
  userRepository: UserRepository
  meshRepository: MeshRepository
  listener: BroadCast

  constructor(ur, mr, listener: BroadCast) {
    this.userRepository = ur
    this.meshRepository = mr
    this.listener = listener
  }

  execute(roomID: string) {
    if(!roomID) {
      throw new Error('The roomID or socketID is incorrect')
    }
    console.log(`disconnect: ${this.listener.id}`)
    this.userRepository.remove(roomID, this.listener.id)
    if(!this.listener.adapter.rooms.has(roomID)) {
      this.meshRepository.delete(roomID)
    }
  }
}

export default LeaveUserService
