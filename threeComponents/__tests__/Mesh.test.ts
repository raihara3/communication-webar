import * as THREE from 'three'
import { parseMesh } from '../Mesh'

const geometry = new THREE.BoxGeometry(0.01, 0.01, 0.01)
const material = new THREE.MeshBasicMaterial({color: 0x00ff00})
const mesh = new THREE.Mesh(geometry, material)

describe('parseMesh test', () => {
  test('normal', () => {
    const data = {
      json: mesh.toJSON(),
      position: {
        x: 1,
        y: 0,
        z: -1
      }
    }
    expect(parseMesh(data).type).toEqual(mesh.type)
  })

  test('json is incorrect', () => {
    const data = {
      json: {},
      position: {
        x: 1,
        y: 0,
        z: -1
      }
    }
    expect(() => parseMesh(data)).toThrowError(/parse error/)
  })
})
