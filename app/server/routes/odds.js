const express = require('express');
const router = express.Router();

const { getOdds } = require('../controllers/oddsController');

router.get('/', getOdds);

module.exports = router;
