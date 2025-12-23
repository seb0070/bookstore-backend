const express = require('express');
const router = express.Router();
const bookController = require('../controllers/book.controller');
const { authenticate, authorize } = require('../middlewares/auth.middleware');
const validateBody = require('../middlewares/validate.middleware');
const { createBookSchema } = require('../validators/book.validator');


/**
 * @swagger
 * /api/books:
 *   get:
 *     summary: 책 목록 조회
 *     tags: [Books]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *       - in: query
 *         name: size
 *         schema:
 *           type: integer
 *       - in: query
 *         name: keyword
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: 조회 성공
 */
// 전체 조회
router.get('/', bookController.getBooks);


/**
 * @swagger
 * /api/books/{id}:
 *   get:
 *     summary: 책 단건 조회
 *     tags: [Books]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: 조회 성공
 *       404:
 *         description: 책 없음
 */
// 단건 조회
router.get('/:id', bookController.getBookById);

/**
 * @swagger
 * /api/books:
 *   post:
 *     summary: 책 등록 (ADMIN)
 *     tags: [Books]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - authors
 *               - categories
 *               - price
 *               - published_year
 *             properties:
 *               title:
 *                 type: string
 *               authors:
 *                 type: array
 *                 items:
 *                   type: string
 *               categories:
 *                 type: array
 *                 items:
 *                   type: string
 *               price:
 *                 type: number
 *               published_year:
 *                 type: number
 *     responses:
 *       201:
 *         description: 생성 성공
 *       401:
 *         description: 인증 실패
 *       403:
 *         description: 권한 없음
 */
// 생성
router.post(
    '/',
    authenticate,
    authorize(['ROLE_ADMIN']),
    validateBody(createBookSchema),
    bookController.createBook
);

/**
 * @swagger
 * /api/books/{id}:
 *   patch:
 *     summary: 책 정보 수정 (ADMIN)
 *     tags: [Books]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               authors:
 *                 type: array
 *                 items:
 *                   type: string
 *               categories:
 *                 type: array
 *                 items:
 *                   type: string
 *               price:
 *                 type: number
 *               published_year:
 *                 type: number
 *               stock_quantity:
 *                 type: integer
 *     responses:
 *       200:
 *         description: 수정 성공
 *       400:
 *         description: 잘못된 요청
 *       401:
 *         description: 인증 실패
 *       403:
 *         description: 권한 없음
 *       404:
 *         description: 책 없음
 */
// 수정
router.patch(
    '/:id',
    authenticate,
    authorize(['ROLE_ADMIN']),
    bookController.updateBook
);

/**
 * @swagger
 * /api/books/{id}:
 *   delete:
 *     summary: 책 삭제 (ADMIN)
 *     tags: [Books]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: 삭제 성공
 *       401:
 *         description: 인증 실패
 *       403:
 *         description: 권한 없음
 *       404:
 *         description: 책 없음
 */
// 삭제
router.delete(
    '/:id',
    authenticate,
    authorize(['ROLE_ADMIN']),
    bookController.deleteBook
);
module.exports = router;