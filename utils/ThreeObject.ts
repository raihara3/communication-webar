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

export const generageScene = async(sceneJson) => {
  if(!sceneJson.geometries) return

  const children = sceneJson.object.children
  const geometriesJson = sceneJson.geometries
  const materialsJson = sceneJson.materials
  const group = new THREE.Group()
  await children.map((child, index) => {
    const geometry = new THREE[geometriesJson[index].type](geometriesJson[index].width, geometriesJson[index].height, geometriesJson[index].depth)
    const material = new THREE[materialsJson[index].type]({color: materialsJson[index].color})
    const mesh = new THREE.Mesh(geometry, material)
    mesh.matrix.fromArray(child.matrix)
    mesh.matrixAutoUpdate = false
    group.add(mesh)
  })
  scene.add(group)
}
