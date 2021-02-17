import redis from 'redis'

class UserRepository {
  inner: redis.RedisClient

  constructor() {
    // DB 1: member list
    this.inner = redis.createClient({db: 1})
  }

  add(roomID: string, userID: string) {
    this.inner.rpush(roomID, userID)
    this.inner.expire(roomID, 60 * 60 * 24 * 3)
  }

  remove(roomID: string, userID: string) {
    this.inner.lrem(roomID, 0, userID)
  }
}

export default UserRepository
