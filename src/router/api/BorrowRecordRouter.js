
const express = require('express');
const router = express.Router();
const borrowRecordController = require('../../controllers/api/borrowRecordController')
const AuthMiddleware = require('../../middlewares/IsLogin');
const IsAdmin = require('../../middlewares/IsAdmin');

router.post('/', AuthMiddleware, borrowRecordController.addRecord);
router.get('/', borrowRecordController.getAll);
router.get('/status/:status', borrowRecordController.getRecordsByStatus);
router.delete('/:id', IsAdmin, borrowRecordController.deleteRecord);
router.put('/:id', IsAdmin, borrowRecordController.updateStatus);
router.get('/:id', borrowRecordController.getRecordById);

module.exports = router;