const fs = require('fs');
const path = require('path');

function ensureDir(dir) {
  fs.mkdirSync(dir, { recursive: true });
}

function guessExtFromBase64(b64) {
  // No tenemos prefijo mime; por defecto usamos jpg
  // Si detectamos encabezados PNG/GIF, ajustamos
  try {
    const buf = Buffer.from(b64, 'base64');
    // PNG header: 89 50 4E 47
    if (buf.length >= 4 && buf[0] === 0x89 && buf[1] === 0x50 && buf[2] === 0x4E && buf[3] === 0x47) return 'png';
    // GIF header: 47 49 46 38
    if (buf.length >= 4 && buf[0] === 0x47 && buf[1] === 0x49 && buf[2] === 0x46 && buf[3] === 0x38) return 'gif';
    // JPEG header: FF D8
    if (buf.length >= 2 && buf[0] === 0xFF && buf[1] === 0xD8) return 'jpg';
  } catch {}
  return 'jpg';
}

function safeName(name) {
  return String(name)
    .toLowerCase()
    .replace(/[^a-z0-9_-]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

function main() {
  const dataPath = path.join(process.cwd(), 'data', 'news.json');
  const imagesDir = path.join(process.cwd(), 'public', 'images');
  ensureDir(imagesDir);

  const raw = fs.readFileSync(dataPath, 'utf8');
  const arr = JSON.parse(raw || '[]');
  if (!Array.isArray(arr)) {
    throw new Error('data/news.json debe contener un arreglo');
  }

  const updated = arr.map((item, idx) => {
    if (typeof item.imageBase64 === 'string' && item.imageBase64.length > 0) {
      const b64 = item.imageBase64.replace(/\s+/g, '');
      const ext = guessExtFromBase64(b64);
      const base = item.id ? `news-${item.id}` : `news-${Date.now()}-${idx}`;
      const filename = `${safeName(base)}.${ext}`;
      const outPath = path.join(imagesDir, filename);
      try {
        fs.writeFileSync(outPath, Buffer.from(b64, 'base64'));
        item.imageFilename = filename;
      } catch (e) {
        console.error('Error guardando imagen', outPath, e.message);
      }
      delete item.imageBase64;
    }
    return item;
  });

  fs.writeFileSync(dataPath, JSON.stringify(updated, null, 2), 'utf8');
  console.log('Migración completa. Imágenes escritas en', imagesDir);
}

main();