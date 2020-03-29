const TruffleAssert = require("truffle-assertions");
const Passport = artifacts.require("./Passport.sol");
const Global = artifacts.require("./Global.sol");

contract.only("Global", accounts => {
  let globalInstance;
  let platformOwner = accounts[0];
  let countryAacc = accounts[1];
  let countryBacc = accounts[2];
  let workerA = accounts[3];
  let workerB = accounts[4];
  let passportUUID1 = "AAA123";
  let passportUUID2 = "BBB123";

  before(async () => {
    passportInstance = await Passport.deployed();
    globalInstance = await Global.deployed();
    //console.log("Global : " + globalInstance.address);
  });

  it("Test case 1: Passport.sol deploys successfully", async () => {
    const address = passportInstance.address;
    assert.notEqual(address, 0x0);
    assert.notEqual(address, "");
    assert.notEqual(address, null);
    assert.notEqual(address, undefined);
    //console.log(passportInstance.address);
  });

  it("Test case 2: Global.sol deploys successfully", async () => {
    const address = globalInstance.address;
    assert.notEqual(address, 0x0);
    assert.notEqual(address, "");
    assert.notEqual(address, null);
    assert.notEqual(address, undefined);
    //console.log(globalInstance.address);
  });

  it("Test case 3: Set up passports for testing", async () => {
    const registeredCountryA = await passportInstance.registerCountry(
      countryAacc,
      "AAA",
      {
        from: platformOwner
      }
    );
    TruffleAssert.eventEmitted(
      registeredCountryA,
      "countryRegistrationSuccess"
    );

    const registeredCountryB = await passportInstance.registerCountry(
      countryBacc,
      "BBB",
      {
        from: platformOwner
      }
    );
    TruffleAssert.eventEmitted(
      registeredCountryB,
      "countryRegistrationSuccess"
    );

    const aPassport = await passportInstance.createPassport(passportUUID1, {
      from: countryAacc
    });
    TruffleAssert.eventEmitted(aPassport, "passportCreationSuccess");

    const bPassport = await passportInstance.createPassport(passportUUID2, {
      from: countryBacc
    });
    TruffleAssert.eventEmitted(bPassport, "passportCreationSuccess");
  });

  it("Test case 4: Register New worker under country A and country B", async () => {
    //console.log("A address: " + workerA);
    //console.log(await passportInstance.checkVerifiedCountry(countryAacc));
    let aWorker = await globalInstance.addNewWorker("workerAAA", workerA, {
      from: countryAacc
    });
    //console.log("Country A: " + countryAacc);
    //console.log("a log: " + aWorker);
    TruffleAssert.eventEmitted(aWorker, "workerRegistered");

    //console.log("Here 2");
    let bWorker = await globalInstance.addNewWorker("workerBBB", workerB, {
      from: countryBacc
    });
    //console.log("b log: " + bworker);

    TruffleAssert.eventEmitted(bWorker, "workerRegistered");
  });

  it("Test case 5: Send travellers out from both country A and B", async () => {
    //Tourist 1 leaves home country A to Country B and is processed by WorkerA
    try {
      let listforA = [countryBacc];
      let aDepart = await globalInstance.travelerDeparture(
        passportUUID1,
        listforA,
        {
          from: countryAacc
        }
      );
      //console.log("A Departs: " + aDepart.eventEmitted);

      TruffleAssert.eventEmitted(aDepart, "departure");

      let listforB = [countryAacc];
      //Tourist 2 leaves home country B to Country A and is processed by WorkerB
      let bDepart = await globalInstance.travelerDeparture(
        passportUUID2,
        listforB,
        {
          from: countryBacc
        }
      );

      //console.log("B Departs: " + bDepart.eventEmitted);

      TruffleAssert.eventEmitted(bDepart, "departure");

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
        "Did not successfully register departure of tourists"
      );
    } catch (e) {
      console.log(e);
    }
  });

  it("Test case 6: Accept Tourist A into Country B", async () => {
    let aArrive = await globalInstance.acceptTraveler(passportUUID1, {
      from: countryBacc //workerB
    });

    let tx1 = await globalInstance.checkActiveTransfer(passportUUID1, {
      from: platformOwner
    });

    //check result
    assert.equal(tx1, false, "Did not successfully Accept Traveler");
    TruffleAssert.eventEmitted(aArrive, "arrival");
  });

  it("Test case 7: Reject Tourist B from entering Country A", async () => {
    let bReject = await globalInstance.rejectTraveler(passportUUID2, {
      from: countryAacc //workerA
    });

    let tx1 = await globalInstance.checkActiveTransfer(passportUUID2, {
      from: platformOwner
    });

    //check result
    assert.equal(tx1, true, "Did not successfully reject traveler");
    TruffleAssert.eventEmitted(bReject, "rejection");
  });

  it("Test case 8: Tourist B returns to Country B", async () => {
    let bArrive = await globalInstance.acceptTraveler(passportUUID2, {
      from: countryBacc //workerB
    });

    let tx1 = await globalInstance.checkActiveTransfer(passportUUID2, {
      from: platformOwner
    });

    //check result
    assert.equal(tx1, false, "Did not successfully accept returning traveler");
    TruffleAssert.eventEmitted(bArrive, "arrival");
  });

  it("Test case 9: Deactivate worker B", async () => {
    await globalInstance.updateWorkerStatus(workerB, "BBB", false, {
      from: countryBacc
    });

    let tx1 = await globalInstance.checkActiveWorker(workerB, {
      from: platformOwner
    });

    //check result
    assert.equal(tx1, false, "Did not successfully deactivate worker");
  });
});
