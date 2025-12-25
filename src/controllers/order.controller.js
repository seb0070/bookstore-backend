const orderService = require('../services/order.service');

exports.createOrder = async (req, res, next) => {
    try {
        const order = await orderService.createOrder(req.user.id, req.body.items);
        res.status(201).json(order);
    } catch (err) {
        next(err);
    }
};

exports.getMyOrders = async (req, res, next) => {
    try {
        const orders = await orderService.getMyOrders(req.user.id, req.query);
        res.status(200).json(orders);
    } catch (err) {
        next(err);
    }
};

exports.getOrderById = async (req, res, next) => {
    try {
        const { id } = req.params;
        const order = await orderService.getOrderById(id, req.user.id);
        res.status(200).json(order);
    } catch (err) {
        next(err);
    }
};

exports.updateOrderStatus = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { status } = req.body;
        const order = await orderService.updateOrderStatus(id, status);
        res.status(200).json(order);
    } catch (err) {
        next(err);
    }
};

// ADMIN
exports.getAllOrders = async (req, res, next) => {
    try {
        const orders = await orderService.getAllOrders(req.query);
        res.status(200).json(orders);
    } catch (err) {
        next(err);
    }
};