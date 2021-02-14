import RoomRepository from '../../repository/room/RoomRepository'

class GetRoomService {
  roomRepository: RoomRepository

  constructor(roomRepository) {
    this.roomRepository = roomRepository
  }

  async execute(roomID: string) {
    const createDate = await this.roomRepository.get(roomID)
    return !!createDate
  }
}

export default GetRoomService
