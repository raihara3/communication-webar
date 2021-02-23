import redis from 'redis'
import RoomRepository from '../../core/repository/room/RoomRepository'
import CreateRoomService from '../../core/service/room/CreateRoomService'

const createRoomHandler = async(_, res) => {
  const roomStorage = redis.createClient({db: 0})

  const timeout = setTimeout(() => {
    roomStorage.quit()
    res.status(500).json({message: 'Database connection error'})
    res.end()
  }, 2000)
  timeout

  roomStorage.on('connect', () => {
    clearTimeout(timeout)
    const roomRepository = new RoomRepository(roomStorage)
    const roomID = new CreateRoomService(roomRepository).execute()
    roomStorage.quit()
    res.status(200).json({roomID: roomID})
    res.end()
  })

  roomStorage.on('error', (e) => console.log(e))

}

export const config = {
  api: {
    bodyParser: false
  }
}

export default createRoomHandler
