// Run once: node scripts/generate-icons.cjs
// Requires: npm install canvas
const { createCanvas } = require('canvas')
const fs = require('fs')
const path = require('path')

function generateIcon(size) {
  const canvas = createCanvas(size, size)
  const ctx = canvas.getContext('2d')

  // Background
  ctx.fillStyle = '#000000'
  ctx.fillRect(0, 0, size, size)

  // Green ring
  const cx = size / 2
  const cy = size / 2
  const r = size * 0.36
  ctx.beginPath()
  ctx.arc(cx, cy, r, 0, Math.PI * 2)
  ctx.strokeStyle = '#00e676'
  ctx.lineWidth = size * 0.07
  ctx.stroke()

  // "BW" text
  ctx.fillStyle = '#ffffff'
  ctx.font = `bold ${size * 0.28}px -apple-system, sans-serif`
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.fillText('BW', cx, cy)

  return canvas.toBuffer('image/png')
}

const publicDir = path.join(__dirname, '..', 'public')
fs.mkdirSync(publicDir, { recursive: true })

fs.writeFileSync(path.join(publicDir, 'icon-192.png'), generateIcon(192))
fs.writeFileSync(path.join(publicDir, 'icon-512.png'), generateIcon(512))
fs.writeFileSync(path.join(publicDir, 'apple-touch-icon.png'), generateIcon(180))

console.log('Icons generated in public/')
