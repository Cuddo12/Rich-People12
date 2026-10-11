import fs from 'fs';

try {
  if (fs.existsSync('dist')) {
    fs.cpSync('dist', 'docs', { recursive: true });
    console.log('Successfully mirrored dist -> docs for GitHub Pages /docs folder deployment.');
  }
} catch (err) {
  console.warn('Could not mirror to docs:', err);
}
