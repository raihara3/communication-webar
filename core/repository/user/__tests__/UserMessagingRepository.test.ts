import io from 'socket.io-client'
import http from 'http'
import { Server } from 'socket.io'
import UserMessagingRepository from '../UserMessagingRepository'

let httpServer
let httpServerAddress
let ioServer: Server
let ioClient1
let ioClient2
let socket
const memberList: Array<string> = []

beforeAll((done) => {
  httpServer = http.createServer().listen()
  httpServerAddress = httpServer.address()
  ioServer = new Server(httpServer)
  ioServer.on('connect', (iosocket) => {
    socket = iosocket
    memberList.push(iosocket.id)
    // ioServer.sockets.adapter.rooms.get(roomID)?.forEach(id => memberList.push(id))
    console.log(memberList)
  })
  done()
})

afterAll((done) => {
  ioServer.close()
  httpServer.close()
  done()
})

beforeEach((done) => {
  const option = {
    forceNew: true,
    transports: ['websocket'],
  }
  memberList.length = 0
  ioClient1 = io(`http://[${httpServerAddress.address}]:${httpServerAddress.port}`, option)
  ioClient2 = io(`http://[${httpServerAddress.address}]:${httpServerAddress.port}`, option)
  ioClient1.on('connect', () => done())
  ioClient2.on('connect', () => done())
})

afterEach((done) => {
  if (ioClient1.connected) {
    ioClient1.disconnect()
  }
  if (ioClient2.connected) {
    ioClient2.disconnect()
  }
  done()
})

describe('socket.io test', () => {
  const sender = (eventName, data, targetID) => {
    return targetID ? socket.to(targetID).emit(eventName, data) : socket.emit(eventName, data)
  }
  const broadcast = (eventName, data) => socket.broadcast.emit(eventName, data)
  const userMessagingRepository = new UserMessagingRepository(sender, broadcast)

  test('toAll', (done) => {
    userMessagingRepository.toAll('toAll', 'messaging')

    ioClient1.on('toAll', (data) => {
      // broadcast
      expect(data).toBe('messaging')
    })
    ioClient2.on('toAll', (data) => {
      expect(data).toBe('messaging')
      done()
    })
  })

  test('toOther', (done) => {
    userMessagingRepository.toOther('toOther', 'messaging')

    ioClient1.on('toOther', (data) => {
      expect(data).toBe('messaging')
      done()
    })
  })

  test('toSender', (done) => {
    userMessagingRepository.toSender('toSender', 'messaging')

    ioClient2.on('toSender', (data) => {
      console.log('sender')
      expect(data).toBe('messaging')
      done()
    })
  })

  test('toTarget', (done) => {
    userMessagingRepository.to('toTarget', 'messaging', memberList[0])

    ioClient1.on('toTarget', (data) => {
      console.log('toTarget')
      expect(data).toBe('messaging')
      done()
    })
  })
})
