import io from 'socket.io-client'
import { scene, createObject, generageScene } from './ThreeObject'

export let socket:any = null

export const socketConnect = async() => {
  await fetch('api/socketio')
  socket = io()

  socket.on('connect', () => handleAddUser())
  socket.on('add user', joinUser)
  socket.on('disconnect', disconnect)
  socket.on('get three mesh', getMeshData)
  socket.on('join', join)
  socket.on('copy scene', handleCopyScene)
  socket.on('get scene', getScene)
}

const handleAddUser = () => {
  socket.emit('add user')
}

const handleCopyScene = (targetId: string) => {
  console.log('owner')
  socket.emit('send scene', {
    targetId: targetId,
    sceneJson: scene.toJSON()
  })
}

export const handleSendMeshData = (data: any) => {
  socket.emit('send three mesh', data)
}

const disconnect = () => {
  console.log('disconnect')
}

const joinUser = (id: string) => {
  console.log(`join user id: ${id}`)
}

const getMeshData = (data: any) => {
  createObject(data)
}

const join = (id: string) => {
  console.log(`my id: ${id}`)
}

const getScene = (sceneJson: any) => {
  generageScene(sceneJson)
}
