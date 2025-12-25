const router = require('express').Router();
const likeController = require('../controllers/like.controller');
const { authenticate } = require('../middlewares/auth.middleware');

/**
 * @swagger
 * /api/reviews/{id}/like:
 *   post:
 *     summary: 리뷰 좋아요 토글
 *     tags: [Likes]
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
 *         description: 좋아요 토글 성공
 */
router.post('/reviews/:id/like', authenticate, likeController.toggleReviewLike);

/**
 * @swagger
 * /api/reviews/{id}/like:
 *   delete:
 *     summary: 리뷰 좋아요 취소
 *     tags: [Likes]
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
 *         description: 좋아요 취소 성공
 */
router.delete('/reviews/:id/like', authenticate, likeController.toggleReviewLike);

/**
 * @swagger
 * /api/comments/{id}/like:
 *   post:
 *     summary: 댓글 좋아요 토글
 *     tags: [Likes]
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
 *         description: 좋아요 토글 성공
 */
router.post('/comments/:id/like', authenticate, likeController.toggleCommentLike);

/**
 * @swagger
 * /api/comments/{id}/like:
 *   delete:
 *     summary: 댓글 좋아요 취소
 *     tags: [Likes]
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
 *         description: 좋아요 취소 성공
 */
router.delete('/comments/:id/like', authenticate, likeController.toggleCommentLike);

module.exports = router;