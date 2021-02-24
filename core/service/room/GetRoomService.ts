import RoomRepository from '../../repository/room/RoomRepository'

class GetRoomService {
  roomRepository: RoomRepository

  constructor(roomRepository) {
    this.roomRepository = roomRepository
  }

  async execute(roomID: string) {
    const createDate = await this.roomRepository.get(roomID)
    const expire = await this.roomRepository.getExpire(roomID)
    const remainingTime = expire > 0
      ? expire / (60 * 60)
      : expire
    return {
      hasRoom: !!createDate,
      remainingTime: Math.floor(remainingTime)
    }
  }
}

export default GetRoomService
