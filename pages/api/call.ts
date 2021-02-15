import { Server } from 'socket.io'
import redis from 'redis'
import getUrlParams from '../../src/utils/getUrlParams'
import UserRepository from '../../core/repository/user/UserRepository'
import MeshRepository from '../../core/repository/mesh/MeshRepository'
import UserMessagingRepository from '../../core/repository/user/UserMessagingRepository'
import RoomRepository from '../../core/repository/room/RoomRepository'
import AddUserService from '../../core/service/user/AddUserService'
import LeaveUserService from '../../core/service/user/LeaveUserService'
import SendMeshService from '../../core/service/mesh/SendMeshService'
import SendPeerOfferService from '../../core/service/peer/SendPeerOfferService'
import SendPeerAnswerService from '../../core/service/peer/SendPeerAnswerService'
import SendIceCandidateService from '../../core/service/peer/SendIceCandidateService'
import GetRoomService from '../../core/service/room/GetRoomService'

const callHandler = async(req, res) => {
  const client = redis.createClient()

  const params: any = getUrlParams(req.headers.referer)
  const roomID = params.room
  if(!roomID) {
    res.status(400).json({message: 'The roomID is not specified.'})
    res.end()
  }

  const roomRepository = new RoomRepository(client)
  const hasRoom = await new GetRoomService(roomRepository).execute(roomID)
  if(!hasRoom) {
    res.status(404).json({message: 'This RoomID does not exist.'})
    res.end()
  }

  if(res.socket.server.io) {
    console.log('socket.io already running')
  }else {
    console.log('*First use, starting socket.io')
    const userRepository = new UserRepository(client)
    const meshRepository = new MeshRepository(client)

    const getMemberList = () => {
      const memberList: Array<string> = []
      io.sockets.adapter.rooms.get(roomID)?.forEach(id => memberList.push(id))
      return memberList
    }

    const io = new Server(res.socket.server)
    io.on('connect', socket => {
      socket.join(roomID)

      const sender = (eventName, data, targetID) => {
        return targetID ? socket.to(targetID).emit(eventName, data) : socket.emit(eventName, data)
      }
      const broadcast = (eventName, data) => socket.broadcast.emit(eventName, data)
      const userMessagingRepository = new UserMessagingRepository(sender, broadcast)
      const memberList = getMemberList()
      new AddUserService(userRepository, meshRepository, userMessagingRepository).execute(roomID, socket.id, memberList)

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

      socket.on('disconnect', () =>{
        const memberList = getMemberList()
        new LeaveUserService(userRepository, meshRepository, userMessagingRepository).execute(roomID, socket.id, memberList)
      })
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

export default callHandler
