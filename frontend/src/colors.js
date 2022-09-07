const sectionBgBase = 'bg-gradient-to-tr'
export const sectionBgLogin = `${sectionBgBase} bg-violet-50/50`
export const sectionBgLoginDark = `${sectionBgBase} from-purple-900 via-pink-900 to-red-900`
export const sectionBgError = `${sectionBgBase} from-pink-400 via-red-500 to-yellow-500`
export const sectionBgErrorDark = `${sectionBgBase} from-pink-900 via-red-900 to-yellow-900`

export const colorsBg = {
  white: 'bg-white text-black',
  light: 'bg-violet-100/40 text-black',
  success: 'bg-emerald-600 text-white',
  danger: 'bg-red-600 text-white',
  warning: 'bg-yellow-600 text-white',
  info: 'bg-pavitra-blue text-white',
  default: 'bg-slate-900 text-white'
}

export const colorsBgHover = {
  white: 'hover:bg-gray-50',
  light: 'hover:bg-violet-200/40',
  success: 'hover:bg-emerald-700',
  danger: 'hover:bg-red-700',
  warning: 'hover:bg-yellow-700',
  info: 'hover:bg-pavitra-blue/90',
  default: 'hover:bg-slate-800'
}

export const colorsBorders = {
  white: 'border-gray-300',
  light: 'border-violet-200/40 dark:border-violet-400/40',
  success: 'border-emerald-700',
  danger: 'border-red-700',
  warning: 'border-yellow-700',
  info: 'pavitra-blue',
  default: 'border-slate-900'
}

export const colorsText = {
  white: 'text-black dark:text-gray-100',
  light: 'text-violet-700/40 dark:text-violet-400/40',
  success: 'text-emerald-600',
  danger: 'text-red-600',
  warning: 'text-yellow-600',
  info: 'text-pavitra-blue',
  default: 'text-slate-600'
}

export const colorsOutline = {
  white: [colorsText.white, colorsBorders.white],
  light: [colorsText.light, colorsBorders.light],
  success: [colorsText.success, colorsBorders.success],
  danger: [colorsText.danger, colorsBorders.danger],
  warning: [colorsText.warning, colorsBorders.warning],
  info: [colorsText.info, colorsBorders.info],
  default: [colorsText.default, colorsBorders.default]
}

export const colorsOutlineHover = {
  white: 'hover:bg-gray-100 hover:text-gray-900 dark:hover:text-gray-900',
  light: 'hover:bg-violet-100/40 hover:text-violet-900/40 dark:hover:text-violet-900/40',
  success: 'hover:bg-emerald-700 hover:text-white',
  danger: 'hover:bg-red-700 hover:text-white',
  warning: 'hover:bg-yellow-700 hover:text-white',
  info: 'hover:bg-pavitra-blue hover:text-white',
  default: 'hover:bg-[#D9DBE9] hover:text-white',
}

export const getButtonColor = (color, isOutlined, hasHover) => {
  const base = [
    isOutlined ? colorsText[color] : colorsBg[color],
    colorsBorders[color]
  ]

  if (hasHover) {
    base.push(isOutlined ? colorsOutlineHover[color] : colorsBgHover[color])
  }

  return base
}
