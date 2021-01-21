import redis from 'redis'

class Redis {
  client: redis.RedisClient

  constructor() {
    this.client = redis.createClient()
    this.createHandler()
  }

  private membersKey(roomID: string) {
    return `${roomID}_members`
  }

  private meshsKey(roomID: string) {
    return `${roomID}_meshs`
  }

  private createHandler() {
    this.client.on('connect', ()=> {
      console.log('redis!!!')
    })

    this.client.on('end', () => {
      console.log('end')
    })

    this.client.on('error', (error) => {
      console.log(error)
    })
  }

  addUser(roomID: string, userID: string) {
    this.client.rpush(this.membersKey(roomID), userID)
  }

  removeUser(roomID: string, userID: string) {
    this.client.lrem(this.membersKey(roomID), 0, userID)
  }

  addMesh(roomID: string, mesh: any) {
    this.client.rpush(this.meshsKey(roomID), mesh)
  }

  getMeshs(roomID: string): any {
    return new Promise((resolve, reject) => {
      this.client.lrange(this.meshsKey(roomID), 0, -1, (error, reply) => {
        if(error) {
          reject(error)
          return
        }
        resolve(reply)
      })
    })
  }

  removeAllMesh(roomID: string) {
    this.client.del(this.meshsKey(roomID))
  }
}

export default Redis
