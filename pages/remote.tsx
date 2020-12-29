import { useEffect } from "react"
import io from 'socket.io-client'

const Remote = () => {
  const connectWebsocket = async() => {
    await fetch('api/socketio')
    const socket = io()

    socket.on('connect', () => {
      socket.emit('add user')
      console.log(`join`)
    })

    socket.on('disconnect', () => {
      console.log('disconnect')
    })

    socket.on('add user', data => {
      console.log(`add user: ${data}`)
    })

    socket.on('get data', data => {
      console.log('get data', data)
    })

    socket.emit('send data', ({
      hoge: 'hoge',
      fuga: 'fuga',
      num: [1,2,3]
    }))
  }

  useEffect(() => {
    connectWebsocket()
  }, [])

  return (
    <>
      <div>remote</div>
    </>
  )
}

export default Remote
