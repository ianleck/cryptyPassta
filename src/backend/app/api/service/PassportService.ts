import { plainToClass } from 'class-transformer';
import { PassportEntity } from '../model/PassportEntity';
import PassportRepository = require('../dao/PassportRepository');
import {
  PassportContract,
  GlobalContract,
  CountryAccountAddress
} from '../../server';
import { v4 as uuidv4 } from 'uuid';

export { getPassport, createPassport, freezePassport };

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
  return 'Success, gas used: ' + transaction.gasUsed;
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
