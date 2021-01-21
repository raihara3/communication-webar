import * as THREE from 'three'

interface Mesh {
  geometryJson: Geometry
  materialJson: Material
  position: Position
}

interface Geometry {
  type: string
  width: number
  height: number
  depth: number
}

interface Material {
  type: string
  color: number
}

interface Position {
  x: number
  y: number
  z: number
}

class ThreeJS {
  insertDomID: string
  scene: THREE.Scene
  renderer: THREE.WebGLRenderer | null
  context: WebGLRenderingContext | null

  constructor(insertDomID: string) {
    this.insertDomID = insertDomID
    this.scene = new THREE.Scene()
    this.renderer = null
    this.context = null
  }

  init() {
    const canvas = document.getElementById(this.insertDomID) as HTMLCanvasElement
    this.context = this.context = canvas.getContext('webgl')
    this.renderer = new THREE.WebGLRenderer({
      canvas: canvas,
      antialias: true,
      alpha: true
    })

    this.renderer.setPixelRatio(window.devicePixelRatio)
    this.renderer.setSize(window.innerWidth, window.innerHeight)
    this.renderer.xr.enabled = true

    const fov = 70
    const near = 0.01
    const far = 20
    const aspect = window.innerWidth / window.innerHeight
    const camera = new THREE.PerspectiveCamera(fov, aspect, near, far)

    window.addEventListener('resize', () => {
      if(!this.renderer) return
      camera.aspect = aspect
      camera.updateProjectionMatrix()
      this.renderer.setSize(window.innerWidth, window.innerHeight)
    }, false)

    const controller = this.renderer.xr.getController(0)
    controller.addEventListener('selectend', () => {
      controller.userData.isSelecting = true
    })

    this.renderer.setAnimationLoop(() => {
      if(!this.renderer) return
      this.renderer.render(this.scene, camera)
    })
  }

  async createMesh(meshs: Array<Mesh>) {
    if(meshs.length === 0) return

    const group = new THREE.Group()
    await meshs.map(({geometryJson, materialJson, position}) => {
      const { mesh } = this.buildMesh(geometryJson, materialJson, position)
      group.add(mesh)
    })
    this.scene.add(group)
  }

  buildMesh(geometryInfo: Geometry, materialInfo: Material, positionInfo: Position) {
    const geometry = new THREE[geometryInfo.type](geometryInfo.width, geometryInfo.height, geometryInfo.depth)
    const material = new THREE[materialInfo.type]({color: materialInfo.color})
    const mesh = new THREE.Mesh(geometry, material)
    mesh.position.set(
      positionInfo.x,
      positionInfo.y,
      positionInfo.z
    )
    return {
      geometry: geometry,
      material: material,
      mesh: mesh
    }
  }
}

export default ThreeJS
