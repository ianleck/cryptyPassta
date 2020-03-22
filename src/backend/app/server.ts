// Top Level Required modules
require('dotenv').config();
import express = require("express");
import bodyParser = require('body-parser')
import firebase = require("firebase");
import Web3 from 'web3';

// Import controllers for routing
import AuthenticationController from "./api/controller/AuthenticationController";

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

// Initialize Web3 Interface
const web3 = new Web3(Web3.givenProvider || "ws://localhost:8545");

// Initialize Express Application
const app: express.Application = express();

// Listen on port
app.listen(port, () => {
  console.log(`Server is listening on port: ${port}`);
  console.log(project.name);
});

//use body parser for json
app.use(bodyParser.json())

// Load controllers for routing
app.use('/', AuthenticationController);

export { database, web3, app };
