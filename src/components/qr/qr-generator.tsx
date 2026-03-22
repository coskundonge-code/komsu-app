'use client'

import { useEffect, useRef } from 'react'

interface QRGeneratorProps {
  data: string
  size?: number
  className?: string
  fgColor?: string
  bgColor?: string
}

export default function QRGenerator({
  data, size = 200, className = '', fgColor = '#000000', bgColor = '#ffffff',
}: QRGeneratorProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    if (!canvasRef.current || !data) return
    generateQR(canvasRef.current, data, size, fgColor, bgColor)
  }, [data, size, fgColor, bgColor])

  return (
    <canvas ref={canvasRef} width={size} height={size} className={className} style={{ imageRendering: 'pixelated' }} />
  )
}

function generateQR(canvas: HTMLCanvasElement, data: string, size: number, fg: string, bg: string) {
  const ctx = canvas.getContext('2d')
  if (!ctx) return
  const moduleCount = 25
  const moduleSize = Math.floor(size / moduleCount)
  const offset = Math.floor((size - moduleSize * moduleCount) / 2)
  ctx.fillStyle = bg
  ctx.fillRect(0, 0, size, size)
  const hash = simpleHash(data)
  const bits = hashToBits(hash, moduleCount * moduleCount)
  ctx.fillStyle = fg
  for (let row = 0; row < moduleCount; row++) {
    for (let col = 0; col < moduleCount; col++) {
      if (isFinderPattern(row, col, moduleCount)) { drawFinderModule(ctx, row, col, moduleCount, moduleSize, offset, fg, bg); continue }
      if (isAlignmentPattern(row, col, moduleCount)) { drawAlignmentModule(ctx, row, col, moduleCount, moduleSize, offset, fg); continue }
      if (row === 6 || col === 6) { if ((row + col) % 2 === 0) { ctx.fillStyle = fg; ctx.fillRect(offset + col * moduleSize, offset + row * moduleSize, moduleSize, moduleSize) } continue }
      const bitIndex = row * moduleCount + col
      if (bits[bitIndex % bits.length]) { ctx.fillStyle = fg; ctx.fillRect(offset + col * moduleSize, offset + row * moduleSize, moduleSize, moduleSize) }
    }
  }
}

function isFinderPattern(row: number, col: number, n: number): boolean {
  if (row < 8 && col < 8) return true
  if (row < 8 && col >= n - 8) return true
  if (row >= n - 8 && col < 8) return true
  return false
}

function drawFinderModule(ctx: CanvasRenderingContext2D, row: number, col: number, n: number, ms: number, offset: number, fg: string, bg: string) {
  let startRow = 0, startCol = 0
  if (row < 8 && col < 8) { startRow = 0; startCol = 0 }
  else if (row < 8 && col >= n - 8) { startRow = 0; startCol = n - 7 }
  else { startRow = n - 7; startCol = 0 }
  const lr = row - startRow, lc = col - startCol
  if (lr < 7 && lc < 7) {
    const isOuter = lr === 0 || lr === 6 || lc === 0 || lc === 6
    const isInner = lr >= 2 && lr <= 4 && lc >= 2 && lc <= 4
    ctx.fillStyle = (isOuter || isInner) ? fg : bg
    ctx.fillRect(offset + col * ms, offset + row * ms, ms, ms)
  }
}

function isAlignmentPattern(row: number, col: number, n: number): boolean {
  const center = n - 9
  return Math.abs(row - center) <= 2 && Math.abs(col - center) <= 2
}

function drawAlignmentModule(ctx: CanvasRenderingContext2D, row: number, col: number, n: number, ms: number, offset: number, fg: string) {
  const center = n - 9
  const dist = Math.max(Math.abs(row - center), Math.abs(col - center))
  if (dist === 0 || dist === 2) { ctx.fillStyle = fg; ctx.fillRect(offset + col * ms, offset + row * ms, ms, ms) }
}

function simpleHash(str: string): number[] {
  const result: number[] = []
  let h = 0
  for (let i = 0; i < str.length; i++) { h = ((h << 5) - h + str.charCodeAt(i)) | 0; result.push(Math.abs(h) % 256) }
  while (result.length < 32) { h = ((h << 5) - h + result.length) | 0; result.push(Math.abs(h) % 256) }
  return result
}

function hashToBits(hash: number[], count: number): boolean[] {
  const bits: boolean[] = []
  for (let i = 0; i < count; i++) { bits.push(((hash[i % hash.length] >> (i % 8)) & 1) === 1) }
  return bits
}
