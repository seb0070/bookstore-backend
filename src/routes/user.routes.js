const router = require('express').Router();
const controller = require('../controllers/user.controller');
const { authenticate, authorize } = require('../middlewares/auth.middleware');
const validate = require('../middlewares/validate.middleware');
const { updateMeSchema, updateUserStatusSchema } = require('../validators/user.validator');

/**
 * @swagger
 * /api/users/me:
 *   get:
 *     summary: 내 정보 조회
 *     tags: [Users]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: 조회 성공
 *       401:
 *         description: 인증 실패
 */
router.get('/me', authenticate, controller.getMe);

/**
 * @swagger
 * /api/users/me:
 *   patch:
 *     summary: 내 정보 수정
 *     tags: [Users]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: 수정 성공
 */
router.patch('/me', authenticate, validate(updateMeSchema), controller.updateMe);

/**
 * @swagger
 * /api/users/me:
 *   delete:
 *     summary: 계정 삭제
 *     tags: [Users]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: 삭제 성공
 */
router.delete('/me', authenticate, controller.deleteMe);

/**
 * @swagger
 * /api/users:
 *   get:
 *     summary: 사용자 목록 조회 (ADMIN)
 *     tags: [Users]
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
 *       403:
 *         description: 권한 없음
 */
router.get('/', authenticate, authorize(['ADMIN']), controller.getUsers);

/**
 * @swagger
 * /api/users/{id}:
 *   get:
 *     summary: 사용자 상세 조회 (ADMIN)
 *     tags: [Users]
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
 *         description: 조회 성공
 *       404:
 *         description: 사용자 없음
 */
router.get('/:id', authenticate, authorize(['ADMIN']), controller.getUserById);

/**
 * @swagger
 * /api/users/{id}/status:
 *   patch:
 *     summary: 사용자 상태 변경 (ADMIN)
 *     tags: [Users]
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
 *               - status
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [ACTIVE, BLOCKED, DELETED]
 *     responses:
 *       200:
 *         description: 변경 성공
 */
router.patch(
    '/:id/status',
    authenticate,
    authorize(['ADMIN']),
    validate(updateUserStatusSchema),
    controller.updateUserStatus
);

module.exports = router;