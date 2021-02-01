import UserService from '../UserService'
import { UserRepositoryMock } from '../../repository/user/__mocks__/UserRepository.mock'
import { MeshRepositoryMock } from '../../repository/mesh/__mocks__/MeshRepository.mock'

describe('UserService test', () => {
  const userRepositoryMock = new UserRepositoryMock()
  const meshRepositoryMock = new MeshRepositoryMock()
  const userService = new UserService(userRepositoryMock, meshRepositoryMock)

  test('First user to join', async() => {
    const meshList = await userService.add('testRoom', 'testUser1')
    expect(meshList).toEqual([])
  })

  test('Second user to join', async() => {
    const meshList = await userService.add('testRoom', 'testUser2')
    expect(meshList).toEqual([])
  })

  test('Disconnected user', () => {
    userService.remove('testRoom', 'testUser1', true)
  })

  test('Zero users', () => {
    userService.remove('testRoom', 'testUser2', false)
  })

  test('Bad add request', async() => {
    await expect(() => userService.add('', '')).rejects.toThrowError(/incorrect/)
  })

  test('Bad remove request', () => {
    expect(() => userService.remove('', '', true)).toThrowError(/incorrect/)
  })
})
