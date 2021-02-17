import redis from 'redis'

class MeshRepository {
  inner: redis.RedisClient

  constructor() {
    // DB 2: mesh list
    this.inner = redis.createClient({db: 2})
  }

  add(roomID: string, data: any) {
    this.inner.rpush(roomID, data)
    this.inner.expire(roomID, 60 * 60 * 24 * 3)
  }

  list(roomID: string): any {
    return new Promise((resolve, reject) => {
      this.inner.lrange(roomID, 0, -1, (error, reply) => {
        if(error) {
          reject(error)
          return
        }
        resolve(reply)
      })
    })
  }

  delete(roomID: string) {
    this.inner.del(roomID)
  }
}

export default MeshRepository
