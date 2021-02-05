import MeshRepository from '../MeshRepository'

jest.mock('../MeshRepository')
const MeshRepositoryMock = MeshRepository as jest.Mock

MeshRepositoryMock.mockImplementationOnce(() => {
  const meshArray: Array<string> = []
  return {
    add: (_: string, data: any) => {
      meshArray.push(data)
    },
    list: (_: string): any => {
      new Promise((resolve, _) => {
        resolve(meshArray)
      })
    },
    delete: (_: string) => {
      console.log('0 users')
      meshArray.splice(0)
    }
  }
})

export default MeshRepositoryMock
