import express = require('express');
import { getPassport } from '../service/PassportService';

var router = express.Router();

// middleware that is specific to this router
router.use(function timeLog(req, res, next) {
  console.log('[' + Date.now() + '|PassportController] Request: ' + req.url);
  next();
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

export = router;
