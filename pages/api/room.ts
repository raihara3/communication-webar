import { Server } from 'socket.io'
import redis from 'redis'
import UserRepository from '../../core/repository/user/UserRepository'
import MeshRepository from '../../core/repository/mesh/MeshRepository'
import UserMessagingRepository from '../../core/repository/user/UserMessagingRepository'
import AddUserService from '../../core/service/AddUserService'
import LeaveUserService from '../../core/service/LeaveUserService'
import SendMeshService from '../../core/service/SendMeshService'
import SendPeerOfferService from '../../core/service/SendPeerOfferService'
import SendPeerAnswerService from '../../core/service/SendPeerAnswerService'
import SendIceCandidateService from '../../core/service/SendIceCandidateService'

const roomHandler = (_, res) => {
  // TODO: change to the RoomID
  const roomID = 'testRoom'
  if(!roomID) {
    res.status(400).json({message: 'The roomID is not specified.'})
    res.end()
  }

  if(res.socket.server.io) {
    console.log('socket.io already running')
  }else {
    console.log('*First use, starting socket.io')
    const client = redis.createClient()
    const userRepository = new UserRepository(client)
    const meshRepository = new MeshRepository(client)

    const io = new Server(res.socket.server)

    io.on('connect', socket => {
      const sender = (eventName, data, targetID) => {
        return targetID ? socket.to(targetID).emit(eventName, data) : socket.emit(eventName, data)
      }
      const broadcast = (eventName, data) => socket.broadcast.emit(eventName, data)
      const userMessagingRepository = new UserMessagingRepository(sender, broadcast)
      new AddUserService(userRepository, meshRepository, userMessagingRepository).execute(roomID, socket.id)

      socket.join(roomID)

      socket.on('sendMesh', data =>
        new SendMeshService(userRepository, meshRepository, userMessagingRepository).execute(roomID, data)
      )

      socket.on('sendPeerOffer', data => {
        new SendPeerOfferService(userMessagingRepository).execute(data)
      })

      socket.on('sendPeerAnswer', data => {
        new SendPeerAnswerService(userMessagingRepository).execute(data)
      })

      socket.on('sendIceCandidate', data => {
        new SendIceCandidateService(userMessagingRepository).execute(data)
      })

      socket.on('disconnect', () =>
        new LeaveUserService(userRepository, meshRepository, userMessagingRepository).execute(roomID, socket.id, socket.adapter.rooms.has(roomID))
      )
    })
    res.socket.server.io = io
  }
  res.end()
}

export const config = {
  api: {
    bodyParser: false
  }
}

export default roomHandler
