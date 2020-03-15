const TruffleAssert = require('truffle-assertions');
const Passport = artifacts.require('./Passport.sol');

contract('Passport', accounts => {
  let passportInstance;

  before(async () => {
    passportInstance = await Passport.deployed();
  });

  it('deploys successfully', async () => {
    const address = passportInstance.address;
    assert.notEqual(address, 0x0);
    assert.notEqual(address, '');
    assert.notEqual(address, null);
    assert.notEqual(address, undefined);
  });
});
