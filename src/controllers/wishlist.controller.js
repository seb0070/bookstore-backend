const wishlistService = require('../services/wishlist.service');

exports.addToWishlist = async (req, res, next) => {
    try {
        const { book_id } = req.body;
        const result = await wishlistService.addToWishlist(req.user.id, book_id);
        res.status(201).json(result);
    } catch (err) {
        next(err);
    }
};

exports.getMyWishlist = async (req, res, next) => {
    try {
        const wishlist = await wishlistService.getMyWishlist(req.user.id, req.query);
        res.status(200).json(wishlist);
    } catch (err) {
        next(err);
    }
};

exports.removeFromWishlist = async (req, res, next) => {
    try {
        const { bookId } = req.params;
        const result = await wishlistService.removeFromWishlist(req.user.id, bookId);
        res.status(200).json(result);
    } catch (err) {
        next(err);
    }
};

module.exports = exports;