const fs = require('fs');
const path = require('path');

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

// Créer les fichiers
fs.writeFileSync(path.join(__dirname, 'assets', 'icon.svg'), iconSvg);
fs.writeFileSync(path.join(__dirname, 'assets', 'splash.svg'), splashSvg);
fs.writeFileSync(path.join(__dirname, 'assets', 'adaptive-icon.svg'), iconSvg);

console.log('✅ Assets SVG créés avec succès!');
console.log('Note: Pour la production, convertissez ces SVG en PNG avec:');
console.log('  - icon.png (1024x1024)');
console.log('  - splash.png (1284x2778)');
console.log('  - adaptive-icon.png (1024x1024)');
