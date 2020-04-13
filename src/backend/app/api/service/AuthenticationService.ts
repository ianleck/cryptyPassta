import crypto = require('crypto');
import { plainToClass } from 'class-transformer';
import { WorkerEntity } from '../model/WorkerEntity';
import WorkerRepository = require('../dao/WorkerRepository');
import PassportRepository = require('../dao/PassportRepository');
import {
  PassportContract,
  GlobalContract,
  CountryAccountAddress
} from '../../server';
import jwt = require('jsonwebtoken');
import { PassportEntity } from '../model/PassportEntity';

export {
  findAllWorkers,
  findWorker,
  createWorker,
  login,
  validateUser,
  freezeWorker,
  viewWorkerStatus,
  citizenLogin
};

async function freezeWorker(username: string) {
  let worker = await findWorker(username);
  let transaction = await GlobalContract.methods
    .updateWorkerStatus(
      worker.getBlockchainAddress(),
      worker.getUsername(),
      false
    )
    .send({ from: CountryAccountAddress });
  return 'Success, gas used: ' + transaction.gasUsed;
}

async function viewWorkerStatus(username: string) {
  let worker = await findWorker(username);
  let transaction = await GlobalContract.methods
    .checkActiveWorker(worker.getBlockchainAddress())
    .call({ from: CountryAccountAddress });
  return transaction;
}

async function findAllWorkers() {
  let workerArray = await WorkerRepository.findAllWorkers();
  //convert to entity and remove salt and password
  let workerEntityArray: WorkerEntity[] = [];
  Object.values(workerArray).forEach(element => {
    let workerEntity: WorkerEntity = plainToClass(WorkerEntity, element);
    workerEntity.setPassword('');
    workerEntity.setSalt('');
    workerEntityArray.push(workerEntity);
  });
  return workerEntityArray;
}

async function findWorker(username: string) {
  let worker = await WorkerRepository.findWorker(username);
  return plainToClass(WorkerEntity, worker);
}

async function createWorker(worker: object) {
  let workerEntity = plainToClass(WorkerEntity, worker);

  let salt = makeid(5);
  let hashedPassword = crypto
    .createHash('sha1')
    .update(workerEntity.getPassword().concat(salt))
    .digest('hex');
  workerEntity.setSalt(salt);
  workerEntity.setPassword(hashedPassword);

  try {
    await WorkerRepository.findWorker(workerEntity.getUsername());
    throw new Error('Worker exists');
  } catch (error) {
    //if unable to find worker, process
    //create in blockchain
    let transaction = await GlobalContract.methods
      .addNewWorker(
        workerEntity.getUsername(),
        workerEntity.getBlockchainAddress()
      )
      .send({ from: CountryAccountAddress });

    await WorkerRepository.createWorker(
      workerEntity,
      workerEntity.getUsername()
    );
    return 'Success, gas used: ' + transaction.gasUsed;
  }
}

async function login(username: string, password: string) {
  const worker = await findWorker(username);
  const salt = worker.getSalt();
  const verifyPassword = crypto
    .createHash('sha1')
    .update(password.concat(salt))
    .digest('hex');
  if (verifyPassword === worker.getPassword()) {
    //sign token with username and salt
    return jwt.sign(worker.getUsername(), 'SECRET');
  } else {
    throw new Error('Invalid password');
  }
}

async function citizenLogin(citizenIC: string, dateOfBirth: string) {
  //find passport UUID first
  let passport = await PassportRepository.findPassportByNationalIC(citizenIC);
  let passportEntity = plainToClass(PassportEntity, passport);

  //then compare dob
  if (passportEntity.getDateOfBirth() !== dateOfBirth)
    throw new Error('Invalid Citizen Login Credentials');

  //then get the records from passport
  let blockchainPassport = await PassportContract.methods
    .viewPassport(passportEntity.getPassportUUID())
    .call({ from: CountryAccountAddress });
  let blockchainPassportRecords = await PassportContract.methods
    .viewPassportTravelRecords(passportEntity.getPassportUUID())
    .call({ from: CountryAccountAddress });
  if (blockchainPassport.isActive === false)
    throw new Error('Passport is frozen');

  //then return
  passport = {
    ...passport,
    travelRecord: blockchainPassportRecords
  };
  return passportEntity;
}

async function validateUser(token: string | undefined) {
  if (token === undefined || token === '') throw new Error('Invalid token');

  let decodedUsername: string = JSON.parse(
    JSON.stringify(jwt.verify(token?.substring(7), 'SECRET'))
  );

  try {
    return await findWorker(decodedUsername);
  } catch (error) {
    throw new Error('Invalid token');
  }
}

function makeid(length: number) {
  var result = '';
  var characters =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  var charactersLength = characters.length;
  for (var i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}
