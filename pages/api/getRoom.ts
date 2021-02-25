import redis from 'redis'
import getUrlParams from '../../src/utils/getUrlParams'
import RoomRepository from '../../core/repository/room/RoomRepository'
import GetRoomService from '../../core/service/room/GetRoomService'

const getRoomHandler = async(req, res) => {
  const params: any = getUrlParams(req.headers.referer)
  const roomID = params.room
  if(!roomID) {
    res.status(400).json({message: 'The roomID is not specified.'})
    res.end()
    return
  }

  const roomStorage = redis.createClient()

  const timeout = setTimeout(() => {
    roomStorage.quit()
    res.status(500).json({message: 'Database connection error'})
    res.end()
  }, 2000)
  timeout

  roomStorage.on('connect', async() => {
    clearTimeout(timeout)
    const roomRepository = new RoomRepository(redis.createClient({db: 0}))
    const { hasRoom, remainingTime } = await new GetRoomService(roomRepository).execute(roomID)
    roomStorage.quit()
    if(!hasRoom) {
      res.status(404).json({message: 'This RoomID does not exist.'})
      res.end()
      return
    }
    res.status(200).json({data: {remainingTime: remainingTime}})
    res.end()
  })

  roomStorage.on('error', (e) => console.log(e))

}

export const config = {
  api: {
    bodyParser: false
  }
}

export default getRoomHandler
