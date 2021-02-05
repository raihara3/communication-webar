import AddUserService from '../AddUserService'
import UserRepositoryMock from '../../repository/user/__mocks__/UserRepository.mock'
import MeshRepositoryMock from '../../repository/mesh/__mocks__/MeshRepository.mock'
import UserMessagingRepositoryMock from '../../repository/user/__mocks__/UserMessagingRepository.mock'

describe('AddUserService test', () => {
  const userRepositoryMock = new UserRepositoryMock()
  const meshRepositoryMock = new MeshRepositoryMock()
  const userMessagingRepositoryMock = new UserMessagingRepositoryMock()
  const addUserService = new AddUserService(userRepositoryMock, meshRepositoryMock, userMessagingRepositoryMock)

  test('roomID is incorrect', () => {
    expect(addUserService.execute('', '')).rejects.toThrowError(/roomID/)
  })
})
