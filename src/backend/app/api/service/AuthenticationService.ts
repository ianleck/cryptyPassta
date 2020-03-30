import crypto = require('crypto');
import { plainToClass } from 'class-transformer';
import { WorkerEntity } from '../model/WorkerEntity';
import WorkerRepository = require('../dao/WorkerRepository');
import { GlobalContract, CountryAccountAddress } from '../../server';
import jwt = require('jsonwebtoken');

export { findAllWorkers, findWorker, createWorker, login, validateUser };

async function findAllWorkers() {
  let workerArray = await WorkerRepository.findAllWorkers();
  let workerEntityArray: WorkerEntity[] = [];
  workerArray.forEach(element => {
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

  await WorkerRepository.createWorker(workerEntity, workerEntity.getUsername());
  //create in blockchain
  let transaction = await GlobalContract.methods
    .addNewWorker(
      workerEntity.getUsername(),
      workerEntity.getBlockchainAddress()
    )
    .send({ from: CountryAccountAddress });
  return 'Success, gas used: ' + transaction.gasUsed;
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

async function validateUser(token: string | undefined) {
  if (token === undefined || token === '') throw new Error('Invalid token');

  let decodedUsername: string = JSON.parse(
    JSON.stringify(jwt.verify(token?.substring(7), 'SECRET'))
  );

  try {
    await findWorker(decodedUsername);
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
