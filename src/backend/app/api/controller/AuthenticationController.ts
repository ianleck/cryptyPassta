import express = require('express');
import {
  findAllWorkers,
  findWorker,
  createWorker,
  login,
  validateUser,
  freezeWorker,
  viewWorkerStatus,
  citizenLogin
} from '../service/AuthenticationService';

var router = express.Router();

// middleware that is specific to this router
router.use(function timeLog(req, res, next) {
  console.log(
    '[' + Date.now() + '|AuthenticationController] Request: ' + req.url
  );
  next();
});

router.get('/findAllWorkers', async (req, res) => {
  try {
    const result = await findAllWorkers();
    res.status(200).send(result);
  } catch (err) {
    res.status(400).send();
  }
});

router.get('/findWorker', async (req, res) => {
  const { username } = req.query;
  try {
    const result = await findWorker(username);
    res.status(200).send(result);
  } catch (err) {
    res.status(400).send();
  }
});

router.post('/createWorker', async function(req, res) {
  const worker = req.body;
  try {
    const result = await createWorker(worker);
    res.status(200).send(result);
  } catch (err) {
    res.status(400).send(err.message);
  }
});

router.get('/login', async (req, res) => {
  const { username, password } = req.query;
  try {
    const result = await login(username, password);
    res.status(200).send(result);
  } catch (err) {
    res.status(400).send(err.message);
  }
});

router.get('/validateUser', function(req, res) {
  validateUser(req.headers['authorization'])
    .then(result => {
      res
        .status(200)
        .json(result)
        .send();
    })
    .catch(error => {
      res
        .status(400)
        .json(error.message)
        .send();
    });
});

router.post('/freezeWorker', function(req, res) {
  freezeWorker(req.query.username)
    .then(result => {
      res
        .status(200)
        .json(result)
        .send();
    })
    .catch(error => {
      res
        .status(400)
        .json(error.message)
        .send();
    });
});

router.get('/viewWorkerFreezeStatus', function(req, res) {
  viewWorkerStatus(req.query.username)
    .then(result => {
      res
        .status(200)
        .json(result)
        .send();
    })
    .catch(error => {
      res
        .status(400)
        .json(error.message)
        .send();
    });
});

router.get('/citizenLogin', function(req, res) {
  citizenLogin(req.query.citizenIC, req.query.dateOfBirth)
    .then(result => {
      res
        .status(200)
        .json(result)
        .send();
    })
    .catch(error => {
      res
        .status(400)
        .json(error.message)
        .send();
    });
});

export = router;
