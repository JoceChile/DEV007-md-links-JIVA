const fs = require('fs');
const path = require('path');

// fn para identificar si la ruta es relativa o absoluta

// fn para verificar si la ruta es directorio
function esDirectorio(rutaAbsoluta) {
  return fs.statSync(rutaAbsoluta).isDirectory();
}

// fn para verificar si es archivo md
function esArchivoMd(rutaAbsoluta) {
  return path.extname(rutaAbsoluta) === '.md';
}

// fn para buscar archivos md en un directorio (recursividad)
function encontrarArchivosMdEnDirectorio(rutaDirectorio) {
  const archivosMd = [];
  const archivos = fs.readdirSync(rutaDirectorio);

  archivos.forEach((archivo) => {
    const rutaCompleta = path.join(rutaDirectorio, archivo);
    if (esDirectorio(rutaCompleta)) {
      archivosMd.push(...encontrarArchivosMdEnDirectorio(rutaCompleta));
      // ... sirve para desestructurar los elmentos de un array y agregarlos a otro array uno a uno
    } else if (esArchivoMd(rutaCompleta)) {
      archivosMd.push(rutaCompleta);
    }
  });
  return archivosMd;
}

module.exports = {
  esDirectorio,
  encontrarArchivosMdEnDirectorio,
  esArchivoMd,
};
