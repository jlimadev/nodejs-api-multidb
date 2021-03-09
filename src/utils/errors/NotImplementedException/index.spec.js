const NotImplementedException = require('.');

describe('NotImplementedException', () => {
  it('Should be instance of Error', async () => {
    const result = new NotImplementedException();
    expect(result).toBeInstanceOf(Error);
    expect(result.message).toEqual('Not Implemented Exception');
  });
});
