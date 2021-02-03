export interface Listener {
  id: string
  emit: (eventName, data) => void
  adapter: {
    rooms: {
      has: (id: string) => boolean
    }
  }
}

class UserMessagingRepository {
  listener: any

  constructor(listener: Listener) {
    this.listener = listener
  }

  toAll(eventName, data) {
    this.listener.emit(eventName, data)
    this.listener.broadcast.emit(eventName, data)
  }

  toOther(eventName, data) {
    this.listener.broadcast.emit(eventName, data)
  }

  toSender(eventName, data) {
    this.listener.emit(eventName, data)
  }
}

export default UserMessagingRepository
