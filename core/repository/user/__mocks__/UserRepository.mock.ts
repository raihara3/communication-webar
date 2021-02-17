import UserRepository from '../MemberRepository'

jest.mock('../UserRepository')
const UserRepositoryMock = UserRepository as jest.Mock

UserRepositoryMock.mockImplementationOnce(() => {
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

export default UserRepositoryMock
