const TruffleAssert = require("truffle-assertions");
const Passport = artifacts.require("./Passport.sol");
const Global = artifacts.require("./Global.sol");

contract("Global", (accounts) => {
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

  it("Test case 3: Link Global.sol to Passport.sol", async () => {
    await passportInstance.setGlobalAddress(globalInstance.address, {
      from: platformOwner,
    });

    let result = await passportInstance.checkGlobalAddress({
      from: platformOwner,
    });

    //console.log(result);

    assert.equal(result, globalInstance.address);
  });

  it("Test case 4: Set up passports for testing", async () => {
    const registeredCountryA = await passportInstance.registerCountry(
      countryAacc,
      "AAA",
      {
        from: platformOwner,
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
        from: platformOwner,
      }
    );
    TruffleAssert.eventEmitted(
      registeredCountryB,
      "countryRegistrationSuccess"
    );

    const aPassport = await passportInstance.createPassport(passportUUID1, {
      from: countryAacc,
    });
    TruffleAssert.eventEmitted(aPassport, "passportCreationSuccess");

    const bPassport = await passportInstance.createPassport(passportUUID2, {
      from: countryBacc,
    });
    TruffleAssert.eventEmitted(bPassport, "passportCreationSuccess");
  });

  it("Test case 5: Register New worker under country A and country B", async () => {
    //console.log("A address: " + workerA);
    //console.log(await passportInstance.checkVerifiedCountry(countryAacc));
    let aWorker = await globalInstance.addNewWorker("workerAAA", workerA, {
      from: countryAacc,
    });
    //console.log("Country A: " + countryAacc);
    //console.log("a log: " + aWorker);
    TruffleAssert.eventEmitted(aWorker, "workerRegistered");

    //console.log("Here 2");
    let bWorker = await globalInstance.addNewWorker("workerBBB", workerB, {
      from: countryBacc,
    });
    //console.log("b log: " + bworker);

    TruffleAssert.eventEmitted(bWorker, "workerRegistered");
  });

  it("Test case 6: Send travellers out from both country A and B", async () => {
    //Tourist 1 leaves home country A to Country B and is processed by WorkerA
    try {
      let listforA = [countryBacc];
      let aDepart = await globalInstance.travelerDeparture(
        passportUUID1,
        listforA,
        {
          from: workerA,
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
          from: workerB,
        }
      );

      //console.log("B Departs: " + bDepart.eventEmitted);

      TruffleAssert.eventEmitted(bDepart, "departure");

      let tx1 = await globalInstance.checkActiveTransfer(passportUUID1, {
        from: countryAacc,
      });

      //console.log("Tx1 = " + tx1);

      let tx2 = await globalInstance.checkActiveTransfer(passportUUID2, {
        from: countryBacc,
      });

      //console.log("Tx2 = " + tx2);

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

  it("Test case 7: Accept Tourist A into Country B", async () => {
    let aArrive = await globalInstance.acceptTraveler(passportUUID1, {
      from: workerB, //workerB
    });

    let tx1 = await globalInstance.checkActiveTransfer(passportUUID1, {
      from: countryBacc,
    });

    //check result
    assert.equal(tx1, false, "Did not successfully Accept Traveler");
    TruffleAssert.eventEmitted(aArrive, "arrival");
  });

  it("Test case 8: Reject Tourist B from entering Country A", async () => {
    let bReject = await globalInstance.rejectTraveler(passportUUID2, {
      from: workerA, //workerA
    });

    let tx1 = await globalInstance.checkActiveTransfer(passportUUID2, {
      from: countryAacc,
    });

    //check result
    assert.equal(tx1, true, "Did not successfully reject traveler");
    TruffleAssert.eventEmitted(bReject, "rejection");
  });

  it("Test case 9: Tourist B returns to Country B", async () => {
    let bArrive = await globalInstance.acceptTraveler(passportUUID2, {
      from: workerB, //workerB
    });

    let tx1 = await globalInstance.checkActiveTransfer(passportUUID2, {
      from: countryBacc,
    });

    //check result
    assert.equal(tx1, false, "Did not successfully accept returning traveler");
    TruffleAssert.eventEmitted(bArrive, "arrival");
  });

  it("Test case 9: Deactivate worker B", async () => {
    await globalInstance.updateWorkerStatus(workerB, "BBB", false, {
      from: countryBacc,
    });

    let tx1 = await globalInstance.checkActiveWorker(workerB, {
      from: countryBacc,
    });

    //check result
    assert.equal(tx1, false, "Did not successfully deactivate worker");
  });

  /*==============================Negative Test cases Section==============================*/

  it("Test case 10: Should not be able to register worker if not country", async () => {
    try {
      let aWorker = await globalInstance.addNewWorker("fakeWorker", workerA, {
        from: accounts[5],
      });
    } catch (error) {
      //check result
      assert.equal(
        error.message,
        "Returned error: VM Exception while processing transaction: revert [ERROR] No such country has been registered -- Reason given: [ERROR] No such country has been registered.",
        "Did not successfully catch invalid country error for registering worker"
      );
    }
  });

  it("Test case 11: Should not be able to write travel record if not worker", async () => {
    try {
      let listforA = [countryBacc];
      let aDepart = await globalInstance.travelerDeparture(
        passportUUID1,
        listforA,
        {
          from: accounts[5],
        }
      );
    } catch (error) {
      //check result
      //console.log(error);

      assert.equal(
        error.message,
        "Returned error: VM Exception while processing transaction: revert [Error] This is an active worker only action -- Reason given: [Error] This is an active worker only action.",
        "Did not successfully catch invalid worker error for writing travel record"
      );
    }
  });

  it("Test case 12: Should not be able to accept traveller if not worker", async () => {
    try {
      let aArrive = await globalInstance.acceptTraveler(passportUUID1, {
        from: accounts[5], //workerB
      });
    } catch (error) {
      //check result
      //console.log(error);

      //error message emitted from passport.sol
      assert.equal(
        error.message,
        "Returned error: VM Exception while processing transaction: revert [Error] This is an active worker only action -- Reason given: [Error] This is an active worker only action.",
        "Did not successfully catch invalid worker error for accepting traveler"
      );
    }
  });

  it("Test case 13: Should not be able to reject traveller if not worker", async () => {
    try {
      let bReject = await globalInstance.rejectTraveler(passportUUID2, {
        from: accounts[5], //workerA
      });
    } catch (error) {
      //check result
      //console.log(error);

      //error message emitted from passport.sol
      assert.equal(
        error.message,
        "Returned error: VM Exception while processing transaction: revert [Error] This is an active worker only action -- Reason given: [Error] This is an active worker only action.",
        "Did not successfully catch invalid worker error for rejecting traveler"
      );
    }
  });

  it("Test case 14: Should not be able to update worker status if not country", async () => {
    try {
      await globalInstance.updateWorkerStatus(workerB, "BBB", false, {
        from: accounts[5],
      });
    } catch (error) {
      //check result
      //console.log(error);

      //error message emitted from passport.sol
      assert.equal(
        error.message,
        "Returned error: VM Exception while processing transaction: revert [ERROR] No such country has been registered -- Reason given: [ERROR] No such country has been registered.",
        "Did not successfully catch invalid country error for updating worker status"
      );
    }
  });

  it("Test case 15: Should not be able to update worker status if not own country", async () => {
    try {
      await globalInstance.updateWorkerStatus(workerB, "BBB", false, {
        from: countryAacc,
      });
    } catch (error) {
      //check result
      //console.log(error);

      //error message emitted from global.sol
      assert.equal(
        error.message,
        "Returned error: VM Exception while processing transaction: revert Cannot update status of worker from another country -- Reason given: Cannot update status of worker from another country.",
        "Did not successfully catch wrong country error for updating worker status"
      );
    }
  });

  it("Test case 16: Should not be able to write travel record if travel list is empty", async () => {
    try {
      let listforA = [];
      let aDepart = await globalInstance.travelerDeparture(
        passportUUID1,
        listforA,
        {
          from: workerA,
        }
      );
    } catch (error) {
      //check result
      //console.log(error);

      //error message emitted from passport.sol
      assert.equal(
        error.message,
        "Returned error: VM Exception while processing transaction: revert [Error] Empty Travel list -- Reason given: [Error] Empty Travel list.",
        "Did not successfully catch empty travel list error for writing travel record"
      );
    }
  });
});
