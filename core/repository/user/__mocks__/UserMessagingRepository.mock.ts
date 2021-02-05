import UserMessagingRepository from '../UserMessagingRepository'

jest.mock('../UserMessagingRepository')
const UserMessagingRepositoryMock = UserMessagingRepository as jest.Mock

UserMessagingRepositoryMock.mockImplementationOnce(() => {
  return {
    toAll: (eventName, _) => {
      console.log(`toALL: ${eventName}`)
    },
    toOther: (eventName, _) => {
      console.log(`toOther: ${eventName}`)
    },
    toSender: (eventName,_) => {
      console.log(`toSender: ${eventName}`)
    }
  }
})

export default UserMessagingRepositoryMock
