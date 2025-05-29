const express = require('express');
const router = express.Router();

const userMiddleware = require('../middlewares/user-middleware');

const userControllers = require('../controllers/user-controller');

router.route('/').get(userControllers.auth);
router.route('/register').post(userControllers.register);
router.route('/login').post(userControllers.login);
router.route('/auth').get(userMiddleware, userControllers.authUser);
router.route('/logout').get(userMiddleware, userControllers.logout);

module.exports = router;