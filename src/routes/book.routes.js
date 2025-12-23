const express = require('express');
const router = express.Router();
const bookController = require('../controllers/book.controller');
const { authenticate, authorize } = require('../middlewares/auth.middleware');
const validateBody = require('../middlewares/validate.middleware');
const { createBookSchema } = require('../validators/book.validator');

// 전체 조회
router.get('/', bookController.getBooks);

// 단건 조회
router.get('/:id', bookController.getBookById);

// 생성
router.post(
    '/',
    authenticate,
    authorize(['ROLE_ADMIN']),
    validateBody(createBookSchema),
    bookController.createBook
);
// 수정
router.patch(
    '/:id',
    authenticate,
    authorize(['ROLE_ADMIN']),
    bookController.updateBook
);
// 삭제
router.delete(
    '/:id',
    authenticate,
    authorize(['ROLE_ADMIN']),
    bookController.deleteBook
);
module.exports = router;