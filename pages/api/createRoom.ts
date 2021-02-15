import redis from 'redis'
import RoomRepository from '../../core/repository/room/RoomRepository'
import createRoomService from '../../core/service/room/CreateRoomService'

const createRoomHandler = async(_, res) => {
  const client = redis.createClient()

  const roomRepository = new RoomRepository(client)
  const roomID = new createRoomService(roomRepository).execute()

  res.status(200).json({roomID: roomID})
  res.end()
}

export const config = {
  api: {
    bodyParser: false
  }
}

export default createRoomHandler
