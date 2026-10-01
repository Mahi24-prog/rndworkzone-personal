const fs = require('fs');
const path = require('path');

function replaceInFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf-8');
  let changed = false;

  // Search for <input ... className="..."> and add dark:text-white dark:placeholder:text-white/40 if missing
  const inputRegex = /<input[^>]+className=["']([^"']+)["'][^>]*>/g;
  content = content.replace(inputRegex, (match, className) => {
    let newClassName = className;
    if (!newClassName.includes('dark:text-white') && !newClassName.includes('text-on-surface')) {
      newClassName += ' text-on-surface dark:text-white';
    } else if (!newClassName.includes('dark:text-white') && newClassName.includes('text-on-surface')) {
      newClassName = newClassName.replace('text-on-surface', 'text-on-surface dark:text-white');
    }

    if (!newClassName.includes('dark:placeholder:text-white/40')) {
      newClassName += ' placeholder:text-slate-muted dark:placeholder:text-white/40';
    }

    if (newClassName !== className) {
      changed = true;
      return match.replace(className, newClassName);
    }
    return match;
  });

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
    } else if (fullPath.endsWith('.jsx') || fullPath.endsWith('.tsx')) {
      replaceInFile(fullPath);
    }
  }
}

walkDir(path.join(__dirname, 'src'));
console.log('Replacement complete.');
