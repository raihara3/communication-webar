import { createMocks } from 'node-mocks-http'
import getRoomMock from '../__mocks__/getRoom.mock'

const createHttpMock = (url) => {
  return createMocks({
    method: 'GET',
    headers: {
      referer: url
    }
  })
}

describe('api/getRoom', () => {
  test('Successfully get expire', async () => {
    const {req, res} = createHttpMock('https://example.com?room=testRoom')
    const response = await new getRoomMock(req, res)
    expect(response._getStatusCode()).toBe(200)
    expect(JSON.parse(response._getData()).data.remainingTime).toBe(72)
  })

  test('The roomID does not exist', async() => {
    const {req, res} = createHttpMock('https://example.com?room=notExist')
    const response = await new getRoomMock(req, res)
    expect(response._getStatusCode()).toBe(404)
  })

  test('Parameter is broken', async () => {
    const {req, res} = createHttpMock('https://example.com?room=')
    const response = await new getRoomMock(req, res)
    expect(response._getStatusCode()).toBe(400)
  })

  test('No roomID is specified', async () => {
    const {req, res} = createHttpMock('https://example.com')
    const response = await new getRoomMock(req, res)
    expect(response._getStatusCode()).toBe(400)
  })
})
