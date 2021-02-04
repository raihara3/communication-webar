export interface Sender {
  id: string
  emit: (eventName, data) => void
  adapter: {
    rooms: {
      has: (id: string) => boolean
    }
  }
}

// EXAMPLE
new UserMessagingRepository(socket, socket.boradcast)

class UserMessagingRepository {
  listener: Sender
  broadcaster: Sender

  constructor(listener: Listener) {
    this.listener = listener
    this.broadcaster = broadcaster
  }

  toAll(eventName, data) {
    this.listener.emit(eventName, data)
    this.broadcaster.emit(eventName, data)
  }

  toOther(eventName, data) {
    this.broadcaster.emit(eventName, data)
  }

  toSender(eventName, data) {
    this.listener.emit(eventName, data)
  }
}

export default UserMessagingRepository
