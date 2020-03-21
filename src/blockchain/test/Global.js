const TruffleAssert = require('truffle-assertions');
const Passport = artifacts.require('./Passport.sol');
const Global = artifacts.require('./Global.sol');

contract('Passport', accounts => {
  let globalInstance;
  let platformOwner = accounts[1];
  let countryAacc = accounts[2];
  let countryBacc = accounts[3];
  let workerA = accounts[4];
  let workerB = accounts[5];
  let passportUUID1 = 'A123';
  let passportUUID2 = 'B123';

  before(async () => {
    passportInstance = await Passport.new({
      from: platformOwner
    });
    globalInstance = await Global.new(passportInstance.address, {
      from: platformOwner //set owner of Global
    });
  });

  it('Test case 1: Passport.sol deploys successfully', async () => {
    const address = globalInstance.address;
    assert.notEqual(address, 0x0);
    assert.notEqual(address, '');
    assert.notEqual(address, null);
    assert.notEqual(address, undefined);
  });

  it('Test case 2: Global.sol deploys successfully', async () => {
    const address = passportInstance.address;
    assert.notEqual(address, 0x0);
    assert.notEqual(address, '');
    assert.notEqual(address, null);
    assert.notEqual(address, undefined);
  });

  it('Test case 3: Set up passports for testing', async () => {

    await passportInstance.addNewVerifiedCountry(countryAacc, 'AAA', {
      from: platformOwner
    });

    await passportInstance.addNewVerifiedCountry(countryBacc, 'BBB', {
      from: platformOwner
    });

    await passportInstance.createPassport(passportUUID1, {
      from: countryAacc
    });

    await passportInstance.createPassport(passportUUID2, {
      from: countryBacc
    });

  });

  it('Test case 4: Register New worker under country A and country B', async () => {

    await globalInstance.addNewWorker('workerA', countryAacc, {
      from: platformOwner
    });

    await globalInstance.addNewWorker('workerB', countryBacc, {
      from: platformOwner
    });

    let tx1 = await globalInstance.checkActiveWorker(workerA, {
      from: platformOwner
    });
    let tx2 = await globalInstance.checkActiveWorker(workerB, {
      from: platformOwner
    });
    let tx3 = tx1 && tx2;

    //check result
    assert.equal(
      tx3,
      true,
      'Did not successfully register workers'
    );
    
  });


  it('Test case 5: Send travellers out from both country A and B', async () => {

    //Tourist 1 leaves home country A to Country B and is processed by WorkerA
    globalInstance.travelerDeparture(passportUUID1, [countryBacc], {
      from: workerA
    });

    //Tourist 2 leaves home country B to Country A and is processed by WorkerB
    globalInstance.travelerDeparture(passportUUID2, [countryAacc], {
      from: workerB
    });

    let tx1 = await globalInstance.checkActiveTransfer(passportUUID1, {
      from: platformOwner
    });
    let tx2 = await globalInstance.checkActiveTransfer(passportUUID2, {
      from: platformOwner
    });
    let tx3 = tx1 && tx2;

    //check result
    assert.equal(
      tx3,
      true,
      'Did not successfully register departure of tourists'
    );

  });

  it('Test case 6: Accept Tourist A into Country B', async () => {

    await globalInstance.acceptTraveler(passportUUID1, {
      from: workerB
    });

    let tx1 = await globalInstance.checkActiveTransfer(passportUUID1, {
      from: platformOwner
    });

    //check result
    assert.equal(
      tx1,
      false,
      'Did not successfully Accept Traveler'
    );

  });

  it('Test case 7: Reject Tourist B from entering Country A', async () => {

    await globalInstance.rejectTraveler(passportUUID2, {
      from: workerA
    });

    let tx1 = await globalInstance.checkActiveTransfer(passportUUID2, {
      from: platformOwner
    });

    //check result
    assert.equal(
      tx1,
      true,
      'Did not successfully reject traveler'
    );

  });

  it('Test case 8: Tourist B returns to Country B', async () => {

    await globalInstance.rejectTraveler(passportUUID2, {
      from: workerB
    });

    let tx1 = await globalInstance.checkActiveTransfer(passportUUID2, {
      from: platformOwner
    });

    //check result
    assert.equal(
      tx1,
      false,
      'Did not successfully accept returning traveler'
    );

  });

  it('Test case 9: Deactivate worker B', async () => {

    await globalInstance.updateWorkerStatus(workerB, 'BBB', false, {
      from: countryBacc
    });

    let tx1 = await globalInstance.checkActiveWorker(workerB, {
      from: platformOwner
    });

    //check result
    assert.equal(
      tx1,
      false,
      'Did not successfully deactivate worker'
    );

  });
});
