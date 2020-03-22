import express = require('express');
import { getPassport } from '../service/PassportService';

var router = express.Router();

// middleware that is specific to this router
router.use(function timeLog(req, res, next) {
  console.log('[' + Date.now() + '|PassportController] Request: ' + req.url);
  next();
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

export = router;
