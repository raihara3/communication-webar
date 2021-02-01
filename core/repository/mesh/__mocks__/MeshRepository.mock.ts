import MeshRepository from '../redis'

jest.mock('../redis')
export const MeshRepositoryMock = MeshRepository as jest.Mock

MeshRepositoryMock.mockImplementationOnce(() => {
  const meshArray: Array<string> = []
  return {
    add: (_: string, data: any) => {
      return meshArray.push(data)
    },
    list: (_: string): any => {
      return new Promise((resolve, _) => {
        resolve(meshArray)
      })
    },
    delete: (_: string) => {
      console.log('0 users')
      return meshArray.splice(0)
    }
  }
})
