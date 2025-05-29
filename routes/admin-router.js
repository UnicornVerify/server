const express = require('express');
const router = express.Router();

const adminMiddleware = require('../middlewares/admin-middleware');

const adminControllers = require('../controllers/admin-controller');

router.route('/register').post(adminControllers.register);
router.route('/login').post(adminControllers.login);
router.route('/auth').get(adminMiddleware, adminControllers.authAdmin);
router.route('/logout').get(adminMiddleware, adminControllers.logout);

router.route('/get-users').get(adminMiddleware, adminControllers.getUsers);
router.route('/get-admins').get(adminMiddleware, adminControllers.getAdmins);
router.route('/get-contacts').get(adminMiddleware, adminControllers.getContacts);

router.route('/upgrade-plan').patch(adminMiddleware, adminControllers.upgradePlan);

module.exports = router;