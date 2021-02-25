import SocketMock from 'socket.io-mock'
import redis from 'redis-mock'
import AddUserService from '../AddUserService'
import UserMessagingRepository from '../../../repository/user/UserMessagingRepository'
import MemberRepositoryMock from '../../../repository/user/__mocks__/MemberRepository.mock'
import UserNameRepositoryMock from '../../../repository/user/__mocks__/UserNameRepository.mock'
import MeshRepository from '../../../repository/mesh/MeshRepository'

const memberStorage: any = {}
const userNameStorage: any = {}
const meshStorage = redis.createClient({db: 2})
const memberRepositoryMock = new MemberRepositoryMock(memberStorage)
const userNameRepositoryMock = new UserNameRepositoryMock(userNameStorage)
const meshRepository = new MeshRepository(meshStorage)

const setUpSocket = (userID, userName, memberList) => {
  const socket = new SocketMock()
  const sender = (eventName, data) => {
    return socket.emit(eventName, data)
  }
  socket.socketClient.on('join', (data) => {
    expect(data).toEqual({myID: userID, userName: userName, memberList: memberList})
  })
  socket.socketClient.on('addUser', (data) => {
    expect(data).toEqual({newEntryID: userID, userName: userName, memberList: memberList})
  })
  socket.socketClient.on('getMesh', (data) => {
    expect(data).toEqual([])
  })
  return sender
}

describe.each([
  {
    roomID: 'testRoom',
    userID: 'user1_id',
    userName: 'user1_name',
    response: {
      memberList: ['user1_id']
    }
  },
  {
    roomID: 'testRoom',
    userID: 'user2_id',
    userName: 'user2_name',
    response: {
      memberList: ['user1_id', 'user2_id']
    }
  }
])('Multiple participants in the same Room. (%o)', ({roomID, userID, userName, response}) => {
  test('Add user', async() => {
    const sender = setUpSocket(userID, userName, response.memberList)
    const userMessagingRepository = new UserMessagingRepository(sender, sender)

    await new AddUserService(
      memberRepositoryMock,
      userNameRepositoryMock,
      meshRepository,
      userMessagingRepository
    ).execute(roomID, userID, userName)

    expect(memberRepositoryMock.add.call.length).toBe(1)
    expect(userNameRepositoryMock.add.call.length).toBe(1)
  })
})
