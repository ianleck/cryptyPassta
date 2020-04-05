import { plainToClass } from 'class-transformer';
import { PassportEntity } from '../model/PassportEntity';
import PassportRepository = require('../dao/PassportRepository');
import {
  PassportContract,
  GlobalContract,
  CountryAccountAddress
} from '../../server';
import { v4 as uuidv4 } from 'uuid';

export {
  getPassport,
  createPassport,
  freezePassport,
  searchPassport,
  getAllCountries,
  viewPassportContractEvents,
  viewGlobalContractEvents,
  travelerDeparture
};

async function getPassport() {
  const g = await PassportContract.methods.abc().call();
  console.log(g);
  return g;
}

async function findPassport(passportUUID: string) {
  let passport = await PassportRepository.findPassport(passportUUID);
  return plainToClass(PassportEntity, passport);
}

async function createPassport(passport: object) {
  let passportEntity = plainToClass(PassportEntity, passport);
  passportEntity.setPassportUUID(uuidv4());

  //estimate gas
  let gasEst = await PassportContract.methods
    .createPassport(passportEntity.getPassportUUID())
    .estimateGas({ from: CountryAccountAddress });

  //create in blockchain
  let transaction = await PassportContract.methods
    .createPassport(passportEntity.getPassportUUID())
    .send({ from: CountryAccountAddress, gas: gasEst });

  await PassportRepository.createPassport(
    passportEntity,
    passportEntity.getPassportUUID()
  );
  return (
    'Success, gas used: ' +
    transaction.gasUsed +
    ', Passport UUID: ' +
    passportEntity.getPassportUUID()
  );
}

async function freezePassport(passportUUID: string) {
  //estimate gas
  let gasEst = await PassportContract.methods
    .freezePassport(passportUUID)
    .estimateGas({ from: CountryAccountAddress });

  //create in blockchain
  let transaction = await PassportContract.methods
    .freezePassport(passportUUID)
    .send({ from: CountryAccountAddress, gas: gasEst });

  let passport = await PassportRepository.findPassport(passportUUID);
  return plainToClass(PassportEntity, passport);
}

async function searchPassport(passportUUID: string): Promise<any> {
  let blockchainPassport = await PassportContract.methods
    .viewPassport(passportUUID)
    .call({ from: CountryAccountAddress });
  let blockchainPassportRecords = await PassportContract.methods
    .viewPassportTravelRecords(passportUUID)
    .call({ from: CountryAccountAddress });

  if (blockchainPassport.isActive === false)
    throw new Error('Passport is frozen');

  //get passport entity and add passport records
  let passportEntity = await PassportRepository.findPassport(passportUUID);
  passportEntity = {
    ...passportEntity,
    travelRecord: blockchainPassportRecords
  };
  return passportEntity;
}

async function getAllCountries(): Promise<any> {
  let countryList = await PassportContract.methods
    .viewRegisteredCountryList()
    .call();
  let countryKeyValuePair: { [key: string]: string } = {};
  countryList.forEach((i: any[]) => {
    if (i[0] === true) {
      countryKeyValuePair[i[1]] = i[2];
    }
  });
  return countryKeyValuePair;
}

//travelerDeparture
async function travelerDeparture(
  passportUUID: string,
  countryList: string[]
): Promise<any> {
  //search passport, if frozen, return error;
  let passport = await searchPassport(passportUUID);

  //get all countries,
  let blockchainCountryList = await getAllCountries();
  let destinationAddressList: string[] = [];
  //check the address is within the list
  countryList.forEach(element => {
    if (element in blockchainCountryList) {
      destinationAddressList.push(blockchainCountryList[element]);
    }
  });

  console.log(destinationAddressList);

  //estimate gas
  let gasEst = await GlobalContract.methods
    .travelerDeparture(passportUUID, destinationAddressList)
    .estimateGas({ from: CountryAccountAddress });

  //create in blockchain
  let transaction = await GlobalContract.methods
    .travelerDeparture(passportUUID, destinationAddressList)
    .send({ from: CountryAccountAddress, gas: gasEst });

  return 'Success, gas used: ' + transaction.gasUsed;
}

async function viewPassportContractEvents() {
  return await PassportContract.getPastEvents('allEvents');
}

async function viewGlobalContractEvents() {
  return await GlobalContract.getPastEvents('allEvents');
}
