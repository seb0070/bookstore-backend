const router = require('express').Router();
const controller = require('../controllers/user.controller');
const { authenticate, authorize } = require('../middlewares/auth.middleware');
const validate = require('../middlewares/validate.middleware');
const { createUserSchema, updateMeSchema } = require('../schemas/user.schema');
const { validateBody } = require('../middlewares/validate.middleware');

// 회원가입
router.post('/', validate(createUserSchema), controller.createUser);

// 내 정보
router.get('/me', authenticate, controller.getMe);
router.patch('/me', authenticate, validate(updateMeSchema), controller.updateMe);

// ADMIN
router.get('/', authenticate, authorize(['ADMIN']), controller.getUsers);
router.get('/:id', authenticate, authorize(['ADMIN']), controller.getUserById);
// 관리자 유저 상태 변경
router.patch(
    '/:id/status',
    authenticate,
    authorize(['ADMIN']),
    validateBody(updateUserStatusSchema),
    controller.updateUserStatus
);
module.exports = router;
