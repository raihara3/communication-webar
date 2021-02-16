/* Color palette */

const colors = {
  black: '#323232',
  gray: '#424242'
} as const

export default colors

export type Colors = typeof colors[keyof typeof colors]