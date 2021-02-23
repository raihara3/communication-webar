import redis from 'redis'
import getUrlParams from '../../src/utils/getUrlParams'
import RoomRepository from '../../core/repository/room/RoomRepository'
import GetRoomService from '../../core/service/room/GetRoomService'

const getRoomHandler = async(req, res) => {
  const params: any = getUrlParams(req.headers.referer)
  const roomID = params?.room
    ? params?.room
    : ''
  if(!roomID) {
    res.status(400).json({message: 'The roomID is not specified.'})
    res.end()
    return
  }

  const roomStorage = redis.createClient({db: 0})
  const roomRepository = new RoomRepository(roomStorage)
  const { hasRoom, remainingTime } = await new GetRoomService(roomRepository).execute(roomID)
  if(!hasRoom) {
    console.log('404')
    res.status(404).json({message: 'This RoomID does not exist.'})
    res.end()
    return
  }

  res.status(200).json({data: {remainingTime: remainingTime}})
  res.end()
}

export const config = {
  api: {
    bodyParser: false
  }
}

export default getRoomHandler
