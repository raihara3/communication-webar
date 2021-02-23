import redis from 'redis'

class RoomRepository {
  inner: redis.RedisClient

  constructor(roomStorage) {
    // DB 0: room list
    this.inner = roomStorage
  }

  add(roomID: string) {
    this.inner.setex(roomID, 60 * 60 * 24 * 3, new Date().toLocaleString("ja-JP", {
      timeZone: "Asia/Tokyo"
    }))
  }

  get(roomID: string) {
    return new Promise((resolve, reject) => {
      this.inner.get(roomID, (error, reply) => {
        if(error) {
          reject(error)
          return
        }
        resolve(reply)
      })
    })
  }

  getExpire(roomID: string): Promise<number> {
    return new Promise((resolve, reject) => {
      this.inner.ttl(roomID, (error, reply) => {
        if(error) {
          reject(error)
          return
        }
        resolve(reply)
      })
    })
  }
}

export default RoomRepository
