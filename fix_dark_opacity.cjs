const fs = require('fs');
const path = require('path');

function replaceInFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf-8');
  let changed = false;

  // Find all dark:bg-X/Y and replace with dark:bg-white/Y
  const regex = /dark:bg-(surface|surface-tint|surface-container-highest|surface-variant|bg-base)\/(\d+)/g;
  
  const newContent = content.replace(regex, (match, name, opacity) => {
    changed = true;
    return `dark:bg-white/${opacity}`;
  });

  if (changed) {
    fs.writeFileSync(filePath, newContent, 'utf-8');
    console.log(`Updated ${filePath}`);
  }
}

function walkDir(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      walkDir(fullPath);
    } else if (fullPath.endsWith('.jsx') || fullPath.endsWith('.tsx') || fullPath.endsWith('.js')) {
      replaceInFile(fullPath);
    }
  }
}

walkDir(path.join(__dirname, 'src'));
console.log('Replacement complete.');
