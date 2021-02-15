/* Color palette */

const colors = {
  black: '#323232',
} as const

export default colors

export type Colors = typeof colors[keyof typeof colors]