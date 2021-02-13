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
    // DB 1: member list
    this.inner.select(1, () => {
      this.inner.rpush(this.key(roomID), userID)
      this.inner.expire(this.key(roomID), 60 * 60 * 24 * 3)
    })
  }

  remove(roomID: string, userID: string) {
    this.inner.select(1, () => {
      this.inner.lrem(this.key(roomID), 0, userID)
    })
  }
}

export default UserRepository
