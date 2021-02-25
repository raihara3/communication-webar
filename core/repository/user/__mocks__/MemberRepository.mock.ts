const MemberRepositoryMock = jest.fn((storage) => {
  return {
    add: (roomID: string, socketID: string) => {
      storage[roomID] = storage[roomID]
        ? [...storage[roomID], socketID]
        : [socketID]
    },
    list: (roomID: string) => {
      return storage[roomID]
    },
    remove: (roomID: string, socketID: string) => {
      const memberList = storage[roomID]
      storage[roomID] = memberList.splice(memberList.indexOf(socketID), 1)
    }
  }
})

export default MemberRepositoryMock
