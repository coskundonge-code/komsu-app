/**
 * Mağaza ikon/splash kaynaklarını üretir (capacitor-assets girdisi).
 * Kaynak: public/icon-512.png (PWA ikonu) → resources/icon-only.png (1024,
 * marka yeşili zemin) + resources/splash.png (2732, ortalanmış logo) +
 * resources/splash-dark.png. Sonra: npx @capacitor/assets generate
 *
 * Not: 512→1024 büyütme launch için kabul edilebilir; ilerde tasarımcıdan
 * 1024'lük vektörel ikon gelirse resources/ altındakileri değiştirip
 * yeniden generate etmek yeterli.
 */
const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const BRAND = '#00833e';
const root = path.join(__dirname, '..');
const src = path.join(root, 'public', 'icon-512.png');
const outDir = path.join(root, 'resources');

async function main() {
  if (!fs.existsSync(src)) throw new Error('Kaynak ikon yok: ' + src);
  fs.mkdirSync(outDir, { recursive: true });

  // 1024 ikon: marka zemin + ortalanmış logo (padding'li, maskable güvenli alan)
  const logo820 = await sharp(src).resize(820, 820).png().toBuffer();
  await sharp({ create: { width: 1024, height: 1024, channels: 4, background: BRAND } })
    .composite([{ input: logo820, gravity: 'center' }])
    .png()
    .toFile(path.join(outDir, 'icon-only.png'));
  // capacitor-assets adaptif Android ikonu için foreground/background da kabul eder
  await sharp({ create: { width: 1024, height: 1024, channels: 4, background: { r: 0, g: 0, b: 0, alpha: 0 } } })
    .composite([{ input: logo820, gravity: 'center' }])
    .png()
    .toFile(path.join(outDir, 'icon-foreground.png'));
  await sharp({ create: { width: 1024, height: 1024, channels: 4, background: BRAND } })
    .png()
    .toFile(path.join(outDir, 'icon-background.png'));

  // 2732 splash (açık + koyu aynı: marka zemin, ortada logo)
  const logo512 = await sharp(src).resize(512, 512).png().toBuffer();
  const splash = sharp({ create: { width: 2732, height: 2732, channels: 4, background: BRAND } })
    .composite([{ input: logo512, gravity: 'center' }])
    .png();
  await splash.clone().toFile(path.join(outDir, 'splash.png'));
  await splash.clone().toFile(path.join(outDir, 'splash-dark.png'));

  console.log('OK: resources/ uretildi (icon-only, icon-foreground, icon-background, splash, splash-dark)');
}

main().catch((e) => { console.error(e); process.exit(1); });
