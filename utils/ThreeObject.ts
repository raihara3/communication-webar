import * as THREE from 'three'

export const scene = new THREE.Scene()

export const createObject = ({position, geometryJson, materialJson}) => {
  const geometry = new THREE[geometryJson.type](geometryJson.width, geometryJson.height, geometryJson.depth)
  const material = new THREE[materialJson.type]({color: materialJson.color})
  const mesh = new THREE.Mesh(geometry, material)
  mesh.position.set(
    position.x,
    position.y,
    position.z
  )
  scene.add(mesh)
}
