const fs = require('fs');
const path = require('path');
const {
  esDirectorio,
  encontrarArchivosMdEnDirectorio,
  esArchivoMd,
} = require('./funciones');

// md links debe tomar dos parametros, la ruta y options (validate y stats)
// md links debe devolver crear una (nueva) promesa que es distinto a consumir una
// Promise toma un callback
// resolve es una funcion un callbakc que pasamos con then
// reject es una función un callbakc que pasamos con cath

//cuando escribo en consola node.js ./readme.md le estoy preguntando especificamente por ese archivo, no otro

const mdLinks = (ruta, options) => {
  return new Promise((resolve, reject) => {
    // debo identficar si la ruta existe
    if (!fs.existsSync(ruta)) {
      // si no existe la ruta, rechaza la promesa, !es negación
      reject('La ruta ingresada no existe');
    } else {
      // la ruta es valida, debo verificar si la ruta es absoluta o relativa
      // entonces aqui cambio de relativa a absoluta, y absoluta queda igual
      const rutaAbsoluta = path.isAbsolute(ruta) ? ruta : path.resolve(ruta);

      // la ruta absoluta obtenida, necesito ver si es archivo o directorio y realizar recursividad
      const esUnDirectorio = esDirectorio(rutaAbsoluta);

      if (esUnDirectorio) {
        //si es directorio, buscar recursivamente los archivos md
        const archivosMd = encontrarArchivosMdEnDirectorio(rutaAbsoluta);
        resolve(archivosMd);
      } else {
        // si es un archivo, verificar si es md
        if (esArchivoMd(rutaAbsoluta)) {
          resolve([rutaAbsoluta]);
        } else {
          // si no es archivo md devolver array vacio
          resolve([]);
        }
      }
    }
  });
};

module.exports = {
  mdLinks,
};
