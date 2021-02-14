import RoomRepository from '../../repository/room/RoomRepository'

class GetRoomService {
  roomRepository: RoomRepository

  constructor(roomRepository) {
    this.roomRepository = roomRepository
  }

  async execute(roomID: string) {
    return await !!this.roomRepository.get(roomID)
  }
}

export default GetRoomService
