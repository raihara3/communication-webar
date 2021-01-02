import * as THREE from 'three'

export const scene = new THREE.Scene()

export const createObject = ({position}) => {
  const geometry = new THREE.BoxGeometry(0.01, 0.01, 0.01)
  const material = new THREE.MeshBasicMaterial({color: 0x00ff00})
  const mesh = new THREE.Mesh(geometry, material)
  mesh.position.set(
    position.x,
    position.y,
    position.z
  )
  scene.add(mesh)
}
