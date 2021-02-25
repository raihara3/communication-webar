import redis from 'redis'

class UserNameRepository {
  inner: redis.RedisClient

  constructor(inner) {
    // DB 3: member list
    this.inner = inner
  }

  add(userID: string, userName: string) {
    this.inner.setex(userID, 60 * 60 * 24 * 3, userName)
  }

  remove(userID: string) {
    this.inner.del(userID)
  }
}

export default UserNameRepository
