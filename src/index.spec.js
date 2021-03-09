const { handler } = require('.');

describe('application handler', () => {
  beforeAll(() => {
    process.env.NODE_ENV = 'devl';
  });

  it('Should export the handler function', () => {
    expect(handler).toBeInstanceOf(Function);
  });
});
