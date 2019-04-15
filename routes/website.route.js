const express = require('express');
const router = express.Router();

const website_controller = require('../controllers/website.controller');


// a simple test url to check that all of our files are communicating correctly.
router.get('/test', website_controller.test);
module.exports = router;