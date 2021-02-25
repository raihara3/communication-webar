import redis from 'redis-mock'
import RoomRepository from '../RoomRepository'

const roomID = 'testRoom'

describe('RoomRepository', () => {
  const roomRepository = new RoomRepository(redis.createClient())

  test('add', async() => {
    const res = await roomRepository.add(roomID)
    expect(res).toBe('OK')
  })

  test('get', async() => {
    const res = await roomRepository.get(roomID)
    const date = new Date().toLocaleString("ja-JP", {timeZone: "Asia/Tokyo"}).toString()
    expect(res).toBe(date)
  })

  test('getExpire', async() => {
    const res = await roomRepository.getExpire(roomID)
    expect(Math.floor(res / (60*60))).toBe(71)
  })
})