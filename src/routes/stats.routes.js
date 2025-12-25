const router = require('express').Router();
const statsController = require('../controllers/stats.controller');
const { authenticate, authorize } = require('../middlewares/auth.middleware');

/**
 * @swagger
 * /api/stats/books:
 *   get:
 *     summary: 도서 통계 (ADMIN)
 *     tags: [Stats]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: 통계 조회 성공
 *       403:
 *         description: 권한 없음
 */
router.get('/books', authenticate, authorize(['ADMIN']), statsController.getBookStats);

/**
 * @swagger
 * /api/stats/users:
 *   get:
 *     summary: 사용자 통계 (ADMIN)
 *     tags: [Stats]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: 통계 조회 성공
 *       403:
 *         description: 권한 없음
 */
router.get('/users', authenticate, authorize(['ADMIN']), statsController.getUserStats);

/**
 * @swagger
 * /api/stats/orders:
 *   get:
 *     summary: 주문 통계 (ADMIN)
 *     tags: [Stats]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: 통계 조회 성공
 *       403:
 *         description: 권한 없음
 */
router.get('/orders', authenticate, authorize(['ADMIN']), statsController.getOrderStats);

module.exports = router;