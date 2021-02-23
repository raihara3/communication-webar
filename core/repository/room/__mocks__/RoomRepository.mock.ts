import RoomRepository from '../RoomRepository'
import MemoryStorage from 'memorystorage'

jest.mock('../RoomRepository')
const RoomRepositoryMock = RoomRepository as jest.Mock

const roomStorage = new MemoryStorage('db0')

RoomRepositoryMock.mockImplementationOnce(() => {
  return {
    add: (roomID: string) => {
      roomStorage.setItem(
        roomID,
        new Date().toLocaleString("ja-JP", {
          timeZone: "Asia/Tokyo"
        }).toString()
      )
    },

    get: (roomID: string): Promise<string> => {
      return new Promise((resolve, _) => {
        resolve(roomStorage.getItem(roomID))
      })
    },

    getExpire: (_: string): Promise<number> => {
      return new Promise((resolve, _) => {
        resolve(60 * 60 * 24 * 3)
      })
    }
  }
})

export default RoomRepositoryMock
