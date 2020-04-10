const TruffleAssert = require("truffle-assertions");
const Passport = artifacts.require("./Passport.sol");
const Global = artifacts.require("./Global.sol");

contract("Passport", (accounts) => {
  let passportInstance;
  const UUID = "SGD123";
  const SGInstance = accounts[1];
  let globalAddress;

  before(async () => {
    passportInstance = await Passport.deployed();
    globalInstance = await Global.deployed();
  });

  it("Test case 1: deploys successfully", async () => {
    const address = passportInstance.address;
    assert.notEqual(address, 0x0);
    assert.notEqual(address, "");
    assert.notEqual(address, null);
    assert.notEqual(address, undefined);
  });

  it("Test case 2: Link Global.sol to Passport.sol", async () => {
    await passportInstance.setGlobalAddress(globalInstance.address, {
      from: accounts[0],
    });

    let result = await passportInstance.checkGlobalAddress({
      from: accounts[0],
    });

    //console.log(result);
    globalAddress = result;

    assert.equal(result, globalInstance.address);
  });

  it("Test case 3: Freeze Global.sol address", async () => {
    await passportInstance.freezeGlobalChange({
      from: accounts[0],
    });

    let result = await passportInstance.checkGlobalChange({
      from: accounts[0],
    });

    //console.log(result);
    globalAddress = result;

    assert.equal(
      result,
      false,
      "Did not successfully freeze changes to Global.sol address"
    );
  });

  //Negative test case
  it("Test case 4: Attempt to change Global.sol address after freezing, expect failure", async () => {
    try {
      await passportInstance.setGlobalAddress(accounts[5], {
        from: accounts[0],
      });
    } catch (error) {
      assert.equal(
        error.message,
        "Returned error: VM Exception while processing transaction: revert [Invalid action] No changes to Global.sol address can be allowed at this time -- Reason given: [Invalid action] No changes to Global.sol address can be allowed at this time.",
        "Did not successfully catch invalid changes to Global.sol address"
      );
    }
  });

  it("Test case 5: should add country successfully", async () => {
    try {
      await passportInstance.viewRegisteredCountry.call(SGInstance);
    } catch (err) {
      assert.ok(/revert/.test(err.message));
      assert.isTrue(
        err.message.includes("[ERROR] No such country has been registered")
      );
      const registeredCountry = await passportInstance.registerCountry(
        SGInstance,
        "SGD"
      );
      assert.equal(
        await passportInstance.viewRegisteredCountry.call(SGInstance),
        "SGD"
      );
      TruffleAssert.eventEmitted(
        registeredCountry,
        "countryRegistrationSuccess"
      );
      TruffleAssert.eventEmitted(registeredCountry, "MinterAdded");
    }
  });

  it("Test case 6: should add passport successfully", async () => {
    try {
      await passportInstance.viewPassport(UUID);
    } catch (err) {
      assert.ok(/revert/.test(err.message));
      assert.isTrue(
        err.message.includes("[ERROR] No such passport has been created")
      );
      const createPassport = await passportInstance.createPassport(UUID, {
        from: SGInstance,
      });
      const retrievedPassport = await passportInstance.viewPassport(UUID);
      const newPassport = [true, "0", SGInstance];
      TruffleAssert.eventEmitted(createPassport, "passportCreationSuccess");
      assert.deepEqual(retrievedPassport, newPassport);
    }
  });

  //Some negative test cases on add Travel records are tested from Global.js since it access is controlled by Global.sol
  it("Test case 7: should be able to add travel records successfully", async () => {
    const createdPassport = await passportInstance.viewPassport(UUID);
    assert.equal(createdPassport.travelRecordLength, "0");
    const timestamp = Math.floor(Date.now() / 1000);
    const addTravelRecord = await passportInstance.addTravelRecord(
      UUID,
      "EXIT",
      accounts[1],
      timestamp,
      { from: accounts[0] } // simulate as owner since global cannot be used to simulate
    );
    TruffleAssert.eventEmitted(addTravelRecord, "travelRecordAdditionSuccess");
    const updatedPassport = await passportInstance.viewPassport(UUID);
    assert.equal(updatedPassport.travelRecordLength, "1");
    const retrievedTravelRecords = await passportInstance.viewPassportTravelRecords(
      UUID
    );

    assert.equal(retrievedTravelRecords.length, "1");
    const newRecord = [SGInstance, "EXIT", timestamp.toString()];
    assert.deepEqual(retrievedTravelRecords[0], newRecord);
  });

  it("Test case 8: should be able to freeze passport successfully", async () => {
    const freezePassport = await passportInstance.freezePassport(UUID, {
      from: SGInstance,
    });
    TruffleAssert.eventEmitted(freezePassport, "freezePassportSuccess");
    const updatedPassport = await passportInstance.viewPassport(UUID);
    assert.equal(updatedPassport.isActive, false);
  });

  it("Test case 9: should return countrylist successfully", async () => {
    try {
      let countrylist = await passportInstance.viewRegisteredCountryList();
      //console.log(countrylist[0]);
      //console.log(accounts[1]);
      assert.equal(countrylist[0].countryAddress, accounts[1]);
    } catch (error) {
      console.log(error);
    }
  });

  /*==============================Negative Test cases Section==============================*/
  it("Test case 10: Should not be able to register country if not owner", async () => {
    try {
      const registeredCountry = await passportInstance.registerCountry(
        SGInstance,
        "SGD",
        {
          from: accounts[5], //not owner
        }
      );
    } catch (error) {
      //check result
      assert.equal(
        error.message,
        "Returned error: VM Exception while processing transaction: revert [INVALID PERMISSION] Owner Required -- Reason given: [INVALID PERMISSION] Owner Required.",
        "Did not successfully catch invalid account error when registering Country"
      );
    }
  });

  it("Test case 11: Should not be able to create passport with non-country account", async () => {
    try {
      const createPassport = await passportInstance.createPassport("BAH1234", {
        from: accounts[5],
      });
    } catch (error) {
      //check result
      assert.equal(
        error.message,
        "Returned error: VM Exception while processing transaction: revert [INVALID PERMISSION] Verified Country Required -- Reason given: [INVALID PERMISSION] Verified Country Required.",
        "Did not successfully catch invalid country account error when creating passport"
      );
    }
  });

  it("Test case 12: Should not be able to create passport with same UUID", async () => {
    try {
      const createPassport = await passportInstance.createPassport(UUID, {
        from: SGInstance,
      });
    } catch (error) {
      //check result
      assert.equal(
        error.message,
        "Returned error: VM Exception while processing transaction: revert [ERROR] A passport with this UUID has already been created -- Reason given: [ERROR] A passport with this UUID has already been created.",
        "Did not successfully catch invalid UUID error when creating passport"
      );
    }
  });

  it("Test case 13: Should not be able to add travel record to an invalid UUID passport", async () => {
    try {
      const timestamp = Math.floor(Date.now() / 1000);
      const addTravelRecord = await passportInstance.addTravelRecord(
        "BAH123",
        "EXIT",
        accounts[1],
        timestamp,
        { from: accounts[0] } // simulate as owner since global cannot be used to simulate
      );
    } catch (error) {
      //check result
      assert.equal(
        error.message,
        "Returned error: VM Exception while processing transaction: revert [ERROR] No such passport has been created -- Reason given: [ERROR] No such passport has been created.",
        "Did not successfully catch invalid UUID error when adding travel records"
      );
    }
  });

  it("Test case 14: Should not be able to add travel record to a frozen passport", async () => {
    try {
      const timestamp = Math.floor(Date.now() / 1000);
      const addTravelRecord = await passportInstance.addTravelRecord(
        UUID,
        "EXIT",
        accounts[1],
        timestamp,
        { from: accounts[0] } // simulate as owner since global cannot be used to simulate
      );
    } catch (error) {
      //check result
      assert.equal(
        error.message,
        "Returned error: VM Exception while processing transaction: revert [ERROR] Passport has been frozen! -- Reason given: [ERROR] Passport has been frozen!.",
        "Did not successfully catch frozen passport error when adding travel records"
      );
    }
  });

  it("Test case 15: Should not be able to freeze passport of another country", async () => {
    try {
      //Create new country
      const registeredCountry = await passportInstance.registerCountry(
        accounts[2],
        "JPN"
      );
      assert.equal(
        await passportInstance.viewRegisteredCountry.call(accounts[2]),
        "JPN"
      );
      TruffleAssert.eventEmitted(
        registeredCountry,
        "countryRegistrationSuccess"
      );
      TruffleAssert.eventEmitted(registeredCountry, "MinterAdded");

      //Create passport
      const createPassport = await passportInstance.createPassport("JPN123", {
        from: accounts[2],
      });
      const retrievedPassport = await passportInstance.viewPassport("JPN123");
      const newPassport = [true, "0", accounts[2]];
      TruffleAssert.eventEmitted(createPassport, "passportCreationSuccess");
      assert.deepEqual(retrievedPassport, newPassport);

      //Attempt to freeze JPN passport with SG acc
      const freezePassport = await passportInstance.freezePassport("JPN123", {
        from: SGInstance,
      });
    } catch (error) {
      //check result
      assert.equal(
        error.message,
        "Returned error: VM Exception while processing transaction: revert [INVALID PERMISSION] Passport Token Issuing Country Required -- Reason given: [INVALID PERMISSION] Passport Token Issuing Country Required.",
        "Did not successfully catch freezing wrong country passport"
      );
    }
  });

  it("Test case 16: Should not be able to view invalid UUID passport", async () => {
    try {
      await passportInstance.viewPassportTravelRecords("BAH123");
    } catch (error) {
      //check result
      assert.equal(
        error.message,
        "Returned error: VM Exception while processing transaction: revert [ERROR] No such passport has been created",
        "Did not successfully catch invalid UUID error when viewing travel records"
      );
    }
  });

  it("Test case 17: Should not be able to view frozen passport", async () => {
    try {
      await passportInstance.viewPassportTravelRecords(UUID);
    } catch (error) {
      //check result
      assert.equal(
        error.message,
        "Returned error: VM Exception while processing transaction: revert [ERROR] Passport has been frozen!",
        "Did not successfully catch frozen passport error when viewing travel records"
      );
    }
  });

  it("Test case 18: Should not be able to view invalid UUID passport", async () => {
    try {
      await passportInstance.viewPassport("BAH123");
    } catch (error) {
      //check result
      assert.equal(
        error.message,
        "Returned error: VM Exception while processing transaction: revert [ERROR] No such passport has been created",
        "Did not successfully catch invalid UUID error when viewing passport"
      );
    }
  });

  it("Test case 19: Should not be able to view invalid country", async () => {
    try {
      await passportInstance.viewRegisteredCountry(accounts[5]);
    } catch (error) {
      //check result
      assert.equal(
        error.message,
        "Returned error: VM Exception while processing transaction: revert [ERROR] No such country has been registered",
        "Did not successfully catch invalid country error when viewing registered Country"
      );
    }
  });
});
