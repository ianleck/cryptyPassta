const TruffleAssert = require('truffle-assertions');
const Passport = artifacts.require('./Passport.sol');
const Global = artifacts.require('./Global.sol');

contract('Passport', accounts => {
  let globalInstance;

  before(async () => {
    passportInstance = await Passport.deployed();
    globalInstance = await Global.deployed(passportInstance.address);
  });

  it('deploys successfully', async () => {
    const address = globalInstance.address;
    assert.notEqual(address, 0x0);
    assert.notEqual(address, '');
    assert.notEqual(address, null);
    assert.notEqual(address, undefined);
  });
});
