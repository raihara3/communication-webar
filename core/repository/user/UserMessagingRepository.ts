export interface Sender {
  (eventName: string, data: any): any
}

class UserMessagingRepository {
  sender: Sender
  broadcaster: Sender

  constructor(sender: Sender, broadcaster: Sender) {
    this.sender = sender
    this.broadcaster = broadcaster
  }

  toAll(eventName, data) {
    this.sender(eventName, data)
    this.broadcaster(eventName, data)
  }

  toOther(eventName, data) {
    this.broadcaster(eventName, data)
  }

  toSender(eventName, data) {
    this.sender(eventName, data)
  }
}

export default UserMessagingRepository
