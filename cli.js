const { mdLinks } = require('./index');
const chalk = require('chalk');

// fn para ver los resultados de los links
function mostrarResultados(resultado, options) {
  // if (options.stats) {
  if (options.stats && !options.validate) {
    mostrarEstadisticas(resultado.stats);
  } else {
    if (!Array.isArray(resultado.links) || resultado.links.length === 0) {
      console.log(
        chalk.yellowBright.italic(
          'No se encontraron archivos md en la ruta proporcionada'
        )
      );
    } else {
      resultado.links.forEach((link) => {
        console.log(chalk.cyanBright.italic('href:'), link.href);
        console.log(chalk.greenBright.italic('text:'), link.text);
        console.log(chalk.blueBright.italic('file:'), link.file);
        if (options.validate) {
          const mensaje =
            link.ok === 'ok' ? chalk.green.italic('✔') : chalk.red.italic('✖');
          console.log(chalk.magenta('Status:'), link.status, mensaje);
        }
        console.log('----------------------');
      });
      if (options.stats && options.validate) {
        mostrarEstadisticas(resultado.stats);
      }
    }
  }
}
// fn mostrar estadisticas
function mostrarEstadisticas(stats) {
  console.log(chalk.cyanBright.italic('Estadísticas'));
  console.log(chalk.greenBright('Total de Links'), stats.total);
  console.log(chalk.greenBright('Links únicos'), stats.unique);
  console.log(chalk.redBright('Links rotos'), stats.broken);
}

// para leer los argumentos de la linea de comando
const rutaIngresada = process.argv[2];

// Obtener las opciones desde los argumentos de línea de comando
const options = {
  validate: process.argv.includes('--validate') || process.argv.includes('--v'),
  stats: process.argv.includes('--stats') || process.argv.includes('--s'),
};

if (!rutaIngresada) {
  console.log(chalk.magenta.italic('Debes ingresar una ruta'));
} else {
  mdLinks(rutaIngresada, options)
    .then((resultado) => {
      mostrarResultados(resultado, options);
    })
    .catch((error) => {
      console.error(chalk.red.italic('Error:', error));
    });
}
