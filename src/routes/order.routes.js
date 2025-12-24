const router = require('express').Router();
const orderController = require('../controllers/order.controller');
const { authenticate, authorize } = require('../middlewares/auth.middleware');

// USER
router.post('/', authenticate, orderController.createOrder);
router.get('/me', authenticate, orderController.getMyOrders);

// ADMIN
router.get('/', authenticate, authorize(['ADMIN']), orderController.getAllOrders);

module.exports = router;
