import * as THREE from 'three'

export interface Position {
  x: number
  y: number
  z: number
}

export interface Data {
  json: any
  position: Position
}

export const createMesh = (position: Position): THREE.Mesh => {
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

export const parseMesh = ({ json, position }: Data): THREE.Mesh => {
  if(!json.geometries || !json.materials) {
    throw new Error('parse error. prease pass Mesh.toJSON()')
  }
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

export const createMeshGroup = async(scene: THREE.Scene, dataList: Array<Data>) => {
  if(dataList.length === 0) return
  const group = new THREE.Group()
  await dataList.forEach(data => {
    group.add(parseMesh(data))
  })
  scene.add(group)
}
