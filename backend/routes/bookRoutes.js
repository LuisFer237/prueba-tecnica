const express = require('express');
const router = express.Router();
const bookController = require('../controllers/bookController');
const authMiddleware = require('../middleware/authMiddleware');

router.post('/', authMiddleware, bookController.createBook);
router.get('/', authMiddleware, bookController.getBooks);
router.delete('/:id', authMiddleware, bookController.deleteBook);
router.put('/:id', authMiddleware, bookController.updateBook);

module.exports = router;
