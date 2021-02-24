import MemberRepository from '../MemberRepository'

jest.mock('../MemberRepository')
const MemberRepositoryMock = MemberRepository as jest.Mock

MemberRepositoryMock.mockImplementationOnce(() => {
  const userList: Array<string> = []

  return {
    add: async(_: string, socketID: string) => {
      userList.push(socketID)
    },
    remove: (_: string, socketID: string) => {
      userList.splice(userList.indexOf(socketID), 1)
    }
  }
})

export default MemberRepositoryMock
