const express = require('express');
const router = express.Router();

router.use('/user', require('./user'));
router.use('/category', require('./category'));
router.use('/book', require('./book'));

module.exports = router;
