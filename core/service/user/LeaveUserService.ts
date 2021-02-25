import MemberRepository from '../../repository/user/MemberRepository'
import MeshRepository from '../../repository/mesh/MeshRepository'
import UserMessagingRepository from '../../repository/user/UserMessagingRepository'
import UserNameRepository from '../../repository/user/UserNameRepository'

class LeaveUserService {
  memberRepository: MemberRepository
  userNameRepository: UserNameRepository
  meshRepository: MeshRepository
  userMessagingRepository: UserMessagingRepository

  constructor(memberRepository, userNameRepository, mr, userMessagingRepository) {
    this.memberRepository = memberRepository
    this.userNameRepository = userNameRepository
    this.meshRepository = mr
    this.userMessagingRepository = userMessagingRepository
  }

  async execute(roomID: string, userID: string) {
    this.userNameRepository.remove(userID)
    await this.memberRepository.remove(roomID, userID)
    const memberList = await this.memberRepository.list(roomID)
    this.userMessagingRepository.toOther('leaveUser', {
      userID: userID,
      memberList: memberList
    })
    if(memberList.length === 0) {
      this.meshRepository.delete(roomID)
    }
  }
}

export default LeaveUserService
