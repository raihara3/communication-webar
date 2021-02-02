import BroadCaster from '../../src/BroadCaster'

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

  toMyself(eventName, data) {
    this.broadcaster.toMyself(eventName, data)
  }
}

export default UserMessagingRepository
