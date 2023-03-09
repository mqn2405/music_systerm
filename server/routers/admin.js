const express =  require('express');
const adminController = require('../controllers/admin');
const router = express.Router();

router.post('/login', adminController.LOGIN);
router.post('/account', adminController.createNewAccount);
router.get('/account', adminController.getAllAccount);
router.delete('/account/:adminId', adminController.deleteAccount);
router.put('/status/:adminId', adminController.changeStatus);
router.get('/statistical', adminController.getAdminStatistical);

module.exports = router;
