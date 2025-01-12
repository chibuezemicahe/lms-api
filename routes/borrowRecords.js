const express = require('express');
const router = express.Router();
const {verifyToken, authorizationRole} = require('../middlewares/authMiddleware')
const borrowRecordController = require('../controllers/borrowRecordsController');


router.get('/borrowed', verifyToken, authorizationRole([1,2]), borrowRecordController.viewBorrowRecords);

module.exports = router;