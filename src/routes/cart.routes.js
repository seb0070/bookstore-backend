const router = require('express').Router();
const cartController = require('../controllers/cart.controller');
const { authenticate } = require('../middlewares/auth.middleware');

/**
 * @swagger
 * /api/cart/items:
 *   post:
 *     summary: 장바구니에 상품 추가
 *     tags: [Cart]
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
 *               - quantity
 *             properties:
 *               book_id:
 *                 type: integer
 *               quantity:
 *                 type: integer
 *                 minimum: 1
 *     responses:
 *       201:
 *         description: 추가 성공
 */
router.post('/items', authenticate, cartController.addToCart);

/**
 * @swagger
 * /api/cart:
 *   get:
 *     summary: 내 장바구니 조회
 *     tags: [Cart]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: 조회 성공
 */
router.get('/', authenticate, cartController.getMyCart);

/**
 * @swagger
 * /api/cart/items/{id}:
 *   patch:
 *     summary: 장바구니 상품 수량 변경
 *     tags: [Cart]
 *     security:
 *       - BearerAuth: []
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
 *             required:
 *               - quantity
 *             properties:
 *               quantity:
 *                 type: integer
 *                 minimum: 1
 *     responses:
 *       200:
 *         description: 수정 성공
 */
router.patch('/items/:id', authenticate, cartController.updateCartItem);

/**
 * @swagger
 * /api/cart/items/{id}:
 *   delete:
 *     summary: 장바구니에서 상품 제거
 *     tags: [Cart]
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
 *         description: 제거 성공
 */
router.delete('/items/:id', authenticate, cartController.removeFromCart);

/**
 * @swagger
 * /api/cart:
 *   delete:
 *     summary: 장바구니 비우기
 *     tags: [Cart]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: 비우기 성공
 */
router.delete('/', authenticate, cartController.clearCart);

module.exports = router;