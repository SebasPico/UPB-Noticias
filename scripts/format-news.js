const fs = require('fs');
const path = require('path');

function main() {
  const filePath = path.join(process.cwd(), 'data', 'news.json');
  let raw;
  try {
    raw = fs.readFileSync(filePath, 'utf8');
  } catch (e) {
    console.error('No se pudo leer data/news.json:', e.message);
    process.exit(1);
  }
  let arr;
  try {
    arr = JSON.parse(raw || '[]');
  } catch (e) {
    console.error('JSON inválido en data/news.json:', e.message);
    process.exit(1);
  }
  if (!Array.isArray(arr)) {
    console.error('El contenido de data/news.json no es un arreglo.');
    process.exit(1);
  }

  const keyOrder = ['id','title','students','professor','jornada','subject','content','comments','imageBase64','publishedAt'];
  const cleaned = arr.map((item) => {
    const out = {};
    // Ordenar claves conocidas primero
    for (const k of keyOrder) {
      if (Object.prototype.hasOwnProperty.call(item, k)) {
        let val = item[k];
        // Sanitizar imageBase64: quitar espacios y saltos para evitar falsas "comillas abiertas"
        if (k === 'imageBase64' && typeof val === 'string') {
          val = val.replace(/\s+/g, '');
        }
        out[k] = val;
      }
    }
    // Agregar cualquier otra clave extra al final para no perder datos
    for (const k of Object.keys(item)) {
      if (!Object.prototype.hasOwnProperty.call(out, k)) {
        out[k] = item[k];
      }
    }
    return out;
  });

  try {
    fs.writeFileSync(filePath, JSON.stringify(cleaned, null, 2), 'utf8');
    console.log('Archivo formateado y ordenado correctamente:', filePath);
  } catch (e) {
    console.error('No se pudo escribir data/news.json:', e.message);
    process.exit(1);
  }
}

main();