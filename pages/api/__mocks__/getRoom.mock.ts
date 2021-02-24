import { createMocks } from 'node-mocks-http'
import getRoom from '../getRoom'
import RoomRepositoryMock from '../../../core/repository/room/__mocks__/RoomRepository.mock'
import GetRoomService from '../../../core/service/room/GetRoomService'

jest.mock('../getRoom')
const getRoomMock = getRoom as jest.Mock

getRoomMock
.mockImplementationOnce(async() => {
  const { res } = createMocks()
  res.status(500).json({message: 'Database connection error'})
  res.end()
  return res
})
.mockImplementation(async(roomID) => {
  const { res } = createMocks()

  if(!roomID) {
    res.status(400).json({message: 'The roomID is not specified.'})
    res.end()
    return res
  }

  const { hasRoom, remainingTime } = await new GetRoomService(new RoomRepositoryMock()).execute(roomID)
  if(!hasRoom) {
    res.status(404).json({message: 'This RoomID does not exist.'})
    res.end()
    return res
  }
  res.status(200).json({data: {remainingTime: remainingTime}})
  res.end()
  return res
})

export default getRoomMock
