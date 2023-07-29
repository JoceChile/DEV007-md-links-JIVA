const { mdLinks } = require('./index');
// const path = require('path');

// para leer los argumentos de la linea de comando
const rutaIngresada = process.argv[2];

// fn para ver los resultados
function mostrarResultados(ruta, archivosMd) {
  if (archivosMd.length === 0) {
    console.log('No se encontraron archivos md en la ruta proporcionada');
  } else {
    console.log('Arhivos md encontrados');
    archivosMd.forEach((archivo) => console.log(archivo));
  }
}
if (!rutaIngresada) {
  console.log('Debes ingresar una ruta');
} else {
  mdLinks(rutaIngresada)
    .then((archivosMd) => {
      mostrarResultados(rutaIngresada, archivosMd);
    })
    .catch((error) => {
      console.error('No se han encontrado archivos md', error);
    });
}

// Stats
// VALIDATE
// MENSAJE SI LA RUTA NO EXISTE
// referir funcion mdlinks
// CLI command line interface, interfaz de usuario de computadora
// que permite dar instrucciones a algun programa o sist operativo por
// medio de una linea de texto simple
// API application program interface, interfaz de programación de aplicaciones
// implemeta el tipo de comunicación, entre aplicaciones
// instalar librerias marked axios chalk
