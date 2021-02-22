import * as THREE from 'three'
import { Color } from 'three'

class Button {
  name: string
  color: string
  imgSrc: string
  size: {
    width: number
    height: number
    depth: number
  }

  constructor(name, color, imgSrc, size) {
    this.name = name
    this.color = color
    this.imgSrc = imgSrc
    this.size = size
  }

  execute() {
    const geometry = new THREE.BoxGeometry(this.size.width, this.size.height, this.size.depth)
    const colorTexture = new THREE.MeshBasicMaterial({color: new Color(this.color)})
    const material = [
      colorTexture,
      colorTexture,
      colorTexture,
      colorTexture,
      new THREE.MeshBasicMaterial({map: new THREE.TextureLoader().load(this.imgSrc)}),
      colorTexture,
    ]
    const mesh = new THREE.Mesh(geometry, material)
    mesh.name = this.name
    return mesh
  }
}

export default Button
