const Passport = artifacts.require('./Passport.sol');
const Global = artifacts.require('./Global.sol');

module.exports = (deployer) => {
  deployer
    .then(() => {
      return deployer.deploy(Passport);
    })
    .then((Passport) => {
      console.log('PASSPORT_CONTRACT_ADDRESS=' + Passport.address);
      return deployer.deploy(Global, Passport.address);
    })
    .then((Global) => {
      console.log('GLOBAL_CONTRACT_ADDRESS=' + Global.address);
    });
};
