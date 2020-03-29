// Top Level Required modules
require('dotenv').config();
import express = require('express');
import bodyParser = require('body-parser');
import firebase = require('firebase');
import Web3 from 'web3';
import { Contract } from 'web3-eth-contract';
import {
  getPassportContract,
  getGlobalContract
} from './api/util/SmartContractInitializer';

// Import controllers for routing
import AuthenticationController from './api/controller/AuthenticationController';
import PassportController from './api/controller/PassportController';

// Determine Port Number
let port = process.env.PORT || 4000;

// Initialize Firebase Database
let project = firebase.initializeApp({
  apiKey: process.env.API_KEY,
  authDomain: process.env.AUTH_DOMAIN,
  databaseURL: process.env.DATABASE_URL,
  projectId: process.env.PROJECT_ID,
  storageBucket: process.env.STORAGE_BUCKET,
  messagingSenderId: process.env.MESSAGING_SENDER_ID,
  appId: process.env.APP_ID
});
const database: firebase.database.Database = firebase.database();

// Initialize Web3 Interface and Smart Contracts
// const web3 = new Web3(Web3.givenProvider || 'ws://localhost:9418');
const web3 = new Web3('ws://localhost:' + process.env.GANACHE_PORT_NUMBER);
let PassportContract: Contract, GlobalContract: Contract;

if (process.env.COUNTRY_BLOCKCHAIN_ACCOUNT_ADDRESS === undefined)
  process.exit(0);
let CountryAccountAddress = process.env.COUNTRY_BLOCKCHAIN_ACCOUNT_ADDRESS;

getPassportContract(web3, process.env.PASSPORT_CONTRACT_ADDRESS)
  .then(initializedPassportContract => {
    PassportContract = initializedPassportContract;
  })
  .catch(error => {
    console.log(error);
    process.exit(0);
  });

getGlobalContract(web3, process.env.GLOBAL_CONTRACT_ADDRESS)
  .then(initializedGlobalContract => {
    GlobalContract = initializedGlobalContract;
  })
  .catch(error => {
    console.log(error);
    process.exit(0);
  });

// Initialize Express Application
const app: express.Application = express();

// Listen on port
app.listen(port, () => {
  console.log(`Server is listening on port: ${port}`);
  console.log(project.name);
});

// Use body parser for json
app.use(bodyParser.json());

// Enable CORS
app.all('/', function(req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'X-Requested-With');
  next();
});

// Load controllers for routing
app.use('/auth', AuthenticationController);

// Load controllers for routing
app.use('/passport', PassportController);

export { database, PassportContract, GlobalContract, CountryAccountAddress };
