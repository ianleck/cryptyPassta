import crypto = require('crypto');
import { plainToClass } from "class-transformer";
import { WorkerEntity } from "../model/WorkerEntity";
import WorkerRepo = require("../dao/WorkerRepository");
import jwt = require('jsonwebtoken');

export { findAllWorkers, findWorker, createWorker, login, validateUser }

async function findAllWorkers() {
    let workerArray = await WorkerRepo.findAllWorkers();
    return workerArray.map((worker) => plainToClass(WorkerEntity, worker));
}

async function findWorker(username: string) {
    let worker = await WorkerRepo.findWorker(username);
    return plainToClass(WorkerEntity, worker);
}

async function createWorker(worker: object) {
    let workerEntity = plainToClass(WorkerEntity, worker);

    let salt = makeid(5);
	let hashedPassword = crypto.createHash('sha1').update(workerEntity.getPassword().concat(salt)).digest('hex');
	// let worker: WorkerEntity = new WorkerEntity("username", hashedPassword, salt, "123123");
    workerEntity.setSalt(salt)
    workerEntity.setPassword(hashedPassword);

    await WorkerRepo.createWorker(workerEntity, workerEntity.getUsername());
    return "Success";
}

async function login(username: string, password: string) {

    let worker = await findWorker(username);
    let salt = worker.getSalt();
    let verifyPassword = crypto.createHash('sha1').update(password.concat(salt)).digest('hex');
    if(verifyPassword === worker.getPassword()) {
        //sign token with username and salt
        return jwt.sign(worker.getUsername(), salt); 
    } else {
        throw new Error("Invalid password");
    }
}

async function validateUser(username: string, token: string | undefined) {

    if(token === undefined || token === "")
        throw new Error("Invalid token");

    let worker = await findWorker(username);
    let decodedUsername = jwt.verify(token?.substring(7), worker.getSalt());
    if(username === decodedUsername)
        return true;
    else
        throw new Error("Invalid token");
}

function makeid(length: number) {
    var result           = '';
    var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for ( var i = 0; i < length; i++ ) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}

