import UserRepository from '../redis'

jest.mock('../redis')
export const UserRepositoryMock = UserRepository as jest.Mock

UserRepositoryMock.mockImplementationOnce(() => {
  const userList: Array<string> = []

  return {
    add: async(roomID: string, socketID: string) => {
      userList.push(socketID)
      console.log(`join ${socketID} in ${roomID}`, userList)
    },
    remove: (roomID: string, socketID: string) => {
      userList.splice(userList.indexOf(socketID), 1)
      console.log(`disconnected ${socketID} in ${roomID}`, userList)
    }
  }
})
