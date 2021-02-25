import RoomRepository from '../../repository/room/RoomRepository'

class CreateRoomService {
  roomRepository: RoomRepository

  constructor(roomRepository) {
    this.roomRepository = roomRepository
  }

  async execute() {
    const roomID = Math.random().toString(36).slice(-10)
    try {
      await this.roomRepository.add(roomID)
      return roomID
    } catch (error) {
      console.log(error)
      return null
    }
  }
}

export default CreateRoomService
