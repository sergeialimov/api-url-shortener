const express = require('express');
const router = express.Router();

const website_controller = require('../controllers/website.controller');


// a simple test url to check that all of our files are communicating correctly.
router.get('/test', website_controller.test);

router.post('/api/shorturl/new', website_controller.website_new);

router.get('/', website_controller.website_default);

module.exports = router;