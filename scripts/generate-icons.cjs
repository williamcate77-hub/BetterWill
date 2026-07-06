// Run once: node scripts/generate-icons.cjs
// Requires: npm install sharp
const sharp = require('sharp')
const fs = require('fs')
const path = require('path')

// Dumbbell on black, tilted for style. Green plates match the app's #00e676 accent.
const DUMBBELL_SVG = `
<svg xmlns="http://www.w3.org/2000/svg" width="512" height="512" viewBox="0 0 512 512">
  <rect width="512" height="512" fill="#000000"/>
  <g transform="rotate(-30 256 256)">
    <rect x="150" y="241" width="212" height="30" rx="15" fill="#ffffff"/>
    <rect x="124" y="176" width="40" height="160" rx="16" fill="#00e676"/>
    <rect x="348" y="176" width="40" height="160" rx="16" fill="#00e676"/>
    <rect x="80" y="204" width="34" height="104" rx="14" fill="#00e676"/>
    <rect x="398" y="204" width="34" height="104" rx="14" fill="#00e676"/>
  </g>
</svg>`

async function generateIcon(size, filename) {
  const buffer = await sharp(Buffer.from(DUMBBELL_SVG))
    .resize(size, size)
    .png()
    .toBuffer()
  fs.writeFileSync(path.join(publicDir, filename), buffer)
}

const publicDir = path.join(__dirname, '..', 'public')
fs.mkdirSync(publicDir, { recursive: true })

Promise.all([
  generateIcon(192, 'icon-192.png'),
  generateIcon(512, 'icon-512.png'),
  generateIcon(180, 'apple-touch-icon.png'),
]).then(() => console.log('Icons generated in public/'))
