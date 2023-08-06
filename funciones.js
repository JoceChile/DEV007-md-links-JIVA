const fs = require('fs');
const path = require('path');
const axios = require('axios');

//fn convertir ruta relativa en absoluta
function obtenerRutaAbsoluta(rutaRelativa) {
  return path.isAbsolute(rutaRelativa)
    ? rutaRelativa
    : path.resolve(rutaRelativa);
}

// fn para verificar si la ruta es directorio (devuelve true o false)
function esDirectorio(rutaAbsoluta) {
  return (
    fs.existsSync(rutaAbsoluta) && fs.lstatSync(rutaAbsoluta).isDirectory()
  );
}

// fn para verificar si es archivo md (devuelve true o false)
function esArchivoMd(rutaAbsoluta) {
  return fs.existsSync(rutaAbsoluta) && path.extname(rutaAbsoluta) === '.md';
}

// fn para buscar archivos md en un directorio (recursividad)
function encontrarArchivosMdEnDirectorio(directorio) {
  let archivosMd = [];

  const buscarArchivosMd = (directorioActual) => {
    const archivos = fs.readdirSync(directorioActual);

    archivos.forEach((archivo) => {
      const rutaArchivo = path.join(directorioActual, archivo);
      const esUnDirectorio = fs.statSync(rutaArchivo).isDirectory();

      if (esUnDirectorio == true) {
        buscarArchivosMd(rutaArchivo);
      } else if (esArchivoMd(rutaArchivo)) {
        archivosMd.push(path.resolve(rutaArchivo));
      }
    });
  };
  // console.log(directorio); //ruta absoluta de directorio
  buscarArchivosMd(directorio);

  return archivosMd;
}

// Función para encontrar links en el contenido de un archivo md
function encontrarLinksEnArchivo(rutaArchivo) {
  const contenido = fs.readFileSync(rutaArchivo, 'utf8');
  const linksEncontrados = [];
  const linkRegex = /\[([^\]]+)\]\((http[s]?:\/\/[^\)]+)\)/g;

  let match;
  while ((match = linkRegex.exec(contenido)) !== null) {
    const text = match[1].slice(0, 50);
    const href = match[2];
    linksEncontrados.push({ href, text, file: rutaArchivo }); // inclui atributo file
  }
  return linksEncontrados;
}

// fn para validar link y obtener el código de respuesta HTTP con axios
function validarLink(url) {
  return axios
    .get(url)
    .then((res) => {
      const status = res.status;
      const ok = res.statusText === 'OK' ? 'ok' : 'fail';
      return { status, ok };
    })
    .catch(() => {
      return { status: 404, ok: 'fail' };
    });
}

// fn estadisticas
function estadisticas(links) {
  const totalLinks = links.length;

  //obtener los links unicos, uso un objeto para no duplicar
  const linksUnicos = {};
  links.forEach((link) => {
    linksUnicos[link.href] = true;
  });
  const totalLinksUnicos = Object.keys(linksUnicos).length;

  // filtrar los enlaces rotos
  const linksRotos = links.filter((link) => link.ok === 'fail');
  const totalLinksRotos = linksRotos.length;

  return {
    total: totalLinks,
    unique: totalLinksUnicos,
    broken: totalLinksRotos,
  };
}

module.exports = {
  obtenerRutaAbsoluta,
  esDirectorio,
  encontrarArchivosMdEnDirectorio,
  esArchivoMd,
  encontrarLinksEnArchivo,
  validarLink,
  estadisticas,
};
