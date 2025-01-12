const express = require('express');
const { verifyToken, authorizationRole } = require('../middlewares/authMiddleware');
const { getUsers, createUser, updateUser, deleteUser } = require('../controllers/userController');

const router = express.Router();

// Admin-only routes for user management
router.get('/', verifyToken, authorizationRole(['Admin']), getUsers);
router.post('/', verifyToken, authorizationRole(['Admin']), createUser);
router.put('/:id', verifyToken, authorizationRole(['Admin']), updateUser);
router.delete('/:id', verifyToken, authorizationRole(['Admin']), deleteUser);

module.exports = router;
