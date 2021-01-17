import redis from 'redis'

const client:any = redis.createClient()

const redisHandler = () => {
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

export const handleAddUser = (roomID: string, userID: string) => {
  client.rpush(roomID, userID)
}

export const handleRemoveUser = (roomID: string, userID: string) => {
  client.lrem(roomID, 0, userID)
}

export default redisHandler
