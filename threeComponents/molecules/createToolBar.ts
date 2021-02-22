import * as THREE from 'three'
import { Color } from 'three'
import { switchAudio } from '../../src/AudioTrack'
import Button from '../atoms/Button'

export const onClickButton = (button) => {
  switch(button.name) {
    case 'mic':
      onClickMic(button)
      break
    case 'exit':
      location.reload()
      break
  }
}

const onClickMic = (mesh) => {
  const enabled = switchAudio()
  if(enabled) {
    mesh.scale.z = 1
    mesh.position.z = basePosition.z + (buttonSize.depth / 2)
  }else {
    mesh.scale.z = 0.5
    mesh.position.z = mesh.position.z - (buttonSize.depth/2)
  }
}

interface ButtonInfo {
  name: string
  color: string
  imgSrc: string
}

const buttonList: Array<ButtonInfo> = [
  {
    name: 'mic',
    color: '#004E9C',
    imgSrc: '/textures/mic.png'
  },
  {
    name: 'exit',
    color: '#9C0000',
    imgSrc: '/textures/exit.png'
  },
]

const buttonSize = {
  width: 0.01,
  height: 0.01,
  depth: 0.005
}

const basePosition = {
  x: 0,
  y: -0.1,
  z: -0.1
}

// const rotateX = 0
const originalMargin = 0.002

const centeringAdjustment = buttonList.length === 1
  ? 0
  : ((buttonSize.width + originalMargin)/2) * (buttonList.length - 1)

export const createToolBar = (scene: THREE.Scene) => {
  if(!buttonList.length) return

  const geometry = new THREE.PlaneGeometry(
    (buttonList.length * buttonSize.width) + ((buttonList.length - 1) * originalMargin) + 0.01,
    buttonSize.height + 0.005
  )
  const material = new THREE.MeshBasicMaterial({
    color: new Color('#ffffff'),
    transparent: true,
    opacity: 0.5
  })
  const panel = new THREE.Mesh(geometry, material)
  panel.position.set(
    basePosition.x,
    basePosition.y,
    basePosition.z
  )
  scene.add(panel)

  buttonList.forEach((item, index) => {
    const margin = index === 0 ? 0 : index * originalMargin
    const button = new Button(item.name, item.color, item.imgSrc, buttonSize).execute()
    button.position.set(
      basePosition.x + (index * buttonSize.width) + margin - centeringAdjustment,
      basePosition.y,
      basePosition.z + (buttonSize.depth / 2)
    )
    scene.add(button)
  })
}
