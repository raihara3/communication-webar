import redis from 'redis'

class RoomRepository {
  inner: redis.RedisClient

  constructor() {
    // DB 0: room list
    this.inner = redis.createClient({db: 0})
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
}

export default RoomRepository
