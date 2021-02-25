const MemberRepositoryMock = jest.fn((memberStorage) => {
  return {
    add: (roomID: string, socketID: string) => {
      memberStorage[roomID] = Object.keys(memberStorage).length
        ? [...memberStorage[roomID], socketID]
        : [socketID]
    },
    list: (roomID: string) => {
      return memberStorage[roomID]
    },
    remove: (roomID: string, socketID: string) => {
      const memberList = memberStorage[roomID]
      memberStorage[roomID] = memberList.splice(memberList.indexOf(socketID), 1)
    }
  }
})

export default MemberRepositoryMock
