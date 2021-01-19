import * as THREE from 'three'

export const scene = new THREE.Scene()

export const createObject = async(meshs) => {
  if(meshs.length === 0) return

  const group = new THREE.Group()
  await meshs.map(({geometryJson, materialJson, position}) => {
    const geometry = new THREE[geometryJson.type](geometryJson.width, geometryJson.height, geometryJson.depth)
    const material = new THREE[materialJson.type]({color: materialJson.color})
    const mesh = new THREE.Mesh(geometry, material)
    mesh.position.set(
      position.x,
      position.y,
      position.z
    )
    group.add(mesh)
  })
  scene.add(group)
}
