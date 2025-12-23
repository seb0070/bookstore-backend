const router = require('express').Router();
const controller = require('../controllers/user.controller');
const { authenticate, authorize } = require('../middlewares/auth.middleware');
const validate = require('../middlewares/validate.middleware');
const { createUserSchema, updateMeSchema } = require('../schemas/user.schema');

// 회원가입
router.post('/', validate(createUserSchema), controller.createUser);

// 내 정보
router.get('/me', authenticate, controller.getMe);
router.patch('/me', authenticate, validate(updateMeSchema), controller.updateMe);

// ADMIN
router.get('/', authenticate, authorize(['ADMIN']), controller.getUsers);
router.get('/:id', authenticate, authorize(['ADMIN']), controller.getUserById);
router.patch(
    '/:id/deactivate',
    authenticate,
    authorize(['ADMIN']),
    controller.deactivateUser
);

module.exports = router;
