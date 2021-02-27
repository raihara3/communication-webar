import UserMessagingRepository from '../../repository/user/UserMessagingRepository'
import MeshRepository from '../../repository/mesh/MeshRepository'

class SendMeshService {
  meshRepository: MeshRepository
  userMessagingRepository: UserMessagingRepository

  constructor(mr, userMessagingRepository) {
    this.meshRepository = mr
    this.userMessagingRepository = userMessagingRepository
  }

  async execute(roomID: string, data: any) {
    if(!Object.keys(data).length) return
    await this.meshRepository.add(roomID, JSON.stringify(data))
    this.userMessagingRepository.toOther('getMesh', [data])
  }
}

export default SendMeshService
