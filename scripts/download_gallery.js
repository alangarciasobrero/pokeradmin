const fs = require('fs');
const path = require('path');
const https = require('https');

const outDir = path.join(__dirname, '..', 'public', 'images', 'gallery');
if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

const count = 9;
const urls = [];
for (let i = 0; i < count; i++) {
  // Using picsum.photos for random images
  urls.push(`https://picsum.photos/seed/poker${Date.now()}${i}/400/400`);
}

function download(url, dest) {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(dest);
    https.get(url, (res) => {
      res.pipe(file);
      file.on('finish', () => file.close(resolve));
    }).on('error', (err) => {
      fs.unlink(dest, () => reject(err));
    });
  });
}

(async () => {
  for (let i = 0; i < urls.length; i++) {
    const dest = path.join(outDir, `avatar_${i + 1}.jpg`);
    try {
      console.log('Downloading', urls[i]);
      // Picsum redirects, follow once
      await download(urls[i], dest);
      console.log('Saved', dest);
    } catch (e) {
      console.error('Failed', e.message || e);
    }
  }
})();
