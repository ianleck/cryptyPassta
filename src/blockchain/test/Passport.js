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
});
