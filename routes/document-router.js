const express = require('express');
const router = express.Router();

const userMiddleware = require('../middlewares/user-middleware');
const adminMiddleware = require('../middlewares/admin-middleware');
const documentControllers = require('../controllers/document-controller');
const upload = require('../configs/multer');

router.post('/add', upload.array(['images']), userMiddleware, documentControllers.uploadDocument);
router.get('/user/docs', userMiddleware, documentControllers.userDocuments);
router.delete('/delete', userMiddleware, documentControllers.deleteDocumentById);

router.get('/list', adminMiddleware, documentControllers.documentList);
router.patch('/preview', adminMiddleware, documentControllers.changePreview);

module.exports = router;
