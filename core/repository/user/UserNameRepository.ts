import redis from 'redis'

class UserNameRepository {
  inner: redis.RedisClient

  constructor() {
    // DB 3: member list
    this.inner = redis.createClient({db: 3})
  }

  add(userID: string, userName: string) {
    this.inner.set(userID, userName)
  }

  remove(userID: string) {
    this.inner.del(userID)
  }
}

export default UserNameRepository
