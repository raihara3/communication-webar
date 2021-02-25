import SocketMock from 'socket.io-mock'
import redis from 'redis-mock'
import AddUserService from '../AddUserService'
import UserMessagingRepository from '../../../repository/user/UserMessagingRepository'
import MemberRepository from '../../../repository/user/MemberRepository'
import MeshRepository from '../../../repository/mesh/MeshRepository'
import UserNameRepository from '../../../repository/user/UserNameRepository'

const memberStorage = redis.createClient({db: 1})
const userNameStorage = redis.createClient({db: 3})
const meshStorage = redis.createClient({db: 2})
const memberRepository = new MemberRepository(memberStorage)
const userNameRepository = new UserNameRepository(userNameStorage)
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
  test('The first participant', async() => {
    const sender = setUpSocket(userID, userName, response.memberList)
    const userMessagingRepository = new UserMessagingRepository(sender, sender)

    await new AddUserService(
      memberRepository,
      userNameRepository,
      meshRepository,
      userMessagingRepository
    ).execute(roomID, userID, userName)

    memberStorage.lrange(roomID, 0, -1, (_, reply) => {
      expect(reply).toEqual(response.memberList)
    })
    userNameStorage.get(userID, (_, reply) => {
      expect(reply).toEqual(userName)
    })
  })
})
