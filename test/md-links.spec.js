const mdLinks = require('../index.js');

describe('mdLinks', () => {
  // it('should...', () => {
  //   console.log('FIX ME!');
  // });
  it('deberia devolver una promesa', () => {
    expect(mdLinks()).toBe(typeof Promise);
  });
});
