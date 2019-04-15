const express = require('express');
const router = express.Router();

const website_controller = require('../controllers/website.controller');


router.post('/api/shorturl/new', website_controller.website_new);

router.get('/', website_controller.website_default);

router.get('/api/shorturl/:num', website_controller.website_open_short);

module.exports = router;