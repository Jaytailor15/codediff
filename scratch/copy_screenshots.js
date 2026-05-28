const fs = require('fs');
const path = require('path');
const os = require('os');

const home = os.homedir();
const srcDir = path.join(home, '.gemini', 'antigravity-ide', 'brain', '3fd768f8-a506-4ef6-875b-2c3849107f1c');
const destDir = path.join(__dirname, '..', 'public', 'screenshots');

if (!fs.existsSync(destDir)) {
  fs.mkdirSync(destDir, { recursive: true });
}

const mappings = {
  'media__1779947584144.png': 'main_interface.png',
  'media__1779975572948.png': 'editor_styling.png',
  'media__1779963614240.png': 'theme_engine.png',
  'media__1779974755258.png': 'docs_workspace.png'
};

for (const [src, dest] of Object.entries(mappings)) {
  const srcPath = path.join(srcDir, src);
  const destPath = path.join(destDir, dest);
  if (fs.existsSync(srcPath)) {
    fs.copyFileSync(srcPath, destPath);
    console.log(`Successfully copied ${src} -> ${dest}`);
  } else {
    console.log(`Source image not found: ${srcPath}`);
  }
}
