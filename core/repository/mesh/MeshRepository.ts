import redis from 'redis'

class MeshRepository {
  inner: redis.RedisClient

  constructor(inner) {
    this.inner = inner
  }

  private key(id: string) {
    return `${id}_mesh`
  }

  add(roomID: string, data: any) {
    // DB 2: mesh list
    this.inner.select(2, () => {
      this.inner.rpush(this.key(roomID), data)
      this.inner.expire(this.key(roomID), 60 * 60 * 24 * 3)
    })
  }

  list(roomID: string): any {
    return new Promise((resolve, reject) => {
      this.inner.select(2, () => {
        this.inner.lrange(this.key(roomID), 0, -1, (error, reply) => {
          if(error) {
            reject(error)
            return
          }
          resolve(reply)
        })
      })
    })
  }

  delete(roomID: string) {
    this.inner.del(this.key(roomID))
  }
}

export default MeshRepository
