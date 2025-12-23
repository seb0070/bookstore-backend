const express = require('express');
const router = express.Router();
const bookController = require('../controllers/book.controller');

// 전체 조회
router.get('/', bookController.getBooks);

// 단건 조회
router.get('/:id', bookController.getBookById);

// 생성
router.post('/', bookController.createBook);

// 수정
router.patch('/:id', bookController.updateBook);

// 삭제
router.delete('/:id', bookController.deleteBook);

module.exports = router;