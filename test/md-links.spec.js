/*eslint-disable*/
const { mdLinks } = require('../index.js');

describe('mdLinks', () => {
  // it('should...', () => {
  //   console.log('FIX ME!');
  // });
  // it('deberia devolver una promesa', () => {
  //   expect(mdLinks()).toBe(typeof Promise);
  // });
  it('deberia rechazar cuando el path no existe', () => {
    return mdLinks('joce/cursos/noexiste.md').catch((error) => {
      expect(error).toBe('La ruta no existe');
    });
  });
});
