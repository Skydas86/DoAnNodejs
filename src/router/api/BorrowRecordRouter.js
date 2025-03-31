
const express = require('express');
const router = express.Router();
const borrowRecordController = require('../../controllers/api/borrowRecordController')
const { IsAdmin, IsUser } = require('../../middlewares/IsAdmin');

router.get('/', borrowRecordController.getAllBorrowRecords);
router.get('/:id', borrowRecordController.getBorrowRecordById); 
router.post('/',  borrowRecordController.createBorrowRecord);
router.delete('/:id', borrowRecordController.deleteBorrowRecord);
router.put('/status/:id', borrowRecordController.updateBorrowRecordStatus); 

module.exports = router;