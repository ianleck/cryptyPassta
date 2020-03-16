const Passport = artifacts.require('./Passport.sol');
const Global = artifacts.require('./Global.sol');

module.exports = deployer => {
  deployer
    .then(() => {
      return deployer.deploy(Passport);
    })
    .then(Passport => {
      console.log(
        'Passport Instance deployed at address = ' + Passport.address
      );
      return deployer.deploy(Global, Passport.address);
    })
    .then(Global => {
      console.log(
        'Global Instance deployed at address = ' + Global.address
      );
    });
};
