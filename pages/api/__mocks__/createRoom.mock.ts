import { createMocks } from 'node-mocks-http'
import createRoomHandler from '../createRoom'
import RoomRepositoryMock from '../../../core/repository/room/__mocks__/RoomRepository.mock'
import CreateRoomService from '../../../core/service/room/CreateRoomService'

jest.mock('../createRoom')
const createRoomHandlerMock = createRoomHandler as jest.Mock

createRoomHandlerMock
.mockImplementation(async() => {
  const { res } = createMocks()
  const roomID = await new CreateRoomService(new RoomRepositoryMock()).execute()
  if(!roomID) {
    res.status(500).json({message: 'Database connection error'})
    res.end()
    return res
  }
  res.status(200).json({roomID: roomID})
  res.end()
  return res
})

export default createRoomHandlerMock
