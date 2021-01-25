import redis from 'redis'

class UserRepository {
  inner: redis.RedisClient

  constructor(inner) {
    this.inner = inner
  }

  private key(id: string) {
    return `${id}_users`
  }

  add(roomID: string, userID: string) {
    console.log(this.key(roomID))
    this.inner.rpush(this.key(roomID), userID)
  }

  remove(roomID: string, userID: string) {
    this.inner.lrem(this.key(roomID), 0, userID)
  }
}

export default UserRepository
