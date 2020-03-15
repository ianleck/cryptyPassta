const Passport = artifacts.require('./Passport.sol');
const Global = artifacts.require('./Global.sol');

module.exports = deployer => {
  deployer
    .then(() => {
      return deployer.deploy(Passport);
    })
    .then(PassportInstance => {
      console.log(
        'Passport Instance deployed at address = ' + PassportInstance.address
      );
      return deployer.deploy(Global, PassportInstance.address);
    })
    .then(GlobalInstance => {
      console.log(
        'Global Instance deployed at address = ' + GlobalInstance.address
      );
    });
};
