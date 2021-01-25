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
    this.inner.rpush(this.key(roomID), data)
  }

  get(roomID: string): any {
    return new Promise((resolve, reject) => {
      this.inner.lrange(this.key(roomID), 0, -1, (error, reply) => {
        if(error) {
          reject(error)
          return
        }
        resolve(reply)
      })
    })
  }

  delete(roomID: string) {
    this.inner.del(this.key(roomID))
  }
}

export default MeshRepository
