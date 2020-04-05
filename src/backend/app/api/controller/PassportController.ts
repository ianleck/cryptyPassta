import express = require('express');
import {
  getPassport,
  createPassport,
  freezePassport,
  searchPassport,
  viewPassportContractEvents,
  viewGlobalContractEvents
} from '../service/PassportService';
import { validateUser } from '../service/AuthenticationService';

var router = express.Router();

// middleware that is specific to this router
router.use(function timeLog(req, res, next) {
  console.log('[' + Date.now() + '|PassportController] Request: ' + req.url);
  validateUser(req.headers['authorization'])
    .then(() => {
      next();
    })
    .catch(error => {
      res
        .status(400)
        .json(error.message)
        .send();
    });
});

router.get('/yolo', function(req, res) {
  getPassport()
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

router.post('/createPassport', function(req, res) {
  createPassport(req.body)
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

router.post('/freezePassport', function(req, res) {
  freezePassport(req.query.passportUUID)
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

router.get('/searchPassport', function(req, res) {
  searchPassport(req.query.passportUUID)
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

//todo util methods for retrieving events

router.get('/viewPassportContractEvents', function(req, res) {
  viewPassportContractEvents()
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

router.get('/viewGlobalContractEvents', function(req, res) {
  viewGlobalContractEvents()
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
