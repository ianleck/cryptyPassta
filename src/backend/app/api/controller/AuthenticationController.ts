import express = require('express');
import {
  findAllWorkers,
  findWorker,
  createWorker,
  login,
  validateUser,
  freezeWorker,
  viewWorkerStatus
} from '../service/AuthenticationService';

var router = express.Router();

// middleware that is specific to this router
router.use(function timeLog(req, res, next) {
  console.log(
    '[' + Date.now() + '|AuthenticationController] Request: ' + req.url
  );
  next();
});

router.get('/findAllWorkers', function(req, res) {
  findAllWorkers()
    .then(result => {
      res
        .status(200)
        .json(result)
        .send();
    })
    .catch(error => {
      res.status(400).send();
    });
});

router.get('/findWorker', function(req, res) {
  findWorker(req.query.username)
    .then(result => {
      res
        .status(200)
        .json(result)
        .send();
    })
    .catch(error => {
      res.status(400).send();
    });
});

router.post('/createWorker', function(req, res) {
  createWorker(req.body)
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

router.get('/login', function(req, res) {
  login(req.query.username, req.query.password)
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

export = router;
