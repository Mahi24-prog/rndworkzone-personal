const fs = require('fs');
const path = require('path');

function replaceInFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf-8');
  
  const replacements = {
    'bg-surface-container-highest/10': 'bg-black/5',
    'bg-surface-container-highest/20': 'bg-black/5',
    'bg-surface-container-highest/30': 'bg-black/10',
    'bg-surface-container-highest/40': 'bg-black/10',
    'bg-surface-container-highest/50': 'bg-black/10',
    'bg-surface-tint/10': 'bg-black/5',
    'bg-surface-tint/20': 'bg-black/10',
    'bg-surface-tint/30': 'bg-black/10',
    'bg-surface-tint/40': 'bg-black/20',
    'bg-surface-variant/50': 'bg-black/5',
    'hover:bg-surface-container-highest/10': 'hover:bg-black/5',
    'hover:bg-surface-container-highest/20': 'hover:bg-black/5',
    'hover:bg-surface-container-highest/30': 'hover:bg-black/10',
    'hover:bg-surface-container-highest/40': 'hover:bg-black/10',
    'hover:bg-surface-container-highest/50': 'hover:bg-black/10',
    'hover:bg-surface-tint/10': 'hover:bg-black/5',
    'hover:bg-surface-tint/20': 'hover:bg-black/10',
    'hover:bg-surface-tint/30': 'hover:bg-black/10',
    'hover:bg-surface-tint/40': 'hover:bg-black/20',
    'hover:bg-surface-variant/50': 'hover:bg-black/5'
  };

  let newContent = content;
  
  // First, split into words to only match exact Tailwind classes
  const words = newContent.split(/[\s'"`]/);
  let changed = false;

  for (const [oldClass, newClass] of Object.entries(replacements)) {
      // Create a specific regex for each exact class that isn't preceded by dark:
      // We use a negative lookbehind for dark:
      const safeOldClass = oldClass.replace(/\//g, '\\/');
      const regex = new RegExp(`(?<!dark:)\\b${safeOldClass}\\b`, 'g');
      
      if (regex.test(newContent)) {
          newContent = newContent.replace(regex, newClass);
          changed = true;
      }
  }


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
