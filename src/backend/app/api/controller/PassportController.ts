import express = require('express');
import {
  getPassport,
  createPassport,
  freezePassport
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

router.get('/yolo', async (req, res) => {
  const { passportUUID } = req.query;
  const token = req.headers['authorization'];
  try {
    const result = await getPassport();
    res.status(200).send(result);
  } catch (err) {
    res.status(400).send(err.message);
  }
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

export = router;
