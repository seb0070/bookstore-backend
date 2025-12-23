const express = require('express');
const router = express.Router();
const bookController = require('../controllers/book.controller');

// 책 목록 조회
router.get('/books', bookController.getBooks);
// 단건 조회
router.get('/books/:id', bookController.getBookById);

// 생성
router.post('/books', bookController.createBook);

router.patch('/:id', bookController.updateBook);

module.exports = router;
