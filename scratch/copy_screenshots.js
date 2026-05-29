const fs = require('fs');
const path = require('path');
const os = require('os');

const home = os.homedir();
const srcDir = path.join(home, '.gemini', 'antigravity-ide', 'brain', '3fd768f8-a506-4ef6-875b-2c3849107f1c');
const destDir = path.join(__dirname, '..', 'public', 'screenshots');

if (!fs.existsSync(destDir)) {
  fs.mkdirSync(destDir, { recursive: true });
}

// Map the six newly uploaded professional screenshots to their repository assets naming structure
const mappings = {
  'media__1779976594949.png': 'workspace_comparison.png',
  'media__1779976619047.png': 'workspace_settings.png',
  'media__1779976634484.png': 'workspace_metrics.png',
  'media__1779976649387.png': 'git_analysis.png',
  'media__1779976670555.png': 'diff_viewer.png',
  'media__1779976756000.png': 'docs_workspace.png'
};

console.log('Starting visual assets migration...');

for (const [src, dest] of Object.entries(mappings)) {
  const srcPath = path.join(srcDir, src);
  const destPath = path.join(destDir, dest);
  if (fs.existsSync(srcPath)) {
    fs.copyFileSync(srcPath, destPath);
    console.log(`Successfully migrated ${src} -> ${dest}`);
  } else {
    console.log(`Source image not found: ${srcPath}`);
  }
}

console.log('Visual assets migration completed successfully.');
