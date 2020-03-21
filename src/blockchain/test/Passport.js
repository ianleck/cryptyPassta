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

  it('should add country successfully', async () => {
    try {
      await passportInstance.viewRegisteredCountry.call(accounts[1]);
    } catch (err) {
      assert.ok(/revert/.test(err.message));
      assert.isTrue(
        err.message.includes('[ERROR] No such country has been registered')
      );
      const registeredCountry = await passportInstance.registerCountry(
        accounts[1],
        'SGD'
      );
      assert.equal(
        await passportInstance.viewRegisteredCountry.call(accounts[1]),
        'SGD'
      );
      TruffleAssert.eventEmitted(
        registeredCountry,
        'countryRegistrationSuccess'
      );
      TruffleAssert.eventEmitted(registeredCountry, 'MinterAdded');
    }
  });

  it.only('should add passport successfully', async () => {
    try {
      await passportInstance.viewPassport.call('SGD123');
    } catch (err) {
      assert.ok(/revert/.test(err.message));
      assert.isTrue(
        err.message.includes('[ERROR] No such passport has been created')
      );
      const createdPassport = await passportInstance.createPassport('SGD123');
      const retrievedPassport = await passportInstance.viewPassport.call(
        'SGD123'
      );
      assert.equal(retrievedPassport, 'retrievePassport');
      TruffleAssert.eventEmitted(createdPassport, 'passportCreationSuccess');
      TruffleAssert.eventEmitted(retrievedPassport, 'retrievePassport');
    }
  });
});

