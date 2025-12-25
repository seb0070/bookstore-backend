const router = require('express').Router();
const reviewController = require('../controllers/review.controller');
const { authenticate } = require('../middlewares/auth.middleware');

/**
 * @swagger
 * /api/books/{bookId}/reviews:
 *   post:
 *     summary: 리뷰 작성
 *     tags: [Reviews]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: bookId
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - rating
 *               - content
 *             properties:
 *               rating:
 *                 type: integer
 *                 minimum: 1
 *                 maximum: 5
 *               content:
 *                 type: string
 *     responses:
 *       201:
 *         description: 리뷰 작성 성공
 */
router.post('/books/:bookId/reviews', authenticate, reviewController.createReview);

/**
 * @swagger
 * /api/books/{bookId}/reviews:
 *   get:
 *     summary: 책의 리뷰 목록 조회
 *     tags: [Reviews]
 *     parameters:
 *       - in: path
 *         name: bookId
 *         required: true
 *         schema:
 *           type: integer
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *       - in: query
 *         name: size
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: 조회 성공
 */
router.get('/books/:bookId/reviews', reviewController.getBookReviews);

/**
 * @swagger
 * /api/reviews/me:
 *   get:
 *     summary: 내가 작성한 리뷰 목록
 *     tags: [Reviews]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *       - in: query
 *         name: size
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: 조회 성공
 */
router.get('/reviews/me', authenticate, reviewController.getMyReviews);

/**
 * @swagger
 * /api/reviews/{id}:
 *   get:
 *     summary: 리뷰 상세 조회
 *     tags: [Reviews]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: 조회 성공
 */
router.get('/reviews/:id', reviewController.getReviewById);

/**
 * @swagger
 * /api/reviews/{id}:
 *   patch:
 *     summary: 리뷰 수정
 *     tags: [Reviews]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               rating:
 *                 type: integer
 *               content:
 *                 type: string
 *     responses:
 *       200:
 *         description: 수정 성공
 */
router.patch('/reviews/:id', authenticate, reviewController.updateReview);

/**
 * @swagger
 * /api/reviews/{id}:
 *   delete:
 *     summary: 리뷰 삭제
 *     tags: [Reviews]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: 삭제 성공
 */
router.delete('/reviews/:id', authenticate, reviewController.deleteReview);

module.exports = router;