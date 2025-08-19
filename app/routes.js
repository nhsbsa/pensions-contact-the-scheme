// External dependencies
const express = require('express');

const router = express.Router();

// Add your routes here - above the module.exports line

router.use('/v1', require('./views/v1/_routes'));


module.exports = router;

