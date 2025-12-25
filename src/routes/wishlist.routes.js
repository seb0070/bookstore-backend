const router = require('express').Router();
const wishlistController = require('../controllers/wishlist.controller');
const { authenticate } = require('../middlewares/auth.middleware');

/**
 * @swagger
 * /api/wishlist:
 *   post:
 *     summary: 위시리스트에 추가
 *     tags: [Wishlist]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - book_id
 *             properties:
 *               book_id:
 *                 type: integer
 *     responses:
 *       201:
 *         description: 추가 성공
 */
router.post('/', authenticate, wishlistController.addToWishlist);

/**
 * @swagger
 * /api/wishlist:
 *   get:
 *     summary: 내 위시리스트 조회
 *     tags: [Wishlist]
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
router.get('/', authenticate, wishlistController.getMyWishlist);

/**
 * @swagger
 * /api/wishlist/{bookId}:
 *   delete:
 *     summary: 위시리스트에서 제거
 *     tags: [Wishlist]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: bookId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: 제거 성공
 */
router.delete('/:bookId', authenticate, wishlistController.removeFromWishlist);

module.exports = router;