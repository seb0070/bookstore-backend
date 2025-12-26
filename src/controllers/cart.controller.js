const cartService = require('../services/cart.service');

exports.addToCart = async (req, res, next) => {
    try {
        const result = await cartService.addToCart(req.user.id, req.body);
        res.status(201).json(result);
    } catch (err) {
        next(err);
    }
};

exports.getMyCart = async (req, res, next) => {
    try {
        const cart = await cartService.getMyCart(req.user.id);
        res.status(200).json(cart);
    } catch (err) {
        next(err);
    }
};

exports.updateCartItem = async (req, res, next) => {
    try {
        const { id } = req.params;
        const result = await cartService.updateCartItem(req.user.id, id, req.body);
        res.status(200).json(result);
    } catch (err) {
        next(err);
    }
};

exports.removeFromCart = async (req, res, next) => {
    try {
        const { id } = req.params;
        const result = await cartService.removeFromCart(req.user.id, id);
        res.status(204).send();
    } catch (err) {
        next(err);
    }
};

exports.clearCart = async (req, res, next) => {
    try {
        const result = await cartService.clearCart(req.user.id);
        res.status(204).send();
    } catch (err) {
        next(err);
    }
};

module.exports = exports;