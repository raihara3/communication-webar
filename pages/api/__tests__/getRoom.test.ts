import getRoomMock from '../__mocks__/getRoom.mock'

describe('api/getRoom', () => {
  test('Database connection error', async () => {
    const res = await new getRoomMock('testRoom')
    expect(res._getStatusCode()).toBe(500)
  })

  test('Successfully get expire', async () => {
    const res = await new getRoomMock('testRoom')
    expect(res._getStatusCode()).toBe(200)
    expect(JSON.parse(res._getData()).data.remainingTime).toBe(72)
  })

  test('The roomID does not exist', async() => {
    const res = await new getRoomMock('notExist')
    expect(res._getStatusCode()).toBe(404)
  })

  test('No roomID is specified', async () => {
    const res = await new getRoomMock('')
    expect(res._getStatusCode()).toBe(400)
  })
})
