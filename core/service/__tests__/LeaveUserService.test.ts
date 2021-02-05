import LeaveUserService from '../LeaveUserService'
import UserRepositoryMock from '../../repository/user/__mocks__/UserRepository.mock'
import MeshRepositoryMock from '../../repository/mesh/__mocks__/MeshRepository.mock'

describe('LeaveUserService test', () => {
  const userRepositoryMock = new UserRepositoryMock()
  const meshRepositoryMock = new MeshRepositoryMock()
  const leaveUserService = new LeaveUserService(userRepositoryMock, meshRepositoryMock)

  test('roomID is incorrect', () => {
    expect(leaveUserService.execute('', 'testUser', true)).rejects.toThrowError(/roomID/)
  })
})
