const fs = require('fs');
const path = require('path');
const {
  obtenerRutaAbsoluta,
  esDirectorio,
  encontrarArchivosMdEnDirectorio,
  esArchivoMd,
  encontrarLinksEnArchivo,
  validarLink,
  estadisticas,
} = require('./funciones');
const chalk = require('chalk');

const mdLinks = (ruta, options) => {
  return new Promise((resolve, reject) => {
    // debo identficar si la ruta existe
    if (!fs.existsSync(ruta)) {
      // si no existe la ruta, rechaza la promesa, !es negación
      reject(chalk.red.italic('La ruta ingresada no existe'));
    } else {
      // la ruta es valida, debo verificar si la ruta es absoluta o relativa
      // entonces aqui cambio de relativa a absoluta, y absoluta queda igual
      const rutaAbsoluta = obtenerRutaAbsoluta(ruta);
      // console.log(rutaAbsoluta);

      // la ruta absoluta obtenida, necesito ver si es archivo o directorio y realizar recursividad
      const esUnDirectorio = esDirectorio(rutaAbsoluta);

      if (esUnDirectorio) {
        //si es directorio, buscar recursivamente los archivos md
        const archivosMd = encontrarArchivosMdEnDirectorio(rutaAbsoluta);
        const promises = archivosMd.map(encontrarLinksEnArchivo);

        // unir todos los arrays de links encontrados en los archivos
        Promise.all(promises)
          .then((linksEnArchivos) => {
            const allLinks = linksEnArchivos.flat();
            const calcularEstadisticas = estadisticas(allLinks);

            if (options.validate) {
              // Si options.validate es true, agregar status y ok a cada link
              const promises = allLinks.map((link) => {
                return validarLink(link.href).then((result) => {
                  return {
                    href: link.href,
                    text: link.text,
                    file: link.file,
                    status: result.status,
                    ok: result.ok,
                  };
                });
              });

              Promise.all(promises)
                .then((linksConValidacion) => {
                  // estadisticas
                  // const calcularEstadisticas = estadisticas(linksConValidacion);
                  resolve({
                    links: linksConValidacion,
                    stats: calcularEstadisticas,
                  });
                })
                .catch((error) => reject(error));
            } else {
              // Si options.validate es false, retornar solo href, text y file
              resolve({ links: allLinks, stats: calcularEstadisticas });
            }
          })
          .catch((error) => reject(error));
      } else {
        // si es un archivo, verificar si es md
        if (esArchivoMd(rutaAbsoluta)) {
          const linksEncontrados = encontrarLinksEnArchivo(rutaAbsoluta);
          if (options.validate) {
            // Si options.validate es true, agregar status y ok a cada link
            const promises = linksEncontrados.map((link) => {
              return validarLink(link.href).then((result) => {
                return {
                  href: link.href,
                  text: link.text,
                  file: rutaAbsoluta,
                  status: result.status,
                  ok: result.ok,
                };
              });
            });

            Promise.all(promises)
              .then((linksConValidacion) => {
                // estadisticas
                const calcularEstadisticas = estadisticas(linksConValidacion);
                resolve({
                  links: linksConValidacion,
                  stats: calcularEstadisticas,
                });
              })
              .catch((error) => reject(error));
          } else {
            // Si options.validate es false, retornar solo href, text y file
            resolve({ links: linksEncontrados });
          }
        } else {
          // si no es archivo md devolver array vacio
          resolve({ links: [] });
        }
      }
    }
  });
};

module.exports = {
  mdLinks,
};
