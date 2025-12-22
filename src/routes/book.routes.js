const express = require('express');
const router = express.Router();
const bookController = require('../controllers/book.controller');

// 책 목록 조회
router.get('/books', bookController.getBooks);

module.exports = router;
