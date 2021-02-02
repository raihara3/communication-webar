interface BroadCast {
  emit: (eventName, data) => void
}

class BroadCaster {
  myself: BroadCast
  broadcaster: BroadCast

  constructor(myself, broadcaster) {
    this.myself = myself
    this.broadcaster = broadcaster
  }

  toAll(eventName, data) {
    this.myself.emit(eventName, data)
    this.broadcaster.emit(eventName, data)
  }

  toOther(eventName, data) {
    this.broadcaster.emit(eventName, data)
  }

  toMyself(eventName, data) {
    this.myself.emit(eventName, data)
  }
}

export default BroadCaster
