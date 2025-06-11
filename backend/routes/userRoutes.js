const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const authMiddleware = require('../middleware/authMiddleware');

router.get('/', authMiddleware, userController.getUsers);
router.get('/:id', authMiddleware, userController.getUserById);
router.delete('/:id', authMiddleware, userController.deleteUser);
router.put('/:id', authMiddleware, userController.updateUser);

module.exports = router;
