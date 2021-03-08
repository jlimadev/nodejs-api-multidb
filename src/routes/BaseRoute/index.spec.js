const BaseRoute = require('.');
const anyClass = jest.fn;
describe('BaseRoute', () => {
  it('Should return a class instance of object', () => {
    const result = new BaseRoute();
    expect(result).toBeInstanceOf(Object);
  });

  it('Should return an array containing the methods of the caller', () => {
    const result = BaseRoute.methods();
    expect(result).toBeInstanceOf(Array);
  });
});
