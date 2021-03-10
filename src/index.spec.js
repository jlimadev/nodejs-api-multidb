const { handler, deps } = require('.');

describe.only('application handler', () => {
  it('Should return a promise', () => {
    expect(handler).toBeInstanceOf(Object);
  });

  it('Should return an object with deps', async () => {
    expect(deps).toBeInstanceOf(Object);
    expect(deps.app).toBeInstanceOf(Object);
  });
});
