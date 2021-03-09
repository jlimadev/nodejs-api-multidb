const server = require('./app');
// jest.mock('@hapi/hapi');

const makeSut = () => {};

describe('App test suite', () => {
  process.env.NODE_ENV = 'devl';
  it.only('should call the server', async () => {
    const result = await server();
    console.log();
  });
});
