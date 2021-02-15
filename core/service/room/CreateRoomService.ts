import RoomRepository from '../../repository/room/RoomRepository'

class GetRoomService {
  roomRepository: RoomRepository

  constructor(roomRepository) {
    this.roomRepository = roomRepository
  }

  execute() {
    const roomID = Math.random().toString(36).slice(-10)
    this.roomRepository.add(roomID)
    return roomID
  }
}

export default GetRoomService
