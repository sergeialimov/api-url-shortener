const express = require('express');
const router = express.Router();

const website_controller = require('../controllers/website.controller');


router.post('/api/shorturl/new', website_controller.website_new);

router.get('/', website_controller.website_default);

module.exports = router;