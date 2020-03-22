import express = require('express');
import {
  findAllWorkers,
  findWorker,
  createWorker,
  login,
  validateUser
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

router.get('/validateUser', async (req, res) => {
  const { username } = req.query;
  const token = req.headers['authorization'];
  try {
    const result = await validateUser(username, token);
    res.status(200).send(result);
  } catch (err) {
    res.status(400).send(err.message);
  }
});

export = router;
