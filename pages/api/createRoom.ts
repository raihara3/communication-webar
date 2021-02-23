import RoomRepository from '../../core/repository/room/RoomRepository'
import CreateRoomService from '../../core/service/room/CreateRoomService'

const createRoomHandler = async(_, res) => {
  const roomRepository = new RoomRepository()
  const roomID = new CreateRoomService(roomRepository).execute()

  res.status(200).json({roomID: roomID})
  res.end()
}

export const config = {
  api: {
    bodyParser: false
  }
}

export default createRoomHandler
