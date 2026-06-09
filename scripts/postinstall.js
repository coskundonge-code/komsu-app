// Cross-platform postinstall: pdfjs-dist worker ve assets'leri public/ altına kopyalar.
// Linux/macOS/Windows'ta tek komut.
const fs = require('fs')
const path = require('path')

function copyRecursive(src, dest) {
  if (!fs.existsSync(src)) return false
  const stat = fs.statSync(src)
  if (stat.isDirectory()) {
    fs.mkdirSync(dest, { recursive: true })
    for (const entry of fs.readdirSync(src)) {
      copyRecursive(path.join(src, entry), path.join(dest, entry))
    }
  } else {
    fs.mkdirSync(path.dirname(dest), { recursive: true })
    fs.copyFileSync(src, dest)
  }
  return true
}

const ROOT = path.resolve(__dirname, '..')
const PDFJS = path.join(ROOT, 'node_modules', 'pdfjs-dist')

const tasks = [
  { src: path.join(PDFJS, 'build', 'pdf.worker.min.mjs'), dest: path.join(ROOT, 'public', 'pdf.worker.min.mjs') },
  { src: path.join(PDFJS, 'cmaps'),          dest: path.join(ROOT, 'public', 'cmaps') },
  { src: path.join(PDFJS, 'standard_fonts'), dest: path.join(ROOT, 'public', 'standard_fonts') },
]

for (const t of tasks) {
  try {
    if (copyRecursive(t.src, t.dest)) {
      console.log(`[postinstall] copied ${path.relative(ROOT, t.src)} -> ${path.relative(ROOT, t.dest)}`)
    } else {
      console.log(`[postinstall] skipped (source missing): ${path.relative(ROOT, t.src)}`)
    }
  } catch (err) {
    console.warn(`[postinstall] copy failed for ${t.src}:`, err.message)
  }
}
