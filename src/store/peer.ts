const peerList = {}

const peerStore = () => {
  return {
    add: (id: string, data: any) => {
      peerList[id] = data
    },
    get: (id: string) => {
      return peerList[id]
    },
    list: () => {
      return peerList
    },
    del: (id: string) => {
      delete peerList[id]
    }
  }
}

export default peerStore
