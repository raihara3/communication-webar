class UserService {
  userRepository: any
  meshRepository: any

  constructor(ur, mr) {
    this.userRepository = ur
    this.meshRepository = mr
  }

  async add(roomID: string, socketID: string) {
    if(!roomID || !socketID) {
      throw new Error('The roomID or socketID is incorrect')
    }

    this.userRepository.add(roomID, socketID)
    const meshList: Array<string> = await this.meshRepository.list(roomID)
    return meshList.map(mesh => JSON.parse(mesh))
  }

  remove(roomID: string, socketID: any, hasActiveMember: boolean) {
    if(!roomID || !socketID) {
      throw new Error('The roomID or socketID is incorrect')
    }

    this.userRepository.remove(roomID, socketID)
    if(!hasActiveMember) {
      this.meshRepository.delete(roomID)
    }
  }
}

export default UserService
