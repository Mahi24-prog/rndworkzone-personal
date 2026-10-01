const fs = require('fs');
const path = require('path');

function replaceInFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf-8');
  let changed = false;

  // Replace standard 'bg-primary text-white' pattern
  if (content.match(/bg-primary(\s+(hover:[^\s]+\s+)*)text-white(?!\s+dark:bg)/)) {
    content = content.replace(/bg-primary(\s+(?:hover:[^\s]+\s+)*)text-white(?!\s+dark:bg)/g, 'bg-primary $1text-white dark:bg-white/10');
    changed = true;
  }

  // Handle WhyWeExist.jsx specifically for the card
  if (filePath.endsWith('WhyWeExist.jsx')) {
    if (content.includes('bg-primary text-white shadow-2xl')) {
      content = content.replace('bg-primary text-white shadow-2xl', 'bg-primary dark:bg-surface-tint text-white shadow-2xl');
      changed = true;
    }
  }
  
  // Handle AdminRequirementDetails.jsx specifically
  if (filePath.endsWith('AdminRequirementDetails.jsx')) {
      if (content.includes('bg-primary hover:bg-blue-600 text-white')) {
          content = content.replace('bg-primary hover:bg-blue-600 text-white', 'bg-primary hover:bg-blue-600 text-white dark:bg-white/10');
          changed = true;
      }
  }

  if (changed) {
    fs.writeFileSync(filePath, content, 'utf-8');
    console.log(`Updated ${filePath}`);
  }
}

function walkDir(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      walkDir(fullPath);
    } else if (fullPath.endsWith('.jsx') || fullPath.endsWith('.js') || fullPath.endsWith('.tsx') || fullPath.endsWith('.ts')) {
      replaceInFile(fullPath);
    }
  }
}

walkDir(path.join(__dirname, 'src'));
console.log('Replacement complete.');
