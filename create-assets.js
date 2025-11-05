const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

// Créer un SVG simple pour l'icône
const iconSvg = `<?xml version="1.0" encoding="UTF-8"?>
<svg width="1024" height="1024" xmlns="http://www.w3.org/2000/svg">
  <rect width="1024" height="1024" fill="#6200EE"/>
  <text x="512" y="600" font-family="Arial, sans-serif" font-size="200" fill="#FFFFFF" text-anchor="middle" font-weight="bold">Caly</text>
  <circle cx="512" cy="300" r="100" fill="#FFFFFF"/>
</svg>`;

const splashSvg = `<?xml version="1.0" encoding="UTF-8"?>
<svg width="1284" height="2778" xmlns="http://www.w3.org/2000/svg">
  <rect width="1284" height="2778" fill="#6200EE"/>
  <text x="642" y="1500" font-family="Arial, sans-serif" font-size="150" fill="#FFFFFF" text-anchor="middle" font-weight="bold">Caly</text>
  <text x="642" y="1700" font-family="Arial, sans-serif" font-size="50" fill="#FFFFFF" text-anchor="middle">Assistante de vie intelligente</text>
  <circle cx="642" cy="1200" r="150" fill="#FFFFFF"/>
</svg>`;

async function createAssets() {
  // Créer les SVG
  fs.writeFileSync(path.join(__dirname, 'assets', 'icon.svg'), iconSvg);
  fs.writeFileSync(path.join(__dirname, 'assets', 'splash.svg'), splashSvg);
  fs.writeFileSync(path.join(__dirname, 'assets', 'adaptive-icon.svg'), iconSvg);

  console.log('✅ Assets SVG créés');

  // Convertir en PNG
  await sharp(Buffer.from(iconSvg))
    .resize(1024, 1024)
    .png()
    .toFile(path.join(__dirname, 'assets', 'icon.png'));
  
  console.log('✅ icon.png créé (1024x1024)');

  await sharp(Buffer.from(splashSvg))
    .resize(1284, 2778)
    .png()
    .toFile(path.join(__dirname, 'assets', 'splash.png'));
  
  console.log('✅ splash.png créé (1284x2778)');

  await sharp(Buffer.from(iconSvg))
    .resize(1024, 1024)
    .png()
    .toFile(path.join(__dirname, 'assets', 'adaptive-icon.png'));
  
  console.log('✅ adaptive-icon.png créé (1024x1024)');
  console.log('\n🎉 Tous les assets sont prêts!');
}

createAssets().catch(console.error);

