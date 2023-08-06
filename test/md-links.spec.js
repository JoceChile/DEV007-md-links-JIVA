const fs = require('fs');
const path = require('path');

const {
  esDirectorio,
  esArchivoMd,
  encontrarArchivosMdEnDirectorio,
  encontrarLinksEnArchivo,
  validarLink,
  obtenerRutaAbsoluta,
  estadisticas,
} = require('../funciones');
const { default: expect } = require('expect');

// test fn obtenerRutaAbsoluta
describe('fn obtenerRutaAbsoluta', () => {
  it('fn obtenerRutaAbsoluta debe devolver ruta absoluta cuando se le pasa una ruta relativa', () => {
    const rutaRelativa = './test';
    const rutaAbsolutaEsperada = path.resolve(rutaRelativa);
    const rutaAbsolutaObtenida = obtenerRutaAbsoluta(rutaRelativa);
    expect(rutaAbsolutaObtenida).toBe(rutaAbsolutaEsperada);
  });
  it('deberia devolver la misma ruta cuando se le pasa ruta absoluta', () => {
    const rutaAbsoluta =
      'C:\\Users\\jocel\\Desktop\\Laboratoria\\Proyectos Codigos Carpetas\\DEV007-md-links-JIVA\\test\\archivosTest\\archivo1.md';
    const rutaAbsolutaObtenida = obtenerRutaAbsoluta(rutaAbsoluta);
    expect(rutaAbsolutaObtenida).toBe(rutaAbsoluta);
  });
});

// fn esDirectorio:::::::::::::::::::::::::::::::::::::::::::::::::::::::
describe('fn esDirectorio', () => {
  it('fn esdirectorio deberia devolver true si la ruta es directorio', () => {
    const rutaDirectorio = './test';
    expect(esDirectorio(rutaDirectorio)).toBe(true);
  });
  it('fn esdirectorio deberia devolver false si la ruta no es directorio', () => {
    const rutaArchivo = './README.md';
    expect(esDirectorio(rutaArchivo)).toBe(false);
  });
});

// fn esArchivoMd:::::::::::::::::::::::::::::::::::::::::::::::::::::::::
describe('fn esArchivoMd', () => {
  it('fn esArchivoMd deberia devolver true si la ruta es un archivo md', () => {
    const rutaArchivoMd = './README.md';
    expect(esArchivoMd(rutaArchivoMd)).toBe(true);
  });
  it('fn esArchivoMd deberia devolver false si la ruta no es un archivo md', () => {
    const rutaArchivoMd = './test';
    expect(esArchivoMd(rutaArchivoMd)).toBe(false);
  });
});

// fn encontrarArchivosMdEnDirectorio::::::::::::::::::::::::::::::::::::::
describe('fn encontrarArchivoMdEnDirectorio', () => {
  it('fn encontrarArchivosMdEnDirectorio deberia devolver una lista de rutas de archivos .md en un directorio', () => {
    const rutaArchivoEsperada = path.join('test', 'archivo1.md');
    const archivosMdEncontrados = encontrarArchivosMdEnDirectorio('./test');
    const rutasNormalizadas = archivosMdEncontrados.map((ruta) =>
      path.relative(process.cwd(), ruta)
    );
    expect(rutasNormalizadas).toEqual(
      expect.arrayContaining([rutaArchivoEsperada])
    );
  });
});

// fn encontrarLinksEnArchivo:::::::::::::::::::::::::::::::::::::::::::::::
describe('fn validarLink', () => {
  it('fn encontrarLinksEnArchivo deberia devolver una lista de links encontrados en un archivo md', () => {
    const rutaArchivoPrueba = path.join('test', 'archivo2.md');
    const contenidoPrueba =
      '[Markdown](https://es.wikipedia.org/wiki/Markdown)\n[Node.js](https://nodejs.org/)';
    fs.writeFileSync(rutaArchivoPrueba, contenidoPrueba);
    const linksEncontrados = encontrarLinksEnArchivo(rutaArchivoPrueba);
    expect(linksEncontrados).toHaveLength(2);
    expect(linksEncontrados).toContainEqual({
      href: 'https://es.wikipedia.org/wiki/Markdown',
      text: 'Markdown',
      file: rutaArchivoPrueba,
    });
    expect(linksEncontrados).toContainEqual({
      href: 'https://nodejs.org/',
      text: 'Node.js',
      file: rutaArchivoPrueba,
    });
    fs.unlinkSync(rutaArchivoPrueba);
  });
});

// fn validarLink::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
describe('fn validarLink', () => {
  it('fn validarLink deberia devolver OK con codigo 200 si el link es valido', () => {
    const url = 'https://es.wikipedia.org/wiki/Markdown';

    return validarLink(url).then((result) => {
      expect(result.status).toBe(200);
      expect(result.ok).toBe('ok');
    });
  });
  it('fn validarLink deberia devolver FAIL con codigo 404 si el link es invalido', () => {
    const url = 'https://ejemplo.co';
    return validarLink(url).then((result) => {
      expect(result.status).toBe(404);
      expect(result.ok).toBe('fail');
    });
  });
});

// fn estadisticas
describe('fn estadisticas', () => {
  it('fn estadisticas deberia devolver el recuento total de links', () => {
    const links = [
      { href: 'https://ejemplo.com/pagina1', ok: 'success' },
      { href: 'https://ejemplo.com/pagina2', ok: 'fail' },
      { href: 'https://ejemplo.com/pagina3', ok: 'success' },
      { href: 'https://ejemplo.com/pagina4', ok: 'fail' },
    ];

    const resultado = estadisticas(links);
    expect(resultado.total).toBe(4);
  });
  it('deberia devolver el recuento de links rotos', () => {
    const links = [
      { href: 'https://ejemplo.com/pagina1', ok: 'success' },
      { href: 'https://ejemplo.com/pagina2', ok: 'fail' },
      { href: 'https://ejemplo.com/pagina3', ok: 'success' },
      { href: 'https://ejemplo.com/pagina4', ok: 'fail' },
    ];

    const resultado = estadisticas(links);
    expect(resultado.broken).toBe(2);
  });
});
