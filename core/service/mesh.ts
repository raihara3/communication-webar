import * as THREE from 'three'

export const createMesh = (position: any): THREE.Mesh => {
  const geometry = new THREE.BoxGeometry(0.01, 0.01, 0.01)
  const material = new THREE.MeshBasicMaterial({color: 0x00ff00})
  const mesh = new THREE.Mesh(geometry, material)
  mesh.position.set(
    position.x,
    position.y,
    position.z
  )
  return mesh
}

export const parseMesh = ({ json, position }): THREE.Mesh => {
  const geometryParams = json.geometries[0]
  const materialParams = json.materials[0]

  const geometry = new THREE[geometryParams.type](
    geometryParams.width,
    geometryParams.height,
    geometryParams.depth
  )
  const material = new THREE[materialParams.type]({color: materialParams.color})
  const mesh = new THREE.Mesh(geometry, material)
  mesh.position.set(
    position.x,
    position.y,
    position.z
  )
  return mesh
}