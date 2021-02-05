import SendMeshService from '../SendMeshService'
import UserRepositoryMock from '../../repository/user/__mocks__/UserRepository.mock'
import MeshRepositoryMock from '../../repository/mesh/__mocks__/MeshRepository.mock'
import UserMessagingRepositoryMock from '../../repository/user/__mocks__/UserMessagingRepository.mock'

describe('SendMeshService test', () => {
  const userRepositoryMock = new UserRepositoryMock()
  const meshRepositoryMock = new MeshRepositoryMock()
  const userMessagingRepositoryMock = new UserMessagingRepositoryMock()
  const sendMeshService = new SendMeshService(userRepositoryMock, meshRepositoryMock, userMessagingRepositoryMock)

  test('roomID is incorrect', () => {
    expect(() => sendMeshService.execute('', {})).toThrowError(/roomID/)
  })
})
