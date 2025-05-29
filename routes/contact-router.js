const express = require('express');
const router = express.Router();

const contactControllers = require('../controllers/contact-controller');

router.route('/').post( contactControllers.contactUs);

module.exports = router;
