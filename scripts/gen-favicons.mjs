import fs from 'fs';
import path from 'path';
import sharp from 'sharp';

async function generateFaviconsAndOG() {
  const publicDir = path.resolve('public');
  const imagesDir = path.join(publicDir, 'images');

  // 1. Create brand favicon SVG (64x64 square)
  const faviconSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" width="64" height="64">
  <defs>
    <linearGradient id="favBg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#2563A6"/>
      <stop offset="100%" stop-color="#102A43"/>
    </linearGradient>
  </defs>
  <rect width="64" height="64" rx="16" fill="url(#favBg)"/>
  <polygon points="32,13 13,49 51,49" fill="#FFFFFF"/>
  <polygon points="32,23 20,49 44,49" fill="#65B7E8"/>
  <polygon points="41,28 29,49 53,49" fill="#FFD166" opacity="0.95"/>
</svg>`;

  fs.writeFileSync(path.join(publicDir, 'favicon.svg'), faviconSvg, 'utf-8');
  console.log('✓ Created public/favicon.svg');

  const svgBuffer = Buffer.from(faviconSvg);

  // Generate PNG sizes
  await sharp(svgBuffer).resize(16, 16).png().toFile(path.join(publicDir, 'favicon-16x16.png'));
  await sharp(svgBuffer).resize(32, 32).png().toFile(path.join(publicDir, 'favicon-32x32.png'));
  await sharp(svgBuffer).resize(48, 48).png().toFile(path.join(publicDir, 'favicon-48x48.png'));
  await sharp(svgBuffer).resize(180, 180).png().toFile(path.join(publicDir, 'apple-touch-icon.png'));
  await sharp(svgBuffer).resize(192, 192).png().toFile(path.join(publicDir, 'icon-192.png'));
  await sharp(svgBuffer).resize(512, 512).png().toFile(path.join(publicDir, 'icon-512.png'));
  console.log('✓ Created PNG icons (16, 32, 48, 180, 192, 512)');

  // Copy 32x32 as favicon.ico for standard legacy compatibility
  fs.copyFileSync(path.join(publicDir, 'favicon-32x32.png'), path.join(publicDir, 'favicon.ico'));
  console.log('✓ Created public/favicon.ico');

  // 2. Create site.webmanifest
  const webManifest = {
    name: "Malang Batu Outbound",
    short_name: "MBO",
    description: "Layanan Perencanaan dan Fasilitasi Outbound, Gathering & Team Building Profesional di Malang Batu",
    start_url: "/",
    display: "standalone",
    background_color: "#FFFFFF",
    theme_color: "#102A43",
    icons: [
      {
        src: "/icon-192.png",
        sizes: "192x192",
        type: "image/png"
      },
      {
        src: "/icon-512.png",
        sizes: "512x512",
        type: "image/png"
      }
    ]
  };
  fs.writeFileSync(path.join(publicDir, 'site.webmanifest'), JSON.stringify(webManifest, null, 2), 'utf-8');
  console.log('✓ Created public/site.webmanifest');

  // 3. Generate og-default.jpg (1200x630) for Facebook, WhatsApp, LinkedIn, Twitter
  const heroImageSrc = path.join(imagesDir, 'hero-outbound-malang.jpg');
  if (fs.existsSync(heroImageSrc)) {
    await sharp(heroImageSrc)
      .resize(1200, 630, { fit: 'cover', position: 'center' })
      .jpeg({ quality: 90 })
      .toFile(path.join(imagesDir, 'og-default.jpg'));
    console.log('✓ Created public/images/og-default.jpg (1200x630)');
  }
}

generateFaviconsAndOG().catch(console.error);

