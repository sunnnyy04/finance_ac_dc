import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';

const files = execSync('find src -name "*.ts"', { encoding: 'utf8' })
  .split('\n')
  .filter(f => f.trim() !== '');

files.forEach(file => {
  const fullPath = path.resolve(file);
  if (!fs.existsSync(fullPath)) return;

  let content = fs.readFileSync(fullPath, 'utf8');
  const regex = /(from\s+["'])(\.\.?\/[^"']+)(["'])/g;

  let newContent = content.replace(regex, (match, p1, p2, p3) => {
    if (p2.endsWith('.js')) return match;

    const fileDir = path.dirname(fullPath);
    const targetPath = path.resolve(fileDir, p2);
    
    if (fs.existsSync(targetPath) && fs.lstatSync(targetPath).isDirectory()) {
        return `${p1}${p2}/index.js${p3}`;
    } else {
        return `${p1}${p2}.js${p3}`;
    }
  });

  if (content !== newContent) {
    fs.writeFileSync(fullPath, newContent);
    console.log(`Updated: ${file}`);
  }
});
