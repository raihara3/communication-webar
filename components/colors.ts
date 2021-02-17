/* Color palette */

const colors = {
  black: '#323232',
  gray: '#424242',
  red: '#d32f2f'
} as const

export default colors

export type Colors = typeof colors[keyof typeof colors]