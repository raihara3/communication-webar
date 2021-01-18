import redis from 'redis'

const client:any = redis.createClient()

export const redisHandler = () => {
  client.on('connect', ()=> {
    console.log('redis!!!')
  })

  client.on('end', () => {
    console.log('end')
  })

  client.on('error', (error) => {
    console.log(error)
  })
}

const membersKey = (roomID: string) => `${roomID}_members`
const meshsKey = (roomID: string) => `${roomID}_meshs`

export const onAddUser = (roomID: string, userID: string) => {
  client.rpush(membersKey(roomID), userID)
}

export const onRemoveUser = (roomID: string, userID: string) => {
  client.lrem(membersKey(roomID), 0, userID)
}

export const onAddMesh = (roomID: string, mesh: any) => {
  client.rpush(meshsKey(roomID), mesh)
}

export const onGetScene: any = (roomID: string) => {
  return new Promise((resolve, reject) => {
    client.lrange(meshsKey(roomID), 0, -1, (error, reply) => {
      if(error) {
        reject(error)
        return
      }
      resolve(reply)
    })
  })
}

export const onRemoveAllMesh = (roomID: string) => {
  client.del(meshsKey(roomID))
}
