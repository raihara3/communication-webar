import BroadCaster from '../../entity/BroadCaster'

class UserMessagingRepository {
  broadcaster: BroadCaster

  constructor(me, broadcast) {
    this.broadcaster = new BroadCaster(me, broadcast)
  }

  toAll(eventName, data) {
    this.broadcaster.toAll(eventName, data)
  }

  toOther(eventName, data) {
    this.broadcaster.toOther(eventName, data)
  }

  toSender(eventName, data) {
    this.broadcaster.toSender(eventName, data)
  }
}

export default UserMessagingRepository
