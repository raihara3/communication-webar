import redis from 'redis'

class RoomRepository {
  inner: redis.RedisClient

  constructor(inner) {
    this.inner = inner
  }

  add(roomID: string) {
    // DB 0: room list
    this.inner.select(0, () => {
      this.inner.set(roomID, new Date().toLocaleString("ja-JP", {
        timeZone: "Asia/Tokyo"
      }))
      this.inner.expire(roomID, 60 * 60 * 24 * 3)
    })
  }

  get(roomID: string) {
    return new Promise((resolve, reject) => {
      this.inner.select(0, () => {
        this.inner.get(roomID, (error, reply) => {
          if(error) {
            reject(error)
            return
          }
          resolve(reply)
        })
      })
    })
  }
}

export default RoomRepository
