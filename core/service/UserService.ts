class UserService {
  userRepository: any
  meshRepository: any

  constructor(ur, mr) {
    this.userRepository = ur
    this.meshRepository = mr
  }

  async add(roomID: string, socketID: string) {
    this.userRepository.add(roomID, socketID)
    const meshList: Array<string> = await this.meshRepository.list(roomID)
    return meshList.map(mesh => JSON.parse(mesh))
  }

  remove(roomID: string, socketID: any, hasActiveMember: boolean) {
    this.userRepository.remove(roomID, socketID)
    if(!hasActiveMember) {
      this.meshRepository.delete(roomID)
    }
  }
}

export default UserService
