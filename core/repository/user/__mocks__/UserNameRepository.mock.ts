import UserNameRepository from '../UserNameRepository'
import MemoryStorage from 'memorystorage'

jest.mock('../UserNameRepository')
const UserNameRepositoryMock = UserNameRepository as jest.Mock

const userNameStorage = new MemoryStorage('db3')

UserNameRepositoryMock.mockImplementationOnce(() => {
  return {
    add: (userID: string, userName: string) => {
      userNameStorage.setItem(userID, userName)
    },

    remove: (userID: string) => {
      userNameStorage.removeItem(userID)
    }
  }
})

export default UserNameRepositoryMock
