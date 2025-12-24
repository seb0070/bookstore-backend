const orderService = require('../services/order.service');

// POST /orders
exports.createOrder = async (req, res) => {
    const order = await orderService.createOrder(
        req.user.id,
        req.body.items
    );
    res.status(201).json(order);
};

// GET /orders/me
exports.getMyOrders = async (req, res) => {
    const orders = await orderService.getMyOrders(req.user.id);
    res.status(200).json(orders);
};

// GET /orders (ADMIN)
exports.getAllOrders = async (req, res) => {
    const orders = await orderService.getAllOrders();
    res.status(200).json(orders);
};
