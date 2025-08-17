const cache = new Map<string, string>()

export type PlaceholderOptions = {
  width: number
  height: number
  fontFamily?: string
  accentFontFamily?: string
}

const DEFAULTS: Required<Pick<PlaceholderOptions, 'fontFamily' | 'accentFontFamily'>> = {
  fontFamily: 'Poppins, system-ui, -apple-system, Segoe UI, Roboto, Arial',
  accentFontFamily: 'Pacifico, cursive',
}

export async function generatePlaceholder(name: string, options: PlaceholderOptions): Promise<string> {
  const width = Math.max(120, Math.floor(options.width))
  const height = Math.max(80, Math.floor(options.height))
  const key = `${name}|${width}x${height}`
  const cached = cache.get(key)
  if (cached) return cached

  // Wait for fonts to be ready if supported
  try { await (document as any).fonts?.ready } catch {}

  const canvas = document.createElement('canvas')
  canvas.width = width
  canvas.height = height
  const ctx = canvas.getContext('2d')!

  // Colors aligned to brand theme
  const moss = '#5a7f67'
  const forest = '#2e5e4e'
  const terracotta = '#c6623b'
  const cream = '#f6f1e7'

  // Background gradient
  const grad = ctx.createLinearGradient(0, 0, width, height)
  grad.addColorStop(0, '#e7efe7')
  grad.addColorStop(1, '#f5eae0')
  ctx.fillStyle = grad
  ctx.fillRect(0, 0, width, height)

  // Soft vignette
  const vignette = ctx.createRadialGradient(width * 0.5, height * 0.4, Math.min(width, height) * 0.2, width * 0.5, height * 0.6, Math.max(width, height) * 0.8)
  vignette.addColorStop(0, 'rgba(46,94,78,0.06)')
  vignette.addColorStop(1, 'rgba(46,94,78,0.0)')
  ctx.fillStyle = vignette
  ctx.fillRect(0, 0, width, height)

  // Title text (item name)
  const fontFamily = options.fontFamily ?? DEFAULTS.fontFamily
  const accentFontFamily = options.accentFontFamily ?? DEFAULTS.accentFontFamily
  const titleSize = Math.max(14, Math.min(26, Math.floor(width * 0.08)))
  ctx.font = `600 ${titleSize}px ${fontFamily}`
  ctx.fillStyle = forest
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'

  const lines = wrapText(ctx, name, width * 0.8)
  const totalHeight = lines.length * titleSize * 1.15
  let startY = height / 2 - totalHeight / 2 + titleSize / 2
  lines.forEach(line => {
    ctx.fillText(line, width / 2, startY)
    startY += titleSize * 1.15
  })

  // Brand accent
  const tagSize = Math.max(12, Math.floor(width * 0.045))
  ctx.font = `400 ${tagSize}px ${accentFontFamily}`
  ctx.fillStyle = terracotta
  ctx.fillText('FruitzzUpp', width / 2, height - tagSize * 0.9)

  const dataUrl = canvas.toDataURL('image/webp', 0.8)
  cache.set(key, dataUrl)
  return dataUrl
}

function wrapText(ctx: CanvasRenderingContext2D, text: string, maxWidth: number): string[] {
  const words = text.split(' ')
  const lines: string[] = []
  let current = ''
  for (const word of words) {
    const test = current ? `${current} ${word}` : word
    const width = ctx.measureText(test).width
    if (width <= maxWidth) {
      current = test
    } else {
      if (current) lines.push(current)
      current = word
    }
  }
  if (current) lines.push(current)
  return lines.slice(0, 3)
}


